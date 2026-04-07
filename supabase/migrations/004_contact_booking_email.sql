-- Booking form recipient mailbox for Resend flow.
-- Safe to re-run.

alter table public.site_content
  add column if not exists contact_booking_email text;
