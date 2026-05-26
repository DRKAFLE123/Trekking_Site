export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  if (!token) {
    console.error("Missing reCAPTCHA token");
    return false;
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY is not defined in environment variables. Failing verification securely.");
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    if (data.success) {
      return true;
    } else {
      console.error("reCAPTCHA validation failed:", data['error-codes']);
      return false;
    }
  } catch (error) {
    console.error("Error communicating with Google reCAPTCHA api:", error);
    return false;
  }
}
