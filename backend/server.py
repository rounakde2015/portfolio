from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import time
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone, timedelta
import resend
import bcrypt
import jwt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend config
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', '')

# Admin auth config
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = int(os.environ.get('JWT_EXPIRE_HOURS', '2'))
ADMIN_PASSWORD_HASH = bcrypt.hashpw(
    os.environ['ADMIN_PASSWORD'].encode('utf-8'), bcrypt.gensalt()
).decode('utf-8')

# In-memory brute-force tracking: {ip: [(timestamp, count)]}
_login_attempts: dict = {}
MAX_ATTEMPTS = 5
LOCKOUT_WINDOW = 15 * 60  # 15 minutes

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)


# ------------------ Models ------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False
    read: bool = False


class AdminLoginRequest(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    expires_at: datetime


class ReadTogglePayload(BaseModel):
    read: bool


# ------------------ Routes ------------------
@api_router.get("/")
async def root():
    return {"message": "Portfolio API online"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r['timestamp'], str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


def _build_html(name: str, email: str, message: str) -> str:
    safe_msg = message.replace('\n', '<br/>')
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background:#0A0A0A; color:#F4F4F5; padding:32px;">
      <tr><td>
        <h2 style="color:#00E5FF; margin:0 0 16px 0; letter-spacing:1px; text-transform:uppercase; font-size:14px;">New Portfolio Inquiry</h2>
        <h1 style="color:#ffffff; margin:0 0 24px 0; font-size:24px;">{name}</h1>
        <p style="color:#A1A1AA; margin:0 0 8px 0;"><strong style="color:#fff;">Email:</strong> {email}</p>
        <div style="background:#121212; border-left:3px solid #00E5FF; padding:20px; margin-top:24px; color:#F4F4F5; line-height:1.6;">
          {safe_msg}
        </div>
      </td></tr>
    </table>
    """


@api_router.post("/contact")
async def submit_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())

    # Send email via Resend (best effort)
    email_sent = False
    if resend.api_key and NOTIFICATION_EMAIL:
        try:
            params = {
                "from": SENDER_EMAIL,
                "to": [NOTIFICATION_EMAIL],
                "subject": f"Portfolio inquiry — {payload.name}",
                "reply_to": payload.email,
                "html": _build_html(payload.name, payload.email, payload.message),
            }
            await asyncio.to_thread(resend.Emails.send, params)
            email_sent = True
        except Exception as e:
            logger.error(f"Resend email failed: {e}")

    msg.email_sent = email_sent
    doc = msg.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.contact_messages.insert_one(doc)

    return {"status": "success", "id": msg.id, "email_sent": email_sent}


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contacts(_: bool = Depends(lambda: True)):
    """Deprecated: kept for backward compatibility. Prefer /admin/messages."""
    rows = await db.contact_messages.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('timestamp'), str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
        r.setdefault('read', False)
    return rows


# ------------------ Admin Auth ------------------

def _require_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return True


def _check_bruteforce(ip: str):
    now = time.time()
    attempts = [t for t in _login_attempts.get(ip, []) if now - t < LOCKOUT_WINDOW]
    _login_attempts[ip] = attempts
    if len(attempts) >= MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")


def _record_failed_attempt(ip: str):
    _login_attempts.setdefault(ip, []).append(time.time())


@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest, request: Request):
    ip = request.client.host if request.client else "unknown"
    _check_bruteforce(ip)

    if not bcrypt.checkpw(payload.password.encode('utf-8'), ADMIN_PASSWORD_HASH.encode('utf-8')):
        _record_failed_attempt(ip)
        raise HTTPException(status_code=401, detail="Invalid password")

    # Clear attempts on success
    _login_attempts.pop(ip, None)

    exp = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)
    token = jwt.encode(
        {"role": "admin", "exp": exp, "iat": datetime.now(timezone.utc)},
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )
    return AdminLoginResponse(token=token, expires_at=exp)


@api_router.get("/admin/verify")
async def admin_verify(_: bool = Depends(_require_admin)):
    return {"valid": True}


@api_router.patch("/admin/messages/{msg_id}/read", response_model=ContactMessage)
async def toggle_read(msg_id: str, payload: ReadTogglePayload, _: bool = Depends(_require_admin)):
    result = await db.contact_messages.find_one_and_update(
        {"id": msg_id},
        {"$set": {"read": payload.read}},
        projection={"_id": 0},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Message not found")
    if isinstance(result.get('timestamp'), str):
        result['timestamp'] = datetime.fromisoformat(result['timestamp'])
    result.setdefault('read', payload.read)
    return result


@api_router.delete("/admin/messages/{msg_id}")
async def delete_message(msg_id: str, _: bool = Depends(_require_admin)):
    result = await db.contact_messages.delete_one({"id": msg_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"status": "deleted", "id": msg_id}


@api_router.get("/admin/stats")
async def admin_stats(_: bool = Depends(_require_admin)):
    total = await db.contact_messages.count_documents({})
    unread = await db.contact_messages.count_documents({"read": {"$ne": True}})
    return {"total": total, "unread": unread}


@api_router.get("/admin/messages", response_model=List[ContactMessage])
async def list_admin_messages(_: bool = Depends(_require_admin)):
    rows = await db.contact_messages.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('timestamp'), str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
        r.setdefault('read', False)
    return rows


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
