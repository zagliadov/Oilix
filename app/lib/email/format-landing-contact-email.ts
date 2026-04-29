import "server-only";

export type LandingContactEmailPayload = {
  name: string;
  email: string;
  phone: string;
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

export const formatLandingContactEmail = (payload: LandingContactEmailPayload) => {
  const subject = "Oilix: landing contact form";
  const text = [`Name: ${payload.name}`, `Email: ${payload.email}`, `Phone: ${payload.phone}`].join(
    "\n",
  );
  const html = `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p><p><strong>Email:</strong> ${escapeHtml(payload.email)}</p><p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>`;
  const replyTo = payload.email.trim();
  return { subject, text, html, replyTo };
};
