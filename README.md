# simple-ansi-style

Colour/style helpers for terminals, with dumb-terminal detection.

```js
import { bold, red, style, codes, shouldColor } from "simple-ansi-style";

console.log(bold("hello"));            // bold if the terminal supports it
console.log(red("error!"));            // red text
console.log(style("warn", codes.yellow)); // explicit code
console.log(shouldColor({ TERM: "dumb" })); // false
```

The library exists because most ANSI styling modules either ignore the
dumb-terminal problem entirely or pull in heavyweight dependencies for what
amounts to string concatenation. `simple-ansi-style` does only the SGR
(Set Graphic Rendition) subset — foreground colours plus bold/dim/italic/
underline — and checks `NO_COLOR`, `FORCE_COLOR`, and `TERM` to decide
whether to emit escapes at all.

The trade-off: detection is opt-out, not opt-in. If you pipe output to a file
you will get stray escape sequences unless you explicitly pass `false` or set
`NO_COLOR`. This matches the convention used by `ls` and `grep`; the
alternative of suppressing by default surprises users who expect colour in a
pty.

## Exported names

- `codes` — frozen object of style names to SGR numbers (`bold`, `red`, …).
- `style(text, codeOrCodes, enabled?)` — wrap text in an SGR sequence.
- `bold`, `dim`, `italic`, `underline`, `red`, `green`, `yellow`, `blue`,
  `magenta`, `cyan`, `white` — convenience wrappers around `style`.
- `shouldColor(env?)` — boolean; honours `NO_COLOR`, `FORCE_COLOR`, `TERM`.
- `buildSGR(params)` — low-level: returns `ESC[…m` from an array of numbers.
- `RESET` — the `ESC[0m` string.

## Edge you will hit

`NO_COLOR` set to an empty string is treated as **unset**. A bare `NO_COLOR=`
line in your shell profile will not disable colour; give it a value. This is a
deliberate departure from the strictest reading of the no-color spec, chosen
because empty-string environment variables are a common source of silent
breakage.
