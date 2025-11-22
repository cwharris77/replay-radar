"use client";

import { ReactNode, useEffect, useRef } from "react";

interface TooltipProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  triggerRef: React.RefObject<HTMLElement | null>;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  arrowOffset?: number;
}

export const Tooltip = ({
  isOpen,
  onClose,
  children,
  triggerRef,
  position = "bottom",
  align = "end",

  arrowOffset = 32,
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // Position classes based on props
  const getPositionClasses = () => {
    const positions = {
      top: "bottom-full mb-3",
      bottom: "top-full mt-3",
      left: "right-full mr-3",
      right: "left-full ml-3",
    };

    const alignments = {
      start: position === "top" || position === "bottom" ? "left-0" : "top-0",
      center:
        position === "top" || position === "bottom"
          ? "left-1/2 -translate-x-1/2"
          : "top-1/2 -translate-y-1/2",
      end: position === "top" || position === "bottom" ? "right-0" : "bottom-0",
    };

    return `${positions[position]} ${alignments[align]}`;
  };

  // Arrow position classes
  const getArrowClasses = () => {
    const baseClasses =
      'before:content-[""] before:absolute before:border-8 before:border-transparent after:content-[""] after:absolute after:border-[7px] after:border-transparent';

    const positionClasses = {
      top: `before:top-full before:border-t-border after:top-full after:border-t-card`,
      bottom: `before:bottom-full before:border-b-border after:bottom-full after:border-b-card`,
      left: `before:left-full before:border-l-border after:left-full after:border-l-card`,
      right: `before:right-full before:border-r-border after:right-full after:border-r-card`,
    };

    const alignClasses = {
      start:
        position === "top" || position === "bottom"
          ? `before:left-[var(--arrow-offset)] after:left-[var(--arrow-offset)]`
          : `before:top-[var(--arrow-offset)] after:top-[var(--arrow-offset)]`,
      center:
        position === "top" || position === "bottom"
          ? "before:left-1/2 before:-translate-x-1/2 after:left-1/2 after:-translate-x-1/2"
          : "before:top-1/2 before:-translate-y-1/2 after:top-1/2 after:-translate-y-1/2",
      end:
        position === "top" || position === "bottom"
          ? `before:right-[var(--arrow-offset)] after:right-[var(--arrow-offset)]`
          : `before:bottom-[var(--arrow-offset)] after:bottom-[var(--arrow-offset)]`,
    };

    return `${baseClasses} ${positionClasses[position]} ${alignClasses[align]}`;
  };

  return (
    <div
      ref={tooltipRef}
      className={`absolute w-72 z-[60] ${getPositionClasses()} ${getArrowClasses()}`}
      style={{ "--arrow-offset": `${arrowOffset}px` } as React.CSSProperties}
    >
      <div className='bg-card border border-border rounded-lg shadow-lg overflow-hidden'>
        {children}
      </div>
    </div>
  );
};
