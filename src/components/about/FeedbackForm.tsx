// src/components/about/FeedbackForm.tsx
// Feedback form for the About page. Submits via EmailJS (same service/template
// as the portfolio site, so it lands in the same inbox). The EmailJS public key
// is safe to ship client-side by design. A hidden honeypot field ("company")
// silently drops bot submissions; visible fields are validated with Zod.
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Send } from "lucide-react";
import { feedbackSchema, type FeedbackInput } from "@/lib/feedback";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// EmailJS config (public key is intentionally client-side; recipient is fixed in
// the EmailJS dashboard template, not here).
const EMAILJS_SERVICE_ID = "service_f8zzzlo";
const EMAILJS_TEMPLATE_ID = "template_ixduwrm";
const EMAILJS_PUBLIC_KEY = "t3hK8u9U_TEfQmpi0";

const EMPTY: FeedbackInput = { name: "", email: "", subject: "", message: "" };
type Field = keyof FeedbackInput;
type Status = "idle" | "submitting" | "success" | "error";

export function FeedbackForm() {
  const [values, setValues] = useState<FeedbackInput>(EMPTY);
  const [company, setCompany] = useState(""); // honeypot — must stay empty
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const submitting = status === "submitting";

  function update(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    // Clear the per-field error and any prior result the moment the user edits.
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    if (status === "success" || status === "error") setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot tripped → pretend success, send nothing.
    if (company.trim()) {
      setValues(EMPTY);
      setErrors({});
      setStatus("success");
      return;
    }

    const parsed = feedbackSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        subject: fieldErrors.subject?.[0],
        message: fieldErrors.message?.[0],
      });
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          title: parsed.data.subject,
          name: parsed.data.name,
          email: parsed.data.email,
          time: new Date().toLocaleString("en-GB"),
          message: parsed.data.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setValues(EMPTY);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="max-w-xl">
      <CardContent className="p-4">
        <p className="mb-4 text-sm text-muted-foreground">
          Spotted a stale rule, a missing country, or a scoring call you disagree with? Send a note — it goes straight to my inbox.
        </p>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="feedback-name">Name</Label>
              <Input
                id="feedback-name"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                disabled={submitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "feedback-name-error" : undefined}
                autoComplete="name"
              />
              {errors.name && <p id="feedback-name-error" className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feedback-email">Email</Label>
              <Input
                id="feedback-email"
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                disabled={submitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "feedback-email-error" : undefined}
                autoComplete="email"
              />
              {errors.email && <p id="feedback-email-error" className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-subject">Subject</Label>
            <Input
              id="feedback-subject"
              value={values.subject}
              onChange={(e) => update("subject", e.target.value)}
              disabled={submitting}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "feedback-subject-error" : undefined}
            />
            {errors.subject && <p id="feedback-subject-error" className="text-xs text-destructive">{errors.subject}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-message">Message</Label>
            <Textarea
              id="feedback-message"
              rows={5}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              disabled={submitting}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "feedback-message-error" : undefined}
            />
            {errors.message && <p id="feedback-message-error" className="text-xs text-destructive">{errors.message}</p>}
          </div>

          {/* Honeypot: hidden from users, irresistible to bots. */}
          <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden>
            <Label htmlFor="feedback-company">Company</Label>
            <Input
              id="feedback-company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting}>
              <Send aria-hidden />
              {submitting ? "Sending…" : "Send feedback"}
            </Button>
            <p role="status" aria-live="polite" className="text-sm">
              {status === "success" && <span className="text-primary">Thanks — your message is on its way.</span>}
              {status === "error" && <span className="text-destructive">Something went wrong. Please try again later.</span>}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
