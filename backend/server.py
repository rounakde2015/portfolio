from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone
import resend


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

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


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
async def list_contacts():
    rows = await db.contact_messages.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    for r in rows:
        if isinstance(r.get('timestamp'), str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
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
