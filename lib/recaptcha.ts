// Verifies a Google reCAPTCHA v2 token server-side.
//
// verifyRecaptchaDetailed returns a structured result so callers can surface
// the *specific* reason a verification failed — critical for diagnosing prod
// issues like a missing secret key or an expired token, which otherwise all
// collapse into one opaque "verification failed" message.

export type RecaptchaResult = {
  success: boolean;
  reason:
    | "ok"
    | "missing-token"
    | "missing-secret"
    | "network-error"
    | string; // Google error-code(s), e.g. "timeout-or-duplicate"
};

export async function verifyRecaptchaDetailed(
  token: string | undefined,
): Promise<RecaptchaResult> {
  if (!token) {
    console.error("[reCAPTCHA] Missing token");
    return { success: false, reason: "missing-token" };
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    // Most common cause of "works locally, fails in production": the secret
    // env var isn't set on the host. The public site key is inlined at build
    // time (so the widget still renders), but the secret is read at runtime.
    console.error("[reCAPTCHA] RECAPTCHA_SECRET_KEY is not set on the server");
    return { success: false, reason: "missing-secret" };
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`,
      },
    );

    const data = await response.json();
    if (data.success) {
      return { success: true, reason: "ok" };
    }
    const codes: string[] = data["error-codes"] || [];
    console.error("[reCAPTCHA] validation failed:", codes, "hostname:", data.hostname);
    return { success: false, reason: codes.join(",") || "verification-failed" };
  } catch (error) {
    console.error("[reCAPTCHA] Error contacting Google:", error);
    return { success: false, reason: "network-error" };
  }
}

// Backwards-compatible boolean wrapper for existing callers.
export async function verifyRecaptcha(
  token: string | undefined,
): Promise<boolean> {
  return (await verifyRecaptchaDetailed(token)).success;
}

// Turn a failure reason into a short, user-facing hint.
export function recaptchaHint(reason: string): string {
  switch (reason) {
    case "missing-token":
      return "Please tick the “I’m not a robot” box before submitting.";
    case "missing-secret":
      return "Verification is temporarily unavailable on our side. Please contact us to complete your booking.";
    case "timeout-or-duplicate":
      return "Your verification expired. Please tick “I’m not a robot” again and resubmit.";
    case "invalid-input-response":
      return "Verification could not be confirmed. Please tick “I’m not a robot” again.";
    case "network-error":
      return "We couldn’t reach the verification service. Please check your connection and try again.";
    default:
      return "reCAPTCHA verification failed. Please try again.";
  }
}
