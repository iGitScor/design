import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadTokens, outputs, withContrast } from '../build/build.mjs'

// The rules the tokens promise in their descriptions, checked in both schemes. WCAG 2 contrast:
// 4.5:1 for text. Every app inherits them instead of finding out one by one.
const { light, dark, contrast: increased } = loadTokens()

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
  it('cover every token in both schemes, and Increase Contrast where it changes', () => {
    const { built } = outputs()
    for (const name of Object.keys(light)) {
      const css = `--${name.split('.').pop()}:`
      const changes = (name in increased.light ? 1 : 0) + (name in increased.dark ? 2 : 0)
      assert.equal(built['dist/tokens.css'].split(css).length - 1, 3 + changes, `${css} once per scheme block`)
    }
  })
})

// Increase Contrast: every text at AAA (7:1) on every surface, and on the lime and the dark bands.
for (const [label, scheme] of [
  ['light', withContrast(light, increased.light)],
  ['dark', withContrast(dark, increased.dark)],
]) {
  const v = (name) => scheme[`color.${name}`].$value
  describe(`the ${label} scheme under Increase Contrast`, () => {
    for (const text of TEXT)
      it(`${text} reads at 7:1 on every surface`, () => {
        for (const surface of SURFACES) {
          const ratio = contrast(v(text), v(surface))
          assert.ok(ratio >= 7, `${text} on ${surface}: ${ratio.toFixed(2)}:1`)
        }
      })
    it('on-accent and on-dark read at 7:1', () => {
      for (const fill of ['accent', 'accent-deep']) assert.ok(contrast(v('on-accent'), v(fill)) >= 7, fill)
      for (const band of ['dark', 'dark-2', 'dark-3']) assert.ok(contrast(v('on-dark'), v(band)) >= 7, band)
    })
  })
}

/** A transparent fill composited over a surface, as #rrggbb. */
function flattened(fill, surface) {
  const c = over(fill, surface)
  return (
    '#' +
    [c.r, c.g, c.b]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

// A status chip: its colour on its soft fill, over the surfaces a chip sits on (card-2 is itself a chip's colour).
const CHIP_SURFACES = ['backdrop', 'surface', 'card', 'field']
for (const [label, scheme, target] of [
  ['light', light, 4.5],
  ['dark', dark, 4.5],
  ['light, Increase Contrast', withContrast(light, increased.light), 7],
  ['dark, Increase Contrast', withContrast(dark, increased.dark), 7],
])
  describe(`the soft status fills (${label})`, () => {
    const v = (name) => scheme[`color.${name}`].$value
    for (const status of ['ok', 'warn', 'danger', 'info'])
      it(`${status} reads at ${target}:1 on ${status}-soft`, () => {
        for (const surface of CHIP_SURFACES) {
          const ratio = contrast(v(status), flattened(v(`${status}-soft`), v(surface)))
          assert.ok(ratio >= target, `${status} on ${status}-soft over ${surface}: ${ratio.toFixed(2)}:1`)
        }
      })
  })

describe('the disabled opacity', () => {
  const { base } = loadTokens()
  const disabled = base['opacity.disabled'].$value
  it('dims, without hiding', () => assert.ok(disabled > 0 && disabled < 1, String(disabled)))
  for (const [label, scheme] of [
    ['light', light],
    ['dark', dark],
  ])
    it(`dimmed ink still reads at 2.5:1 on the backdrop (${label})`, () => {
      const v = (name) => scheme[`color.${name}`].$value
      const alpha = Math.round(disabled * 255)
        .toString(16)
        .padStart(2, '0')
      const ratio = contrast(v('ink').slice(0, 7) + alpha, v('backdrop'))
      assert.ok(ratio >= 2.5, `${ratio.toFixed(2)}:1`)
    })
})
