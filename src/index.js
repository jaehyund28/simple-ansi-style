/**
 * simple-ansi-style — Colour/style helpers for terminals, with dumb-terminal
 * detection.
 */

import { buildSGR, RESET, shouldColor } from "./core.js";

/**
 * Style codes grouped so users can extend or compose without reaching into
 * the private core module.
 */
export const codes = Object.freeze({
  reset: 0,
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
});

/**
 * Wrap `text` in a single SGR sequence for each code in `styleCodes`.
 *
 * When colour is disabled (see `shouldColor`) the text is returned unchanged
 * so logs stay readable when piped to a file or viewed in a dumb terminal.
 *
 * @param {string} text
 * @param {number|number[]} styleCodes
 * @param {boolean} [enabled]
 * @returns {string}
 */
export function style(text, styleCodes, enabled) {
  if (enabled === undefined) {
    enabled = shouldColor();
  }
  if (!enabled) {
    return text;
  }
  const params = Array.isArray(styleCodes) ? styleCodes : [styleCodes];
  const open = buildSGR(params);
  if (open === "") {
    return text;
  }
  return open + text + RESET;
}

/**
 * Convenience helpers.  Each is a one-liner over `style` but named for
 * readability at call sites.
 */
export function bold(text, enabled) {
  return style(text, codes.bold, enabled);
}
export function dim(text, enabled) {
  return style(text, codes.dim, enabled);
}
export function italic(text, enabled) {
  return style(text, codes.italic, enabled);
}
export function underline(text, enabled) {
  return style(text, codes.underline, enabled);
}
export function red(text, enabled) {
  return style(text, codes.red, enabled);
}
export function green(text, enabled) {
  return style(text, codes.green, enabled);
}
export function yellow(text, enabled) {
  return style(text, codes.yellow, enabled);
}
export function blue(text, enabled) {
  return style(text, codes.blue, enabled);
}
export function magenta(text, enabled) {
  return style(text, codes.magenta, enabled);
}
export function cyan(text, enabled) {
  return style(text, codes.cyan, enabled);
}
export function white(text, enabled) {
  return style(text, codes.white, enabled);
}

export { shouldColor, RESET, buildSGR };
