"use client";

import { cn } from "@/lib/utils";
import { useState, createContext, useContext } from "react";
import {
  motion,
  type MotionValue,
  type SpringOptions,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const ImageComparisonContext = createContext<
  | {
      sliderPosition: number;
      setSliderPosition: (pos: number) => void;
      motionSliderPosition: MotionValue;
    }
  | undefined
>(undefined);

export type ImageComparisonProps = {
  children: React.ReactNode;
  className?: string;
  enableHover?: boolean;
  springOptions?: SpringOptions;
};

const DEFAULT_SPRING_OPTIONS = {
  bounce: 0,
  duration: 0,
};

function ImageComparison({
  children,
  className,
  enableHover,
  springOptions,
}: ImageComparisonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const motionValue = useMotionValue(50);
  const motionSliderPosition = useSpring(
    motionValue,
    springOptions ?? DEFAULT_SPRING_OPTIONS
  );
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging && !enableHover) return;

    const containerRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    const x =
      "touches" in event
        ? event.touches[0].clientX - containerRect.left
        : (event as React.MouseEvent).clientX - containerRect.left;

    const percentage = Math.min(
      Math.max((x / containerRect.width) * 100, 0),
      100
    );
    motionValue.set(percentage);
    setSliderPosition(percentage);
  };

  return (
    <ImageComparisonContext.Provider
      value={{ sliderPosition, setSliderPosition, motionSliderPosition }}
    >
      <div
        className={cn("relative select-none overflow-hidden", className)}
        onMouseMove={handleDrag}
        onMouseDown={() => !enableHover && setIsDragging(true)}
        onMouseUp={() => !enableHover && setIsDragging(false)}
        onMouseLeave={() => !enableHover && setIsDragging(false)}
        onTouchMove={handleDrag}
        onTouchStart={() => !enableHover && setIsDragging(true)}
        onTouchEnd={() => !enableHover && setIsDragging(false)}
      >
        {children}
      </div>
    </ImageComparisonContext.Provider>
  );
}

function ImageComparisonImage({
  className,
  src,
  alt,
  position,
}: {
  className?: string;
  src: string;
  alt: string;
  position: "left" | "right";
}) {
  const context = useContext(ImageComparisonContext);
  if (!context) throw new Error("ImageComparisonImage must be used within ImageComparison");

  const { motionSliderPosition } = context;
  const clipPath = useTransform(motionSliderPosition, (value: number) =>
    position === "left"
      ? `inset(0 ${100 - value}% 0 0)`
      : `inset(0 0 0 ${value}%)`
  );

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      style={{ clipPath }}
    />
  );
}

function ImageComparisonSlider({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const context = useContext(ImageComparisonContext);
  if (!context) throw new Error("ImageComparisonSlider must be used within ImageComparison");

  const { motionSliderPosition } = context;
  const left = useTransform(motionSliderPosition, (value: number) => `${value}%`);

  return (
    <motion.div
      className={cn(
        "absolute inset-y-0 z-10 flex -translate-x-1/2 cursor-ew-resize items-center justify-center",
        className
      )}
      style={{ left }}
    >
      {children || (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="h-full w-0.5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.3)]" />
        </div>
      )}
    </motion.div>
  );
}

export { ImageComparison, ImageComparisonImage, ImageComparisonSlider };
