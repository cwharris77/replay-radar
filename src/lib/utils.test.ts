import { expect, test } from "@playwright/test";
import { cn } from "./utils";

test.describe("Utils", () => {
  test("cn should merge class names correctly", () => {
    expect(cn("base-class", "additional-class")).toBe(
      "base-class additional-class"
    );
    expect(cn("base-class", undefined)).toBe("base-class");
    expect(cn("base-class", null)).toBe("base-class");
    expect(cn("base-class", { "conditional-class": true })).toBe(
      "base-class conditional-class"
    );
    expect(cn("base-class", { "conditional-class": false })).toBe("base-class");
  });
});
