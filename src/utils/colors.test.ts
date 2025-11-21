import { expect, test } from "@playwright/test";
import { generateDistinctColors } from "./colors";

test("generateDistinctColors generates distinct colors", () => {
  const count = 5;
  const colors = generateDistinctColors(count);

  expect(colors.length).toBe(count);

  const uniqueColors = new Set(colors);
  expect(uniqueColors.size).toBe(count);
});

