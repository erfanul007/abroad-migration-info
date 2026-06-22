// Validates the About-page feedback form's visible fields. The hidden honeypot ("company")
// is intentionally excluded — the component drops bot submissions where it is non-empty.
import { z } from "zod";

const MESSAGE_MAX = 5000;

export const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().pipe(z.email("Please enter a valid email address")),
  subject: z.string().trim().min(1, "Please enter a subject").max(150, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message")
    .max(MESSAGE_MAX, `Please keep your message under ${MESSAGE_MAX} characters`),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
