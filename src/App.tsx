import { useMemo, useState } from 'react'
import { Check, Copy, Search, Sparkles, X } from 'lucide-react'
import dataA from './components.a.json'
import dataB from './components.b.json'
import type { ComponentBrief } from './types'

const components = [...(dataA as ComponentBrief[]), ...(dataB as ComponentBrief[])]

const CATEGORIES = ['all', ...Array.from(new Set(components.map((c) => c.category)))]

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [active, setActive] = useState<ComponentBrief | null>(null)
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return components.filter((c) => {
      if (category !== 'all' && c.category !== category) return false
      if (!q) return true
      const hay = [c.name, c.summary, c.category, ...(c.tags || [])].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [query, category])

  async function copyPrompt(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-10 flex flex-col gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
          {components.length} stack-agnostic UI briefs
        </div>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            See the pattern. Copy the brief.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-400">
            Visual UI components with concise prompts that tell your coding agent exactly what to build.
            Adapted from the Marsaze Prompt Library pattern for GenTeam / Claude Code.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, behavior, or tags…"
              className="w-full rounded-xl border border-white/10 bg-zinc-950/70 py-3 pl-10 pr-3 text-sm text-white outline-none ring-indigo-400/40 placeholder:text-zinc-500 focus:ring-2"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const selected = category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                  selected
                    ? 'bg-indigo-500 text-white'
                    : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </header>

      <p className="mb-4 text-sm text-zinc-500">{filtered.length} components</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, index) => (
          <article
            key={c.id}
            className="group flex flex-col rounded-2xl border border-white/10 bg-zinc-950/50 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition hover:border-indigo-400/40 hover:bg-zinc-900/70"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                  {c.category} · Prompt {index + 1}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">{c.name}</h2>
              </div>
            </div>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-400">{c.summary}</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {(c.tags || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-auto flex gap-2">
              <button
                type="button"
                onClick={() => setActive(c)}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                View prompt
              </button>
              <button
                type="button"
                onClick={() => copyPrompt(c.prompt)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div
            className="absolute inset-0"
            onClick={() => setActive(null)}
            aria-hidden
          />
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">{active.category}</p>
                <h3 className="text-xl font-semibold text-white">{active.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <pre className="flex-1 overflow-auto whitespace-pre-wrap px-5 py-4 text-sm leading-relaxed text-zinc-300">
              {active.prompt}
            </pre>
            <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-4">
              <button
                type="button"
                onClick={() => copyPrompt(active.prompt)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy prompt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
