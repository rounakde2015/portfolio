import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const SENDER = process.env.SENDER_EMAIL || "onboarding@resend.dev";
const NOTIFICATION = process.env.NOTIFICATION_EMAIL || "";

function html(name: string, email: string, message: string): string {
  const safe = message.replace(/\n/g, "<br/>");
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background:#0A0A0A; color:#F4F4F5; padding:32px;">
      <tr><td>
        <h2 style="color:#00E5FF; margin:0 0 16px 0; letter-spacing:1px; text-transform:uppercase; font-size:14px;">New Portfolio Inquiry</h2>
        <h1 style="color:#ffffff; margin:0 0 24px 0; font-size:24px;">${name}</h1>
        <p style="color:#A1A1AA; margin:0 0 8px 0;"><strong style="color:#fff;">Email:</strong> ${email}</p>
        <div style="background:#121212; border-left:3px solid #00E5FF; padding:20px; margin-top:24px; color:#F4F4F5; line-height:1.6;">${safe}</div>
      </td></tr>
    </table>
  `;
}

export async function sendContactNotification(
  name: string,
  email: string,
  message: string,
): Promise<boolean> {
  if (!resend || !NOTIFICATION) return false;
  try {
    await resend.emails.send({
      from: SENDER,
      to: [NOTIFICATION],
      subject: `Portfolio inquiry — ${name}`,
      replyTo: email,
      html: html(name, email, message),
    });
    return true;
  } catch (err) {
    console.error("Resend failed:", err);
    return false;
  }
}
