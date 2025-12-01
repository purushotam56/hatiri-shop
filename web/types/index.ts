import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Export all product types
export * from "./product";

// Export all cart types
export * from "./cart";

// Export all order types
export * from "./order";

// Export panel types
export * from "./panel";
