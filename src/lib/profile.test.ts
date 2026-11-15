import { describe, it, expect } from "vitest";
import { profileSchema } from "@/lib/schema";
import rawProfile from "@/data/profile.json";

describe("documented study profile", () => {
  it("retains Tanima's study evidence through the profile schema", () => {
    const result = profileSchema.parse(rawProfile);
    const person = result.household.people.find((p) => p.name === "Tanima Hossain");
    expect(person).toHaveProperty("study.cgpa", 3.83);
    expect(person).toHaveProperty("study.english.overall", 7.5);
    expect(person).toHaveProperty("study.admissions.0.documentVerified", false);
  });
  it("rejects out-of-scale grades and language scores", () => {
    const invalid = structuredClone(rawProfile);
    invalid.household.people[1].study!.cgpa = 5;
    expect(profileSchema.safeParse(invalid).success).toBe(false);
    const badEnglish = structuredClone(rawProfile);
    badEnglish.household.people[1].study!.english.overall = 10;
    expect(profileSchema.safeParse(badEnglish).success).toBe(false);
  });
});
