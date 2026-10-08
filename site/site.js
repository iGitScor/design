// The site's behaviour. window.TOKENS is written by build/site.mjs from tokens/: { colours, radii }.
;(() => {
  const { colours, radii } = window.TOKENS
  const byName = Object.fromEntries(colours.map((c) => [c.name, c]))
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]
  const el = (tag, props = {}, ...children) => {
    const node = Object.assign(document.createElement(tag), props)
    node.append(...children)
    return node
  }

  // ---------- Toast and copy ----------

  const toast = $('#toast')
  let toastTimer
  function say(message) {
    toast.textContent = message
    toast.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800)
  }
  async function copy(text, label = text) {
    try {
      await navigator.clipboard.writeText(text)
      say(`Copied ${label}`)
    } catch {
      say(`Select and copy: ${label}`)
    }
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-copy], [data-copy-from]')
    if (!button) return
    if (button.dataset.copy) copy(button.dataset.copy)
    else copy($(`#${button.dataset.copyFrom} code`).textContent, 'the snippet')
  })

  // ---------- Theme ----------

  const media = matchMedia('(prefers-color-scheme: dark)')
  const scheme = () => {
    const forced = document.documentElement.dataset.theme
    return forced === 'light' || forced === 'dark' ? forced : media.matches ? 'dark' : 'light'
  }
  function setTheme(choice) {
    if (choice === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = choice
    try {
      if (choice === 'system') localStorage.removeItem('theme')
      else localStorage.setItem('theme', choice)
    } catch {}
    render()
  }
  $$('[data-theme-choice]').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.themeChoice)))
  media.addEventListener('change', render)
  // The host page (or a browser extension) may set data-theme itself.
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // ---------- Contrast (the same formula as test/tokens.test.mjs) ----------

  function rgba(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    return { r, g, b, a: hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1 }
  }
  const luminance = ({ r, g, b }) => {
    const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  }
  function contrast(text, background) {
    const t = rgba(text)
    const bg = rgba(background)
    const fg = { r: t.r * t.a + bg.r * (1 - t.a), g: t.g * t.a + bg.g * (1 - t.a), b: t.b * t.a + bg.b * (1 - t.a) }
    const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x)
    return (a + 0.05) / (b + 0.05)
  }
  const ratio = (value) => `${value.toFixed(value >= 10 ? 1 : 2)}:1`

  // ---------- Colour ----------

  const GROUPS = [
    [
      'Surfaces',
      'Backgrounds, from the page to the text field, and the lines between them.',
      ['backdrop', 'backdrop-2', 'surface', 'card', 'card-2', 'field', 'border', 'line'],
    ],
    ['Text', 'Three greys of ink. Each one reads at 4.5:1 on every surface.', ['ink', 'ink-soft', 'muted']],
    [
      'Accent',
      'The lime, its pressed and soft shades, and what goes on it.',
      ['accent', 'accent-deep', 'accent-soft', 'accent-text', 'on-accent', 'progress', 'focus'],
    ],
    [
      'Dark bands',
      'Sections that stay dark in both schemes, with their own text.',
      ['dark', 'dark-2', 'dark-3', 'on-dark', 'on-dark-muted', 'navy', 'cream'],
    ],
    ['Status', 'Saved, partial, attention, failure.', ['ok', 'info', 'warn', 'danger']],
  ]

  const swatches = []
  function buildColours() {
    const root = $('#colour-groups')
    const listed = new Set(GROUPS.flatMap((g) => g[2]))
    const rest = colours.map((c) => c.name).filter((n) => !listed.has(n))
    if (rest.length) GROUPS.push(['Other', '', rest])
    for (const [title, blurb, names] of GROUPS) {
      const grid = el('div', { className: 'swatches' })
      for (const name of names.filter((n) => byName[n])) {
        const c = byName[name]
        const values = ['light', 'dark'].map((s) => {
          const v = el('span', { className: 'swatch-value', title: `${s}: ${c[s]}` }, el('i'), c[s])
          v.style.setProperty('--v', c[s])
          v.dataset.scheme = s
          return v
        })
        const button = el(
          'button',
          { type: 'button', className: 'swatch', id: `swatch-${name}` },
          el('span', { className: 'swatch-chip' }),
          el(
            'span',
            { className: 'swatch-body' },
            el('span', { className: 'swatch-name' }, `--${name}`),
            el('span', { className: 'swatch-desc' }, c.description || ''),
            el('span', { className: 'swatch-values' }, ...values),
          ),
        )
        button.style.setProperty('--chip', `var(--${name})`)
        button.setAttribute('aria-label', `--${name}: ${c.description || ''} Light ${c.light}, dark ${c.dark}. Copy the variable.`)
        button.addEventListener('click', () => copy(`var(--${name})`))
        swatches.push(values)
        grid.append(button)
      }
      root.append(el('div', { className: 'colour-group' }, el('h3', {}, title), el('p', {}, blurb), grid))
    }
    $('[data-count="colours"]').textContent = colours.length
  }

  // ---------- Contrast matrix ----------

  const TEXT = ['ink', 'ink-soft', 'muted', 'accent-text', 'ok', 'warn', 'danger', 'info']
  const SURFACES = ['backdrop', 'surface', 'card', 'card-2', 'field']

  function renderMatrix(s) {
    const table = $('#matrix')
    $$('thead, tbody', table).forEach((n) => n.remove())
    const head = el('tr', {}, el('th', { scope: 'col' }, 'text ↓  surface →'), ...SURFACES.map((n) => el('th', { scope: 'col' }, n)))
    const body = el('tbody')
    for (const text of TEXT.filter((n) => byName[n])) {
      const row = el('tr', {}, el('th', { scope: 'row' }, text))
      for (const surface of SURFACES.filter((n) => byName[n])) {
        const value = contrast(byName[text][s], byName[surface][s])
        const cell = el(
          'td',
          {},
          el(
            'span',
            { className: 'cell' },
            el('span', { className: 'cell-aa' }, 'Aa'),
            el('span', { className: `cell-ratio${value < 4.5 ? ' fail' : ''}` }, ratio(value)),
          ),
        )
        cell.style.background = `var(--${surface})`
        cell.firstChild.firstChild.style.color = `var(--${text})`
        cell.setAttribute('aria-label', `${text} on ${surface}: ${ratio(value)}`)
        row.append(cell)
      }
      body.append(row)
    }
    table.append(el('thead', {}, head), body)
    $$('[data-scheme-name]').forEach((n) => (n.textContent = s))
  }

  function renderRuleRatios() {
    for (const b of $$('[data-ratio]')) {
      const [text, surface, s] = b.dataset.ratio.split(':')
      if (byName[text] && byName[surface]) b.textContent = ratio(contrast(byName[text][s], byName[surface][s]))
    }
  }

  // ---------- Type and shape ----------

  function buildType() {
    const sample = 'Where the river meets the sea'
    const sizes = [
      ['88 / 700', 88, 700],
      ['52 / 700', 52, 700],
      ['30 / 650', 30, 650],
      ['21 / 400', 21, 400],
      ['17 / 400', 17, 400],
      ['13 / 600', 13, 600],
    ]
    $('#type-scale').append(
      ...sizes.map(([label, size, weight]) => {
        const p = el('p', {}, sample)
        p.style.fontSize = `clamp(${Math.min(size, 15)}px, ${size / 11}vw, ${size}px)`
        p.style.fontWeight = weight
        p.style.letterSpacing = size > 40 ? '-0.03em' : '0'
        return el('div', { className: 'type-row' }, el('span', { className: 'label' }, label), p)
      }),
    )
    $('#type-weights').append(
      ...[
        [300, 'Light'],
        [400, 'Regular'],
        [500, 'Medium'],
        [650, 'Semibold'],
        [800, 'Extra bold'],
      ].map(([w, name]) => {
        const b = el('b', {}, 'Ag')
        b.style.fontWeight = w
        return el('div', { className: 'weight' }, b, el('span', {}, `${w} · ${name}`))
      }),
    )
  }

  function buildRadii() {
    const uses = { xl: 'Cards, players, bands', lg: 'Panels, artwork', md: 'Fields, tiles', pill: 'Buttons, chips, toggles' }
    $('#radii').append(
      ...Object.entries(radii).map(([name, value]) => {
        const box = el('div', { className: 'radius-box' })
        box.style.borderTopLeftRadius = `var(--r-${name})`
        return el(
          'button',
          { type: 'button', className: 'radius swatch-plain', onclick: () => copy(`var(--r-${name})`) },
          box,
          el('div', { className: 'radius-meta' }, el('b', {}, `--r-${name}`), el('span', {}, value)),
          el('span', { className: 'swatch-desc' }, uses[name] || ''),
        )
      }),
    )
    // The radius cards are buttons for copying; reset the browser's button look.
    $$('.swatch-plain').forEach((b) =>
      Object.assign(b.style, {
        font: 'inherit',
        color: 'inherit',
        textAlign: 'left',
        background: 'none',
        border: 0,
        padding: 0,
        cursor: 'pointer',
      }),
    )
  }

  // ---------- Editors ----------

  /** The preview in the HTML is the light one; the dark one is its copy. Each gets its own scheme's tokens. */
  function buildEditors() {
    const lightEditor = $('.editor[data-scheme="light"]')
    const darkEditor = lightEditor.cloneNode(true)
    darkEditor.dataset.scheme = 'dark'
    darkEditor.querySelector('figcaption').lastChild.textContent = 'Estuary Dark'
    lightEditor.after(darkEditor)
    for (const editor of [lightEditor, darkEditor])
      for (const c of colours) editor.style.setProperty(`--${c.name}`, c[editor.dataset.scheme])
  }

  // ---------- Tabs ----------

  function tabs(list) {
    const buttons = $$('[role="tab"]', list)
    const select = (button) => {
      for (const b of buttons) {
        const on = b === button
        b.setAttribute('aria-selected', on)
        b.tabIndex = on ? 0 : -1
        $(`#${b.getAttribute('aria-controls')}`).hidden = !on
      }
    }
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => select(b))
      b.addEventListener('keydown', (event) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
        if (!step) return
        const next = buttons[(i + step + buttons.length) % buttons.length]
        next.focus()
        select(next)
      })
    })
    select(buttons.find((b) => b.getAttribute('aria-selected') === 'true') || buttons[0])
  }

  // ---------- Inspect ----------

  function inspect() {
    const bench = $('.workbench')
    const tip = $('#inspect-tip')
    const toggle = $('#inspect')
    let current
    toggle.addEventListener('change', () => {
      bench.classList.toggle('inspecting', toggle.checked)
      if (!toggle.checked) hide()
    })
    function hide() {
      tip.hidden = true
      current?.classList.remove('inspected')
      current = null
    }
    bench.addEventListener('pointermove', (event) => {
      if (!toggle.checked) return
      const target = event.target.closest('[data-tokens]')
      if (!target || !bench.contains(target)) return hide()
      if (target !== current) {
        current?.classList.remove('inspected')
        current = target
        target.classList.add('inspected')
        tip.textContent = target.dataset.tokens
          .split('·')
          .map((t) => `--${t.trim()}`)
          .join('  ')
        tip.hidden = false
      }
      const box = bench.getBoundingClientRect()
      const x = Math.min(event.clientX - box.left + 14, box.width - tip.offsetWidth - 8)
      tip.style.left = `${Math.max(8, x)}px`
      tip.style.top = `${event.clientY - box.top + 18}px`
    })
    bench.addEventListener('pointerleave', hide)
    $('#form-demo').addEventListener('submit', (event) => {
      event.preventDefault()
      say('Added (this is a demo)')
    })
  }

  // ---------- Nav highlight ----------

  function navSpy() {
    const links = $$('.nav a')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', a.hash === `#${entry.target.id}`))
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    $$('main section[id]').forEach((s) => observer.observe(s))
  }

  // ---------- Render what depends on the scheme ----------

  function render() {
    const s = scheme()
    const forced = document.documentElement.dataset.theme
    $$('[data-theme-choice]').forEach((b) =>
      b.setAttribute('aria-checked', b.dataset.themeChoice === (forced === 'light' || forced === 'dark' ? forced : 'system')),
    )
    for (const values of swatches) for (const v of values) v.classList.toggle('is-current', v.dataset.scheme === s)
    renderMatrix(s)
  }

  buildColours()
  buildType()
  buildRadii()
  buildEditors()
  renderRuleRatios()
  $$('.tabs').forEach(tabs)
  inspect()
  navSpy()
  render()
})()
