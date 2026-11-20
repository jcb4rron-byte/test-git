import "server-only";

// Envío transaccional por la API de Brevo (POST /v3/smtp/email).
// Documentación: https://developers.brevo.com/reference/sendtransacemail (verificar si cambia).

export type OutgoingEmail = {
  to: { email: string; name?: string | null };
  subject: string;
  html: string;
  text: string;
  /** URL de baja: añade List-Unsubscribe (obligatorio en correos comerciales). */
  unsubscribeUrl?: string;
  tags?: string[];
};

export async function sendWithBrevo(email: OutgoingEmail): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;
  if (!apiKey || !fromEmail) throw new Error("Faltan BREVO_API_KEY o EMAIL_FROM");

  const headers: Record<string, string> = {};
  if (email.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${email.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: fromEmail, name: process.env.EMAIL_FROM_NAME || "BARRONVISUAL Check" },
      to: [{ email: email.to.email, ...(email.to.name ? { name: email.to.name } : {}) }],
      subject: email.subject,
      htmlContent: email.html,
      textContent: email.text,
      ...(Object.keys(headers).length ? { headers } : {}),
      ...(email.tags?.length ? { tags: email.tags } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo ${res.status}: ${body.slice(0, 300)}`);
  }
}
