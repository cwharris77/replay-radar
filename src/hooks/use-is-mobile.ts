import { useMediaQuery } from "./use-media-query";

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses a breakpoint of 768px (Tailwind's md breakpoint)
 * @returns true if viewport width is less than 768px
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}
