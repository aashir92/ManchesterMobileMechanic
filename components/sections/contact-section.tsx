"use client";

import { updateContactPhones } from "@/app/admin/actions";
import type { ContactBlockPublic } from "@/lib/cms/merge-site-content";
import { motion } from "framer-motion";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function ContactSection({
  contact,
  isAdmin = false,
}: {
  contact: ContactBlockPublic;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [disp, setDisp] = useState(contact.phone_display);
  const [tel, setTel] = useState(contact.phone_tel);
  const [wa, setWa] = useState(contact.whatsapp_url);
  const [savingPhones, setSavingPhones] = useState(false);
  const [bookingSending, setBookingSending] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "ok" | "err">("idle");
  const [bookingErr, setBookingErr] = useState<string | null>(null);

  const telHref = contact.phone_tel.replace(/\s/g, "");
  const formspreeId = (process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? "").trim();

  async function savePhones() {
    setSavingPhones(true);
    const fd = new FormData();
    fd.set("contact_phone_display", disp);
    fd.set("contact_phone_tel", tel);
    fd.set("contact_whatsapp_url", wa);
    const r = await updateContactPhones(fd);
    setSavingPhones(false);
    if ("error" in r && r.error) alert(r.error);
    else router.refresh();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBookingStatus("idle");
    setBookingErr(null);

    const n = name.trim();
    const p = phone.trim();
    const m = message.trim();
    const em = email.trim();
    if (!n || !p || !m) {
      alert(
        "Please complete your name, phone number, and a brief description of the service you need so we can help.",
      );
      return;
    }

    if (!formspreeId) {
      setBookingErr(
        "The booking form is not set up yet. Please call us or use WhatsApp and we will help you from there.",
      );
      setBookingStatus("err");
      return;
    }

    const subject = "Service booking request (Manchester Mobile Mechanic)";
    setBookingSending(true);
    try {
      const payload: Record<string, string> = {
        name: n,
        phone: p,
        message: m,
        _subject: subject,
      };
      if (em) {
        payload.email = em;
        payload._replyto = em;
      }

      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        errors?: Array<{ message?: string }>;
      };

      if (!res.ok) {
        const msg =
          data.error ||
          data.errors?.map((x) => x.message).filter(Boolean).join("; ") ||
          "Something went wrong. Please try again or call us.";
        setBookingErr(msg);
        setBookingStatus("err");
        return;
      }

      setBookingStatus("ok");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch {
      setBookingErr("Network error. Please check your connection or call us.");
      setBookingStatus("err");
    } finally {
      setBookingSending(false);
    }
  }

  return (
    <section className="bg-[#083D6B] py-24 text-white" id="contact">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-[#E6B31E]">
            {contact.eyebrow}
          </span>
          <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold md:text-4xl">
            {contact.headline}
          </h2>
          <p className="mt-3 max-w-xl text-white/85">{contact.intro}</p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            {isAdmin ? (
              <div className="mb-2 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#E6B31E]">
                  Phone and WhatsApp (site-wide)
                </p>
                <div className="space-y-2 text-sm">
                  <label className="block text-white/85">
                    Number shown (e.g. 0784 5531351)
                    <input
                      value={disp}
                      onChange={(e) => setDisp(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/25 bg-white/95 px-3 py-2 text-[#191c1d]"
                    />
                  </label>
                  <label className="block text-white/85">
                    Dial number for call links (digits, no spaces)
                    <input
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/25 bg-white/95 px-3 py-2 font-mono text-xs text-[#191c1d]"
                    />
                  </label>
                  <label className="block text-white/85">
                    WhatsApp link (e.g. https://wa.me/447845531351)
                    <input
                      value={wa}
                      onChange={(e) => setWa(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/25 bg-white/95 px-3 py-2 font-mono text-xs text-[#191c1d]"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={savingPhones}
                    onClick={() => void savePhones()}
                    className="mt-2 rounded-lg bg-[#E6B31E] px-4 py-2 text-xs font-bold text-[#251a00] disabled:opacity-50"
                  >
                    {savingPhones ? "Saving…" : "Save numbers"}
                  </button>
                </div>
              </div>
            ) : null}
            <Link
              href={`tel:${telHref}`}
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#E6B31E] px-6 py-4 text-lg font-bold text-[#251a00] shadow-lg transition-transform hover:brightness-110 active:scale-[0.99]"
            >
              <Phone className="h-5 w-5" aria-hidden />
              Call {contact.phone_display}
            </Link>
            <Link
              href={contact.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-lg border-2 border-white/40 bg-white/10 px-6 py-4 text-lg font-bold backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Message on WhatsApp
            </Link>
            <p className="text-sm text-white/70">{contact.email_note}</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md md:p-8"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-4 flex items-center gap-2 text-[#E6B31E]">
              <Calendar className="h-5 w-5" aria-hidden />
              <span className="text-sm font-bold uppercase tracking-wide">Booking form</span>
            </div>
            {!formspreeId ? (
              <p
                className="mb-4 rounded-lg border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-50"
                role="status"
              >
                Add{" "}
                <code className="rounded bg-black/20 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_FORMSPREE_FORM_ID</code>{" "}
                in your site environment so this form can send requests. Until then, use{" "}
                <strong>Call</strong> or <strong>WhatsApp</strong> on the left.
              </p>
            ) : null}
            <label className="mb-2 block text-sm font-medium text-white/90" htmlFor="contact-name">
              Full name <span className="text-[#E6B31E]">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="mb-4 w-full rounded-lg border border-white/25 bg-white/95 px-4 py-3 text-[#191c1d] placeholder:text-[#191c1d]/45 outline-none ring-[#E6B31E] focus-visible:ring-2"
            />
            <label className="mb-2 block text-sm font-medium text-white/90" htmlFor="contact-phone">
              Phone number <span className="text-[#E6B31E]">*</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Best number to reach you on"
              className="mb-4 w-full rounded-lg border border-white/25 bg-white/95 px-4 py-3 text-[#191c1d] placeholder:text-[#191c1d]/45 outline-none ring-[#E6B31E] focus-visible:ring-2"
            />
            <label className="mb-2 block text-sm font-medium text-white/90" htmlFor="contact-email">
              Email address{" "}
              <span className="font-normal text-white/60">(optional)</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@example.com"
              className="mb-4 w-full rounded-lg border border-white/25 bg-white/95 px-4 py-3 text-[#191c1d] placeholder:text-[#191c1d]/45 outline-none ring-[#E6B31E] focus-visible:ring-2"
            />
            <label className="mb-2 block text-sm font-medium text-white/90" htmlFor="contact-message">
              Service details <span className="text-[#E6B31E]">*</span>
            </label>
            <p className="mb-2 text-xs leading-relaxed text-white/65">
              Describe the work you need, your vehicle if relevant, and any preferred time or location. We will
              confirm with you before visiting.
            </p>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Interim service for a 2018 Ford Focus, usually parked at home weekdays after 5pm…"
              className="mb-2 w-full rounded-lg border border-white/25 bg-white/95 px-4 py-3 text-[#191c1d] placeholder:text-[#191c1d]/45 outline-none ring-[#E6B31E] focus-visible:ring-2"
            />
            <p className="mb-6 text-xs text-white/55">
              <span className="text-[#E6B31E]">*</span> Required fields
            </p>
            {bookingStatus === "ok" ? (
              <p
                className="mb-4 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100"
                role="status"
              >
                Thank you. Your booking request was sent. We will get back to you shortly.
              </p>
            ) : null}
            {bookingStatus === "err" && bookingErr ? (
              <p className="mb-4 rounded-lg border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100" role="alert">
                {bookingErr}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={bookingSending || !formspreeId}
              className="w-full rounded-lg bg-[#E6B31E] py-4 text-lg font-bold text-[#251a00] shadow-lg transition-transform hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
            >
              {bookingSending ? "Sending…" : "Send booking request"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
