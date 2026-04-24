"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

const bodyPortalSubscribe = (): (() => void) => {
  // `document.body` is stable; no event subscription is required
  return () => {};
};

const getBodyElementClientSnapshot = (): HTMLElement | null => {
  return typeof document === "undefined" ? null : document.body;
};

const getBodyElementServerSnapshot = (): null => {
  return null;
};

const PEEK_ROTATE = 5.5;
const PEEK_PATH = "/landing/TOP.png";
/** Extra translate toward the viewport edge (sticker is wide; without this the figure sits “in the middle” of the box). */
const PEEK_TOWARD_LEFT_EDGE_PX = 72;

type LandingQualityScrollRootProps = {
  children: ReactNode;
};

/**
 * Wraps the quality block so scroll range matches section height, and hosts the
 * “manager peeks in” from the left (portaled to `body` to avoid `fixed` + transformed ancestors).
 */
export const LandingQualityScrollRoot = ({ children }: LandingQualityScrollRootProps) => {
  const scrollRootReference = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRootReference} className="relative w-full">
      <LandingQualityPeekSanya scrollTargetReference={scrollRootReference} />
      {children}
    </div>
  );
};

type LandingQualityPeekSanyaProps = {
  scrollTargetReference: RefObject<HTMLDivElement | null>;
};

const LandingQualityPeekSanya = ({
  scrollTargetReference,
}: LandingQualityPeekSanyaProps) => {
  const prefersReducedMotion = useReducedMotion();
  const bodyElement = useSyncExternalStore(
    bodyPortalSubscribe,
    getBodyElementClientSnapshot,
    getBodyElementServerSnapshot,
  );

  const { scrollYProgress } = useScroll({
    target: scrollTargetReference,
    offset: ["start 0.9", "end 0.12"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.52, 0.74, 0.88, 1],
    [0, 0.15, 0.95, 1, 1, 0.35, 0],
  );
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.11, 0.24, 0.5, 0.68, 0.82, 1],
    [-112, -48, 0, 0, 0, -72, -140],
  );

  const smoothOpacity = useSpring(opacity, { stiffness: 120, damping: 32, mass: 0.35 });
  const smoothX = useSpring(translateX, { stiffness: 90, damping: 28, mass: 0.4 });
  const xTowardEdge = useTransform(smoothX, (value) => value - PEEK_TOWARD_LEFT_EDGE_PX);

  if (prefersReducedMotion === true || bodyElement === null) {
    return null;
  }

  const content = (
    <motion.div
      className="pointer-events-none fixed left-0 w-[min(44vw,240px)] sm:w-[min(36vw,280px)]"
      style={{
        top: "clamp(4.5rem, 28vh, 8.5rem)",
        x: xTowardEdge,
        opacity: smoothOpacity,
        rotate: PEEK_ROTATE,
        zIndex: 12,
        transformOrigin: "left center",
      }}
      aria-hidden
    >
      <div className="relative h-[min(36vh,400px)] w-full">
        <Image
          src={PEEK_PATH}
          alt=""
          fill
          className="object-contain object-bottom-left filter-[drop-shadow(0_8px_24px_rgba(0,0,0,0.45))] dark:filter-[drop-shadow(0_8px_28px_rgba(0,0,0,0.65))]"
          sizes="(max-width: 640px) 44vw, 280px"
          draggable={false}
        />
      </div>
    </motion.div>
  );

  return createPortal(content, bodyElement);
};
