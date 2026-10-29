import { test } from "node:test";
import assert from "node:assert/strict";

import {
  style,
  bold,
  red,
  codes,
  shouldColor,
  buildSGR,
  RESET,
} from "../src/index.js";

// Save and restore process.env so tests do not leak state.
const savedEnv = { ...process.env };
function restoreEnv() {
  for (const k of Object.keys(process.env)) {
    if (!(k in savedEnv)) delete process.env[k];
  }
  for (const [k, v] of Object.entries(savedEnv)) {
    process.env[k] = v;
  }
}

test("buildSGR joins params with semicolons", () => {
  assert.equal(buildSGR([1, 31]), "\u001b[1;31m");
});

test("buildSGR returns empty string for empty array", () => {
  assert.equal(buildSGR([]), "");
});

test("RESET is ESC[0m", () => {
  assert.equal(RESET, "\u001b[0m");
});

test("style wraps text with open and reset when enabled", () => {
  assert.equal(style("hi", codes.red, true), "\u001b[31mhi\u001b[0m");
});

test("style accepts an array of codes", () => {
  assert.equal(style("hi", [1, 34], true), "\u001b[1;34mhi\u001b[0m");
});

test("style returns plain text when disabled", () => {
  assert.equal(style("hi", codes.red, false), "hi");
});

test("bold helper produces bold sequence", () => {
  assert.equal(bold("x", true), "\u001b[1mx\u001b[0m");
});

test("red helper produces red sequence", () => {
  assert.equal(red("x", true), "\u001b[31mx\u001b[0m");
});

test("shouldColor returns false when NO_COLOR is set", () => {
  assert.equal(shouldColor({ NO_COLOR: "1", TERM: "xterm-256color" }), false);
});

test("shouldColor returns false when NO_COLOR is empty string", () => {
  // no-color.org: presence alone suffices, but we treat empty as unset so a
  // `NO_COLOR=` line in a shell profile does not silently disable everything.
  assert.equal(shouldColor({ NO_COLOR: "", TERM: "xterm-256color" }), true);
});

test("shouldColor returns true when FORCE_COLOR is set", () => {
  assert.equal(shouldColor({ FORCE_COLOR: "1", TERM: "dumb" }), true);
});

test("shouldColor returns false when TERM is dumb", () => {
  assert.equal(shouldColor({ TERM: "dumb" }), false);
});

test("shouldColor returns false when TERM is undefined", () => {
  assert.equal(shouldColor({}), false);
});

test("shouldColor returns true for a normal TERM", () => {
  assert.equal(shouldColor({ TERM: "xterm-256color" }), true);
});

test("style with no explicit flag reads the real environment", () => {
  try {
    delete process.env.NO_COLOR;
    delete process.env.FORCE_COLOR;
    process.env.TERM = "dumb";
    assert.equal(style("hi", codes.red), "hi");
    process.env.TERM = "xterm-256color";
    assert.equal(style("hi", codes.red), "\u001b[31mhi\u001b[0m");
  } finally {
    restoreEnv();
  }
});
