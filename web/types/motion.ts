/**
 * Motion Types - Centralized types for Framer Motion animations
 */

export interface MotionVariants {
  hidden?: {
    opacity: number;
    y?: number;
  };
  visible?: {
    opacity: number;
    y?: number;
    transition?: {
      duration: number;
      ease?: string | number[];
    };
  };
  animate?: {
    [key: string]: string | number | string[];
    // transition?: {
    //   duration: number;
    //   repeat?: number;
    //   ease?: string | number[];
    // };
  };
}

export interface GlowVariants {
  animate?: {
    boxShadow: string[];
    transition?: {
      duration: number;
      repeat: number;
      ease?: string | number[];
    };
  };
}
