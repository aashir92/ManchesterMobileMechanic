import { createClient } from "@/lib/supabase/server";
import { renderBookingEmail } from "@/lib/email/booking-template";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(180).optional().or(z.literal("")),
  message: z.string().trim().min(8).max(5000),
});

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.BOOKING_FROM_EMAIL?.trim();
  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      { error: "Booking email is not configured yet. Please call or WhatsApp us." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid booking request." },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("contact_booking_email")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Could not load booking settings." }, { status: 500 });
  }

  const toEmail = String(data?.contact_booking_email ?? "").trim();
  if (!toEmail) {
    return NextResponse.json(
      { error: "Booking email recipient is not set yet. Please call or WhatsApp us." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const email = payload.email?.trim() || "";
  const { subject, html, text } = renderBookingEmail({
    name: payload.name,
    phone: payload.phone,
    email,
    message: payload.message,
  });

  const { error: sendErr } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject,
    html,
    text,
    replyTo: email || undefined,
  });

  if (sendErr) {
    return NextResponse.json({ error: "Could not send booking request right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
