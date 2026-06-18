import { describe, it, expect } from "vitest";
import { feedbackSchema } from "./feedback";

const valid = {
  name: "Ada Rahman",
  email: "ada@example.com",
  subject: "Add a country",
  message: "Could you score Japan next?",
};

describe("feedbackSchema", () => {
  it("accepts a complete, valid submission", () => {
    const result = feedbackSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("trims surrounding whitespace on text fields", () => {
    const result = feedbackSchema.safeParse({ ...valid, name: "  Ada  ", message: "  hi  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ada");
      expect(result.data.message).toBe("hi");
    }
  });

  it("rejects an empty name", () => {
    const result = feedbackSchema.safeParse({ ...valid, name: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects a malformed email", () => {
    const result = feedbackSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects an empty subject", () => {
    const result = feedbackSchema.safeParse({ ...valid, subject: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = feedbackSchema.safeParse({ ...valid, message: "" });
    expect(result.success).toBe(false);
  });

  it("enforces a sane upper bound on message length", () => {
    const result = feedbackSchema.safeParse({ ...valid, message: "x".repeat(5001) });
    expect(result.success).toBe(false);
  });
});
