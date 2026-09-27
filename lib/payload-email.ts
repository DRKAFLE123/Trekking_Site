import type { EmailAdapter } from "payload";
import { Resend } from "resend";

const FROM_ADDRESS = process.env.SENDER_EMAIL || "noreply@natureheaventreks.com";
const FROM_NAME = "Nature Heaven Treks & Expedition";

const list = (v: unknown): string[] | undefined => {
  if (!v) return undefined;
  const arr = Array.isArray(v) ? v : [v];
  return arr.map((a: any) => (typeof a === "string" ? a : a?.address)).filter(Boolean);
};

/**
 * Payload email adapter on the Resend SDK we already use for booking mail.
 * Sends admin auth emails (forgot password, verification). Without an API key
 * it logs instead of throwing, so local dev and builds keep working.
 */
export const resendAdapter: EmailAdapter = () => {
  const key = process.env.RESEND_API_KEY;
  const client = key ? new Resend(key) : null;

  return {
    name: "resend",
    defaultFromAddress: FROM_ADDRESS,
    defaultFromName: FROM_NAME,
    sendEmail: async (message) => {
      const to = list(message.to);
      if (!client || !to?.length) {
        console.warn("[payload-email] not sent (no RESEND_API_KEY or recipient):", message.subject);
        return null;
      }
      const from =
        typeof message.from === "string" && message.from
          ? message.from
          : `${FROM_NAME} <${FROM_ADDRESS}>`;
      const { data, error } = await client.emails.send({
        from,
        to,
        cc: list(message.cc),
        bcc: list(message.bcc),
        replyTo: list(message.replyTo),
        subject: String(message.subject || ""),
        html: typeof message.html === "string" ? message.html : undefined,
        text: typeof message.text === "string" ? message.text : String(message.subject || ""),
      });
      if (error) throw new Error(`Resend: ${error.message}`);
      return data;
    },
  };
};
