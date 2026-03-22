/**
 * Global Type Declarations
 *
 * This file tells TypeScript how to handle non-TypeScript file imports.
 * Without these declarations, TypeScript would throw errors when importing
 * CSS files, images, or other static assets.
 *
 * Example: import "./globals.css" or import logo from "./logo.png"
 */

// CSS modules
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// SCSS modules
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// Images
declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}
