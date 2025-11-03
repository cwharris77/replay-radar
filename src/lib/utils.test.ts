import { expect, test } from "@playwright/test";
import { cn, getBaseUrl } from "./utils";

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

  test("getBaseUrl should prioritize VERCEL_URL", () => {
    const originalVercelUrl = process.env.VERCEL_URL;
    const originalNextAuthUrl = process.env.NEXTAUTH_URL;

    try {
      process.env.VERCEL_URL = "my-app-git-branch-username.vercel.app";
      process.env.NEXTAUTH_URL = "https://production.com";

      const url = getBaseUrl();
      expect(url).toBe("https://my-app-git-branch-username.vercel.app");
    } finally {
      if (originalVercelUrl) {
        process.env.VERCEL_URL = originalVercelUrl;
      } else {
        delete process.env.VERCEL_URL;
      }
      if (originalNextAuthUrl) {
        process.env.NEXTAUTH_URL = originalNextAuthUrl;
      } else {
        delete process.env.NEXTAUTH_URL;
      }
    }
  });

  test("getBaseUrl should use request headers when VERCEL_URL is not set", () => {
    const originalVercelUrl = process.env.VERCEL_URL;
    delete process.env.VERCEL_URL;

    try {
      const mockRequest = new Request("https://example.com", {
        headers: {
          host: "preview-branch.vercel.app",
          "x-forwarded-proto": "https",
        },
      });

      const url = getBaseUrl(mockRequest);
      expect(url).toBe("https://preview-branch.vercel.app");
    } finally {
      if (originalVercelUrl) {
        process.env.VERCEL_URL = originalVercelUrl;
      }
    }
  });

  test("getBaseUrl should fall back to NEXTAUTH_URL", () => {
    const originalVercelUrl = process.env.VERCEL_URL;
    const originalNextAuthUrl = process.env.NEXTAUTH_URL;

    try {
      delete process.env.VERCEL_URL;
      process.env.NEXTAUTH_URL = "https://fallback.com";

      const url = getBaseUrl();
      expect(url).toBe("https://fallback.com");
    } finally {
      if (originalVercelUrl) {
        process.env.VERCEL_URL = originalVercelUrl;
      } else {
        delete process.env.VERCEL_URL;
      }
      if (originalNextAuthUrl) {
        process.env.NEXTAUTH_URL = originalNextAuthUrl;
      } else {
        delete process.env.NEXTAUTH_URL;
      }
    }
  });

  test("getBaseUrl should fall back to localhost when nothing is set", () => {
    const originalVercelUrl = process.env.VERCEL_URL;
    const originalNextAuthUrl = process.env.NEXTAUTH_URL;

    try {
      delete process.env.VERCEL_URL;
      delete process.env.NEXTAUTH_URL;

      const url = getBaseUrl();
      expect(url).toBe("http://localhost:3000");
    } finally {
      if (originalVercelUrl) {
        process.env.VERCEL_URL = originalVercelUrl;
      }
      if (originalNextAuthUrl) {
        process.env.NEXTAUTH_URL = originalNextAuthUrl;
      }
    }
  });
});
