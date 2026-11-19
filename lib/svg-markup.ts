import {
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/**
 * Turns the site's drawings (React SVG components) into plain SVG markup, for
 * the share images. Next.js doesn't allow react-dom/server in image routes,
 * and the drawings only use simple SVG, so this small version is enough: it
 * expands components and fragments, and writes out elements and attributes.
 */

// SVG attributes that stay in camelCase; every other React prop name is
// written in kebab-case (strokeWidth → stroke-width).
const camelCaseAttributes = new Set([
  "viewBox",
  "preserveAspectRatio",
  "gradientUnits",
  "gradientTransform",
  "patternUnits",
  "patternTransform",
  "textLength",
  "lengthAdjust",
  "markerWidth",
  "markerHeight",
  "refX",
  "refY",
  "stdDeviation",
  "pathLength",
]);

function attributeName(prop: string) {
  if (prop === "className") return "class";
  if (prop === "xlinkHref") return "xlink:href";
  if (camelCaseAttributes.has(prop)) return prop;
  return prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function escape(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function svgMarkup(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") {
    return escape(String(node));
  }
  if (Array.isArray(node)) return node.map(svgMarkup).join("");
  if (!isValidElement(node)) return "";

  const element = node as ReactElement<Record<string, unknown>>;
  const { children, ...props } = element.props;

  if (element.type === Fragment) return svgMarkup(children as ReactNode);
  if (typeof element.type === "function") {
    const component = element.type as (props: object) => ReactNode;
    return svgMarkup(component(element.props));
  }

  const tag = String(element.type);
  const attributes = Object.entries(props)
    .filter(
      ([name, value]) =>
        name !== "key" &&
        name !== "ref" &&
        value !== undefined &&
        value !== null &&
        value !== false &&
        typeof value !== "function" &&
        typeof value !== "object",
    )
    .map(
      ([name, value]) => ` ${attributeName(name)}="${escape(String(value))}"`,
    )
    .join("");

  return `<${tag}${attributes}>${svgMarkup(children as ReactNode)}</${tag}>`;
}
