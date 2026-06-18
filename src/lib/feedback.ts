// src/lib/feedback.ts
// Validation for the About-page feedback form. The visible fields are trimmed
// then checked; the form's hidden honeypot ("company") is handled in the
// component (a non-empty value means a bot and the submission is silently
// dropped), so it is intentionally not part of this schema.
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
