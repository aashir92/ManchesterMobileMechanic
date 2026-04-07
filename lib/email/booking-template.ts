export type BookingEmailPayload = {
  name: string;
  phone: string;
  email?: string;
  message: string;
  submittedAt?: Date;
};

function htmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fmtDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(date);
}

export function renderBookingEmail(payload: BookingEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const email = payload.email?.trim() || "";
  const submittedAt = payload.submittedAt ?? new Date();
  const subject = `New booking request - ${payload.name}`;

  const html = `
  <div style="background:#f2f5f8;padding:24px 12px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#191c1d">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:14px;border:1px solid #dce3ea;overflow:hidden">
      <tr>
        <td style="background:#083D6B;padding:18px 22px;color:#ffffff">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#e6b31e;font-weight:700">Booking Form</div>
          <div style="font-size:24px;line-height:1.25;font-weight:800;margin-top:6px">New Service Enquiry</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 22px 6px">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr><td style="font-size:12px;color:#6b7280;padding-bottom:8px">Submitted</td><td style="font-size:12px;color:#111827;padding-bottom:8px;text-align:right">${htmlEscape(fmtDate(submittedAt))}</td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 22px 8px">
          <div style="font-size:13px;font-weight:700;color:#083D6B;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Customer details</div>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px">
            <tr><td style="padding:10px 12px;color:#6b7280;font-size:13px;width:140px">Name</td><td style="padding:10px 12px;color:#111827;font-size:14px;font-weight:600">${htmlEscape(payload.name)}</td></tr>
            <tr><td style="padding:10px 12px;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Phone</td><td style="padding:10px 12px;color:#111827;font-size:14px;font-weight:600;border-top:1px solid #e5e7eb">${htmlEscape(payload.phone)}</td></tr>
            <tr><td style="padding:10px 12px;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Email</td><td style="padding:10px 12px;color:#111827;font-size:14px;font-weight:600;border-top:1px solid #e5e7eb">${email ? htmlEscape(email) : "Not provided"}</td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 22px 8px">
          <div style="font-size:13px;font-weight:700;color:#083D6B;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Service request</div>
          <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:14px;color:#111827;font-size:14px;line-height:1.6">${htmlEscape(payload.message)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 22px 22px">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:10px">
                <a href="tel:${encodeURIComponent(payload.phone)}" style="display:inline-block;background:#e6b31e;color:#251a00;text-decoration:none;font-weight:700;font-size:13px;padding:10px 14px;border-radius:999px">Call customer</a>
              </td>
              ${
                email
                  ? `<td><a href="mailto:${encodeURIComponent(email)}" style="display:inline-block;background:#ffffff;color:#083d6b;text-decoration:none;font-weight:700;font-size:13px;padding:10px 14px;border-radius:999px;border:1px solid #d1d5db">Reply by email</a></td>`
                  : ""
              }
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;

  const text = [
    "New Service Enquiry",
    `Submitted: ${fmtDate(submittedAt)}`,
    "",
    "Customer details",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${email || "Not provided"}`,
    "",
    "Service request",
    payload.message,
  ].join("\n");

  return { subject, html, text };
}
