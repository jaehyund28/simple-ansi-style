/**
 * core.js — private helpers for simple-ansi-style.
 *
 * WHY a separate module? Keeping the escape-sequence construction and
 * environment detection apart from the public API makes each piece testable
 * in isolation and lets the public index.js stay a thin, readable surface.
 */

/**
 * SGR (Select Graphic Rendition) prefix and suffix.
 *
 * Hard-coded rather than built from a table because every VT100-compatible
 * terminal agrees on these two bytes; building them dynamically only adds
 * surface area for bugs.
 */
export const SGR_OPEN = "\u001b[";
export const SGR_CLOSE = "m";

/**
 * Build a full SGR escape sequence from one or more numeric parameters.
 *
 * Returns the empty string when given no parameters, so callers can compose
 * sequences without branching on "is there anything to emit?".
 *
 * @param {number[]} params
 * @returns {string}
 */
export function buildSGR(params) {
  if (!Array.isArray(params) || params.length === 0) {
    return "";
  }
  return SGR_OPEN + params.join(";") + SGR_CLOSE;
}

/**
 * Reset-all sequence: `ESC[0m`.
 */
export const RESET = buildSGR([0]);

/**
 * Decide whether ANSI colour escapes should be emitted.
 *
 * We deliberately err on the side of emitting colour: detection is opt-out,
 * not opt-in.  A program that pipes output to a file will produce stray
 * escapes, but that is the long-standing Unix convention for tools like
 * `ls` or `grep` — the alternative (suppressing by default) surprises users
 * who expect colour in a pty.
 *
 * Detection order, all from `process.env`:
 *   1. `NO_COLOR`  — any value disables colour (https://no-color.org).
 *   2. `FORCE_COLOR` — any non-empty value forces colour on, overriding (1).
 *   3. `TERM` absent or literally "dumb" — disable.
 *
 * @param {object} [env]
 * @returns {boolean}
 */
export function shouldColor(env) {
  const e = env || (typeof process !== "undefined" ? process.env : {});

  if (e.NO_COLOR !== undefined && e.NO_COLOR !== "") {
    return false;
  }

  if (e.FORCE_COLOR !== undefined && e.FORCE_COLOR !== "") {
    return true;
  }

  const term = e.TERM;
  if (term === undefined || term === "dumb" || term === "") {
    return false;
  }

  return true;
}
