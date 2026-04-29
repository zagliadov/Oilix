import { NextResponse } from "next/server";

import { parseLandingContactSubmitPayload } from "@/app/lib/landing/parse-landing-contact-payload";
import { isOrderEmailSendingConfigured } from "@/app/lib/email/order-email-config";
import { sendLandingContactEmail } from "@/app/lib/email/send-landing-contact-email";

/** Nodemailer requires Node.js (not Edge). */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_payload" as const },
      { status: 400 },
    );
  }

  const parsed = parseLandingContactSubmitPayload(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "invalid_payload" as const },
      { status: 400 },
    );
  }

  if (!isOrderEmailSendingConfigured()) {
    return NextResponse.json(
      { error: "email_not_configured" as const },
      { status: 503 },
    );
  }

  const sendResult = await sendLandingContactEmail(parsed.payload);
  if (!sendResult.ok) {
    return NextResponse.json(
      { error: "send_failed" as const },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true as const }, { status: 201 });
}
