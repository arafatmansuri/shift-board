import { sendMail, unsignOTPData } from './mailer';

export type MyMessage = {
	to: string;
	subject: string;
	user: string;
	otp: string;
};

export default {
	async queue(batch, env): Promise<void> {
		for (let message of batch.messages) {
			const email = message.body;
			const emailData = (await env.sf_kv.get(`otp:${email}`, { type: 'text' }));
			if (!emailData) {
				console.error(`No OTP data found for email: ${email}`);
				message.ack();
				continue;
			}

			const { otp, companyEmail, companyName, otpType, subject, } = unsignOTPData(emailData);

			await sendMail({
				to: companyEmail!,
				subject: subject!,
				user: companyName!,
				otp: otp!,
			});

			message.ack();
		}
	},
} satisfies ExportedHandler<Env, string>;
