"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

type CharacterState = "idle" | "anticipation" | "error" | "success";

interface InteractiveCharactersProps {
  state: CharacterState;
}

// ── Spring configs ──────────────────────────────────────────────────────
const PUPIL_SPRING = { damping: 18, stiffness: 180, mass: 0.4 };
const SLOW_SPRING = { damping: 30, stiffness: 80, mass: 0.6 };

// ── Max pupil travel in px ──────────────────────────────────────────────
const MAX_PUPIL = 5;

// ── Character layout data ───────────────────────────────────────────────
interface CharConfig {
  id: string;
  // Position & sizing (Tailwind-like but used inline)
  className: string;
  bgColor: string;
  successColor: string;
  // Eye config
  eyeColor: string;
  pupilColor: string;
  eyeSocketSize: number;   // outer socket diameter
  pupilSize: number;        // inner pupil diameter
  eyeSpacing: number;       // gap between eyes in px
  eyeOffsetY: number;       // vertical offset from center of character
  // Mouth
  hasMouth: boolean;
  // Idle breathing
  breathDuration: number;
  breathDelay: number;
  breathAmount: number;
}

const CHARACTERS: CharConfig[] = [
  {
    id: "purple",
    className: "absolute left-[10%] bottom-[35%] w-[35%] h-[50%] rounded-sm",
    bgColor: "#7C3AED",
    successColor: "#8B5CF6",
    eyeColor: "transparent",
    pupilColor: "#000",
    eyeSocketSize: 8,
    pupilSize: 5,
    eyeSpacing: 18,
    eyeOffsetY: -8,
    hasMouth: true,
    breathDuration: 3.2,
    breathDelay: 0,
    breathAmount: -4,
  },
  {
    id: "black",
    className: "absolute left-[40%] bottom-[20%] w-[25%] h-[40%] rounded-sm z-10",
    bgColor: "#000000",
    successColor: "#1a1a1a",
    eyeColor: "transparent",
    pupilColor: "#fff",
    eyeSocketSize: 10,
    pupilSize: 7,
    eyeSpacing: 14,
    eyeOffsetY: -20,
    hasMouth: true,
    breathDuration: 2.8,
    breathDelay: 0.5,
    breathAmount: -3,
  },
  {
    id: "orange",
    className: "absolute left-0 bottom-0 w-[60%] h-[35%] rounded-t-[100px]",
    bgColor: "#FB923C",
    successColor: "#FB9A3C",
    eyeColor: "transparent",
    pupilColor: "#000",
    eyeSocketSize: 9,
    pupilSize: 6,
    eyeSpacing: 28,
    eyeOffsetY: -6,
    hasMouth: true,
    breathDuration: 3.5,
    breathDelay: 0.3,
    breathAmount: -3,
  },
  {
    id: "yellow",
    className: "absolute right-[10%] bottom-0 w-[25%] h-[50%] rounded-t-full",
    bgColor: "#FACC15",
    successColor: "#FDE047",
    eyeColor: "transparent",
    pupilColor: "#000",
    eyeSocketSize: 8,
    pupilSize: 5,
    eyeSpacing: 12,
    eyeOffsetY: -24,
    hasMouth: true,
    breathDuration: 2.6,
    breathDelay: 0.7,
    breathAmount: -5,
  },
];

// ── Blink hook ──────────────────────────────────────────────────────────
function useBlinkSystem(isNear: boolean, state: CharacterState) {
  const [isBlinking, setIsBlinking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleBlink = useCallback(() => {
    // Random interval: 2-4s, faster when cursor is near
    const base = isNear ? 1200 : 2000;
    const range = isNear ? 1000 : 2000;
    const delay = base + Math.random() * range;

    timeoutRef.current = setTimeout(() => {
      setIsBlinking(true);
      // Blink duration: fast normal, slow on error
      const blinkDur = state === "error" ? 300 : 120;
      setTimeout(() => {
        setIsBlinking(false);
        scheduleBlink();
      }, blinkDur);
    }, delay);
  }, [isNear, state]);

  useEffect(() => {
    scheduleBlink();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [scheduleBlink]);

  return isBlinking;
}

// ── Idle look-around hook ────────────────────────────────────────────────
function useIdleLookAround(isIdle: boolean, hasMouseActivity: boolean) {
  const [lookTarget, setLookTarget] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isIdle || hasMouseActivity) {
      setLookTarget({ x: 0, y: 0 });
      return;
    }

    const scheduleLook = () => {
      const delay = 2000 + Math.random() * 3000;
      timeoutRef.current = setTimeout(() => {
        // 30% chance: glance toward form (right side)
        const glanceAtForm = Math.random() < 0.3;
        if (glanceAtForm) {
          setLookTarget({ x: 1, y: 0.1 });
        } else {
          // Random look direction
          setLookTarget({
            x: (Math.random() - 0.5) * 1.6,
            y: (Math.random() - 0.5) * 1.0,
          });
        }
        // Hold look for 0.8-1.5s, then return to center
        setTimeout(() => {
          setLookTarget({ x: 0, y: 0 });
          scheduleLook();
        }, 800 + Math.random() * 700);
      }, delay);
    };

    scheduleLook();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isIdle, hasMouseActivity]);

  return lookTarget;
}

// ── Main component ──────────────────────────────────────────────────────
export default function InteractiveCharacters({ state }: InteractiveCharactersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [normalizedPos, setNormalizedPos] = useState({ x: 0, y: 0 });
  const [cursorDistance, setCursorDistance] = useState(1); // 0=close, 1=far
  const [hasMouseActivity, setHasMouseActivity] = useState(false);
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseTime = useRef(Date.now());
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Blink system
  const isNearCharacters = cursorDistance < 0.4;
  const isBlinking = useBlinkSystem(isNearCharacters, state);

  // Idle look-around
  const idleLookTarget = useIdleLookAround(state === "idle", hasMouseActivity);

  // Track mouse with speed calculation
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized position [-1, 1]
    const nx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    // Distance from center (0 = at center, 1 = at edge or beyond)
    const dist = Math.min(1, Math.sqrt(nx * nx + ny * ny));

    // Speed calculation for squash & stretch
    const now = Date.now();
    const dt = Math.max(1, now - lastMouseTime.current);
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    const speed = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (dt * 2));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
    lastMouseTime.current = now;

    setMousePos({ x: e.clientX, y: e.clientY });
    setNormalizedPos({ x: nx, y: ny });
    setCursorDistance(dist);
    setMouseSpeed(speed);
    setHasMouseActivity(true);

    // Reset activity flag after 2s of no movement
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(() => {
      setHasMouseActivity(false);
      setMouseSpeed(0);
    }, 2000);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, [handleMouseMove]);

  // ── Compute pupil target ────────────────────────────────────────────
  const getPupilTarget = useCallback(() => {
    if (state === "error") {
      return { x: 0, y: 3.5 }; // Look down sadly
    }
    if (state === "success") {
      return { x: 0, y: -1.5 }; // Look up happily
    }
    if (state === "anticipation") {
      return { x: 2, y: -1 }; // Glance toward submit
    }

    // If idle and no mouse activity, use look-around target
    if (!hasMouseActivity && state === "idle") {
      return {
        x: idleLookTarget.x * MAX_PUPIL,
        y: idleLookTarget.y * MAX_PUPIL,
      };
    }

    // Normal cursor tracking
    return {
      x: normalizedPos.x * MAX_PUPIL,
      y: normalizedPos.y * MAX_PUPIL,
    };
  }, [state, hasMouseActivity, normalizedPos, idleLookTarget]);

  const pupilTarget = getPupilTarget();

  // Squash & stretch based on speed
  const stretchX = 1 + mouseSpeed * 0.25;
  const stretchY = 1 - mouseSpeed * 0.15;

  // Focus effect: scale up when cursor is close
  const focusScale = isNearCharacters && state === "idle" ? 1.05 : 1;

  // ── Animations ──────────────────────────────────────────────────────
  const shakeAnimation = state === "error"
    ? { x: [0, -5, 5, -4, 4, -2, 2, 0], transition: { duration: 0.5, delay: 0.1 } }
    : {};

  const bounceAnimation = state === "success"
    ? { y: [0, -14, 0, -7, 0], transition: { duration: 0.6, ease: "easeOut" as const } }
    : {};

  const squishAnimation = state === "anticipation"
    ? { scaleX: [1, 1.1, 1], scaleY: [1, 0.9, 1], transition: { duration: 0.3 } }
    : {};

  const getGroupAnimation = () => {
    if (state === "error") return { y: 8, transition: { duration: 0.5, ease: "easeOut" as const } };
    if (state === "success") return bounceAnimation;
    if (state === "anticipation") return squishAnimation;
    return {};
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-sm aspect-square flex items-end justify-center"
    >
      <motion.div
        className="relative w-full h-full flex items-end justify-center"
        animate={{
          ...getGroupAnimation(),
          scale: focusScale,
        }}
        transition={{ type: "spring", ...SLOW_SPRING }}
      >
        {CHARACTERS.map((char) => (
          <Character
            key={char.id}
            config={char}
            state={state}
            pupilTarget={pupilTarget}
            isBlinking={isBlinking}
            stretchX={stretchX}
            stretchY={stretchY}
            isNear={isNearCharacters}
            shakeAnimation={shakeAnimation}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ── Individual Character ────────────────────────────────────────────────
interface CharacterProps {
  config: CharConfig;
  state: CharacterState;
  pupilTarget: { x: number; y: number };
  isBlinking: boolean;
  stretchX: number;
  stretchY: number;
  isNear: boolean;
  shakeAnimation: Record<string, unknown>;
}

function Character({
  config,
  state,
  pupilTarget,
  isBlinking,
  stretchX,
  stretchY,
  isNear,
  shakeAnimation,
}: CharacterProps) {
  const {
    id, className, bgColor, successColor,
    eyeColor, pupilColor, eyeSocketSize, pupilSize,
    eyeSpacing, eyeOffsetY, hasMouth,
    breathDuration, breathDelay, breathAmount,
  } = config;

  // Eye socket scale for focus/state
  const eyeSocketScale = (() => {
    if (state === "error") return 0.7; // Squint
    if (state === "success") return 1.35; // Wide eyes
    if (isNear && state === "idle") return 1.15; // Slightly wider when cursor near
    return 1;
  })();

  // Pupil scale for state
  const pupilScale = (() => {
    if (state === "error") return 0.7; // Shrink
    if (state === "success") return 1.2; // Bigger
    if (isNear) return 1.1; // More focused
    return 1;
  })();

  // Determine body color
  const bodyColor = state === "success" ? successColor : bgColor;

  // Breathing idle animation
  const idleAnim = state === "idle"
    ? {
        y: [0, breathAmount, 0],
        transition: {
          duration: breathDuration,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut" as const,
          delay: breathDelay,
        },
      }
    : state === "error"
    ? shakeAnimation
    : {};

  return (
    <motion.div
      className={`${className} flex flex-col items-center justify-center`}
      style={{
        backgroundColor: bodyColor,
        transition: "background-color 0.4s ease",
      }}
      animate={idleAnim}
    >
      {/* ── Eye pair container ── */}
      <div
        className="flex items-center justify-center"
        style={{
          gap: eyeSpacing,
          marginTop: eyeOffsetY,
        }}
      >
        <Eye
          socketSize={eyeSocketSize}
          pupilSize={pupilSize}
          pupilColor={pupilColor}
          pupilTarget={pupilTarget}
          isBlinking={isBlinking}
          stretchX={stretchX}
          stretchY={stretchY}
          socketScale={eyeSocketScale}
          pupilScale={pupilScale}
          state={state}
          isLeft
        />
        <Eye
          socketSize={eyeSocketSize}
          pupilSize={pupilSize}
          pupilColor={pupilColor}
          pupilTarget={pupilTarget}
          isBlinking={isBlinking}
          stretchX={stretchX}
          stretchY={stretchY}
          socketScale={eyeSocketScale}
          pupilScale={pupilScale}
          state={state}
          isLeft={false}
        />
      </div>

      {/* ── Mouth ── */}
      {hasMouth && <Mouth charId={id} state={state} pupilColor={pupilColor} />}
    </motion.div>
  );
}

// ── Eye component with socket + pupil ───────────────────────────────────
interface EyeProps {
  socketSize: number;
  pupilSize: number;
  pupilColor: string;
  pupilTarget: { x: number; y: number };
  isBlinking: boolean;
  stretchX: number;
  stretchY: number;
  socketScale: number;
  pupilScale: number;
  state: CharacterState;
  isLeft: boolean;
}

function Eye({
  socketSize,
  pupilSize,
  pupilColor,
  pupilTarget,
  isBlinking,
  stretchX,
  stretchY,
  socketScale,
  pupilScale,
  state,
  isLeft,
}: EyeProps) {
  // Clamp pupil movement so it stays inside socket
  const maxTravel = (socketSize * socketScale - pupilSize * pupilScale) / 2;
  const clampedX = Math.max(-maxTravel, Math.min(maxTravel, pupilTarget.x));
  const clampedY = Math.max(-maxTravel, Math.min(maxTravel, pupilTarget.y));

  // Blink = scaleY to 0
  const blinkScaleY = isBlinking ? 0.05 : 1;

  return (
    <motion.div
      style={{
        width: socketSize,
        height: socketSize,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
      animate={{
        scaleX: socketScale,
        scaleY: socketScale * blinkScaleY,
      }}
      transition={{
        scaleX: { type: "spring", ...SLOW_SPRING },
        scaleY: isBlinking
          ? { duration: 0.08, ease: "easeInOut" as const }
          : { type: "spring", ...SLOW_SPRING },
      }}
    >
      {/* Pupil */}
      <motion.div
        style={{
          width: pupilSize,
          height: pupilSize,
          borderRadius: "50%",
          backgroundColor: pupilColor,
          position: "absolute",
        }}
        animate={{
          x: clampedX,
          y: clampedY,
          scaleX: pupilScale * stretchX,
          scaleY: pupilScale * stretchY,
        }}
        transition={{
          x: { type: "spring", ...PUPIL_SPRING },
          y: { type: "spring", ...PUPIL_SPRING },
          scaleX: { type: "spring", damping: 12, stiffness: 200 },
          scaleY: { type: "spring", damping: 12, stiffness: 200 },
        }}
      />
    </motion.div>
  );
}

// ── Mouth component ─────────────────────────────────────────────────────
interface MouthProps {
  charId: string;
  state: CharacterState;
  pupilColor: string;
}

function Mouth({ charId, state, pupilColor }: MouthProps) {
  // Each character has a different default mouth shape
  const getMouthStyle = () => {
    const color = pupilColor;

    if (charId === "purple") {
      // Default: vertical line (nose). Error: frown. Success: small smile.
      if (state === "error") {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1"
            style={{
              width: 10,
              height: 5,
              borderTop: `2px solid ${color}`,
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
            }}
          />
        );
      }
      if (state === "success") {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1"
            style={{
              width: 8,
              height: 4,
              borderBottom: `2px solid ${color}`,
              borderBottomLeftRadius: "50%",
              borderBottomRightRadius: "50%",
            }}
          />
        );
      }
      // Default: nose line
      return (
        <motion.div
          className="mt-1"
          animate={{ height: 14, width: 2 }}
          style={{ backgroundColor: color }}
        />
      );
    }

    if (charId === "black") {
      // Default: no mouth. Error: frown. Success: smile.
      if (state === "error") {
        return (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="mt-3"
            style={{
              width: 10,
              height: 5,
              borderTop: `2px solid ${color}`,
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
            }}
          />
        );
      }
      if (state === "success") {
        return (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="mt-3"
            style={{
              width: 10,
              height: 5,
              borderBottom: `2px solid ${color}`,
              borderBottomLeftRadius: "50%",
              borderBottomRightRadius: "50%",
            }}
          />
        );
      }
      return null; // No mouth in idle
    }

    if (charId === "orange") {
      // Default: small dot. Error: frown. Success: open smile.
      if (state === "error") {
        return (
          <motion.div
            className="mt-2"
            animate={{ width: 10, height: 5, borderRadius: "0px" }}
            style={{
              borderTop: `2px solid ${color}`,
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
            }}
          />
        );
      }
      if (state === "success") {
        return (
          <motion.div
            className="mt-2"
            animate={{ width: 10, height: 6, borderRadius: "0 0 50% 50%" }}
            style={{ backgroundColor: color }}
          />
        );
      }
      // Default: dot
      return (
        <motion.div
          className="mt-2"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      );
    }

    if (charId === "yellow") {
      // Default: wide line. Error: frown. Success: big smile.
      if (state === "error") {
        return (
          <motion.div
            animate={{ width: 14, height: 6 }}
            style={{
              borderTop: `2px solid ${color}`,
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
            }}
          />
        );
      }
      if (state === "success") {
        return (
          <motion.div
            animate={{ width: 16, height: 7 }}
            style={{
              backgroundColor: color,
              borderRadius: "0 0 50% 50%",
            }}
          />
        );
      }
      // Default: flat line
      return (
        <motion.div
          style={{
            width: 22,
            height: 3,
            borderRadius: 9999,
            backgroundColor: color,
          }}
        />
      );
    }

    return null;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${charId}-mouth-${state}`}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {getMouthStyle()}
      </motion.div>
    </AnimatePresence>
  );
}
