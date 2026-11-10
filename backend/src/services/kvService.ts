import { env } from "cloudflare:workers";
import { signOTPData, unsignOTPData } from "./authService";

export type OTPData = {
  otp?: string | undefined;
  companyEmail?: string | undefined;
  companyName?: string | undefined;
  companyPassword?: string | undefined;
  companySize?: number | undefined;
  otpType?: "signup" | "forgot" | undefined;
  subject?: string | undefined;
};

export const getOTPData = async (email: string): Promise<OTPData | null> => {
  const data = (await env.sf_kv.get(`otp:${email}`, {type: "text"}));
  if (!data) {
    return null;
  }
  const decodedData = unsignOTPData(data);
  return decodedData ? decodedData : null;
};

export const canResendOTP = async (email: string): Promise<boolean> => {
  try {
    const data = (await env.sf_kv.getWithMetadata(`otp:${email}`, {
      type: "json",
    })) as { value: OTPData; metadata: { createdAt: string } } | null;
    if (!data?.value) {
      return true;
    }
    const createdAt = new Date(data.metadata.createdAt);
    const now = new Date();
    const elapsedTime = now.getTime() - createdAt.getTime();
    const RESEND_BLOCK_TIME = 60 * 2000; // 2 minute in milliseconds
    return elapsedTime > RESEND_BLOCK_TIME;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const verifyOTP = async (
  otp: string,
  email: string,
  otpType: "signup" | "forgot",
): Promise<OTPData | null> => {
  const data = await getOTPData(email);
  if (!data || !data.otp) return null;
  if (otp !== data.otp) return null;
  if (data.otpType !== otpType) return null;
  await env.sf_kv.delete(`otp:${email}`);
  return data;
};

export const saveOTP = async (email: string, data: OTPData): Promise<void> => {
  await env.sf_kv.put(`otp:${email}`, signOTPData(data), {
    expirationTtl: 60 * 5, // 5 minutes
    metadata: {
      createdAt: new Date(),
    },
  });
};
