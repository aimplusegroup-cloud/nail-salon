// lib/smsClient.ts

// اگر از سرویس‌دهنده‌ی واقعی استفاده می‌کنی، SDK یا fetch رو اینجا ایمپورت کن
// import Kavenegar from "kavenegar";

export async function sendSMS(to: string, message: string): Promise<void> {
  try {
    // --- نسخه‌ی تستی (Mock) ---
    console.log(`📩 SMS to ${to}: ${message}`);

    // --- نسخه‌ی واقعی (مثال Kavenegar) ---
    // const api = Kavenegar.KavenegarApi({ apikey: process.env.KAVENEGAR_API_KEY! });
    // await new Promise((resolve, reject) => {
    //   api.Send(
    //     {
    //       message,
    //       sender: process.env.SMS_SENDER_NUMBER!,
    //       receptor: to,
    //     },
    //     (response, status) => {
    //       if (status === 200) resolve(response);
    //       else reject(new Error("SMS sending failed"));
    //     }
    //   );
    // });

  } catch (err) {
    console.error("❌ SMS sending error:", err);
    throw err;
  }
}
