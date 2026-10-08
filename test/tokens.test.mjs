import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadTokens, outputs } from '../build/build.mjs'

// The rules the tokens promise in their descriptions, checked in both schemes. WCAG 2 contrast:
// 4.5:1 for text. Every app inherits them instead of finding out one by one.
const { light, dark } = loadTokens()

function rgba(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return { r, g, b, a: hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1 }
}
/** A colour with its transparency composited over an opaque background. */
function over(top, bottom) {
  const t = rgba(top)
  const b = rgba(bottom)
  return { r: t.r * t.a + b.r * (1 - t.a), g: t.g * t.a + b.g * (1 - t.a), b: t.b * t.a + b.b * (1 - t.a) }
}
const luminance = ({ r, g, b }) => {
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
export function contrast(text, background) {
  const bg = rgba(background)
  const fg = over(text, background)
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

const TEXT = ['ink', 'ink-soft', 'muted', 'accent-text', 'ok', 'warn', 'danger', 'info']
const SURFACES = ['backdrop', 'surface', 'card', 'card-2', 'field']

for (const [label, scheme] of [
  ['light', light],
  ['dark', dark],
]) {
  const v = (name) => scheme[`color.${name}`].$value
  describe(`the ${label} scheme`, () => {
    for (const text of TEXT)
      it(`${text} reads at 4.5:1 on every surface`, () => {
        for (const surface of SURFACES) {
          const ratio = contrast(v(text), v(surface))
          assert.ok(ratio >= 4.5, `${text} on ${surface}: ${ratio.toFixed(2)}:1`)
        }
      })
    it('on-accent reads on the lime and on its pressed shade', () => {
      for (const fill of ['accent', 'accent-deep']) assert.ok(contrast(v('on-accent'), v(fill)) >= 4.5, fill)
    })
    it('on-dark and on-dark-muted read on the dark bands', () => {
      for (const text of ['on-dark', 'on-dark-muted'])
        for (const band of ['dark', 'dark-2', 'dark-3']) {
          const ratio = contrast(v(text), v(band))
          assert.ok(ratio >= 4.5, `${text} on ${band}: ${ratio.toFixed(2)}:1`)
        }
    })
  })
}

describe('the generated files', () => {
  it('cover every token in both schemes', () => {
    const { built } = outputs()
    for (const name of Object.keys(light)) {
      const css = `--${name.split('.').pop()}:`
      assert.equal(built['dist/tokens.css'].split(css).length - 1, 3, `${css} once per scheme block`)
    }
  })
})
