import { motion } from 'framer-motion'
import { Scale, ExternalLink, BookOpen, ChevronRight, Filter } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/misc'
import { Progress } from '../components/ui/Progress'
import { RiskBadge } from '../components/ui/RiskBadge'
import { MOCK_ANALYSIS } from '../data/mockData'
import { Regulation } from '../types'
import { cn } from '../lib/utils'

const data = MOCK_ANALYSIS

// Collect all regulations from all clauses
const allRegulations = data.clauses.flatMap(clause =>
  clause.regulations.map(r => ({ ...r, clauseId: clause.id, clauseTitle: clause.title, clauseRisk: clause.riskLevel }))
)

const BODY_COLORS: Record<string, string> = {
  BNS: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  SEBI: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  RBI: 'bg-green-500/15 text-green-400 border-green-500/30',
  'Companies Act': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'IT Act': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
}

const BODY_DESCRIPTIONS: Record<string, string> = {
  BNS: 'Bhartiya Nyaya Sanhita',
  SEBI: 'Securities and Exchange Board of India',
  RBI: 'Reserve Bank of India',
  'Companies Act': 'Indian Companies Act, 2013',
  'IT Act': 'Information Technology Act, 2000',
}

function RegulationCard({ reg }: { reg: typeof allRegulations[0] }) {
  return (
    <motion.div layout>
      <Card className="hover:border-border/70 transition-colors">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <Scale size={18} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', BODY_COLORS[reg.body] || BODY_COLORS.BNS)}>
                      {reg.body}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">{reg.code}</span>
                  </div>
                  <p className="text-sm font-semibold mt-1.5">{reg.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{BODY_DESCRIPTIONS[reg.body]}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-muted-foreground mb-1">Relevance</p>
                  <p className="text-sm font-bold text-primary">{(reg.relevance * 100).toFixed(0)}%</p>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-secondary/40 border border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{reg.section}</span>
                <button className="text-xs text-primary flex items-center gap-1 hover:underline">
                  View full text <ExternalLink size={10} />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <BookOpen size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Referenced in:</span>
                <span className="text-xs font-medium">{reg.clauseTitle}</span>
                <RiskBadge level={reg.clauseRisk} size="sm" />
              </div>

              <div className="mt-3">
                <Progress value={reg.relevance * 100} colorClass="bg-primary" className="h-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const BODIES = ['All', 'BNS', 'SEBI', 'RBI', 'Companies Act', 'IT Act'] as const

export function RegulationsPage() {
  const [bodyFilter, setBodyFilter] = useState<string>('All')

  const filtered = bodyFilter === 'All'
    ? allRegulations
    : allRegulations.filter(r => r.body === bodyFilter)

  const bodyCounts = Object.fromEntries(
    ['BNS', 'SEBI', 'RBI', 'Companies Act', 'IT Act'].map(b => [
      b, allRegulations.filter(r => r.body === b).length,
    ])
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Regulatory Mapping</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Clause-level mapping to BNS, SEBI, RBI, Companies Act & IT Act sections
        </p>
      </motion.div>

      {/* Summary cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(bodyCounts).map(([body, count]) => (
          <div
            key={body}
            onClick={() => setBodyFilter(body === bodyFilter ? 'All' : body)}
            className={cn(
              'rounded-xl border p-3 text-center cursor-pointer transition-all',
              bodyFilter === body ? 'border-primary/50 bg-primary/10' : 'border-border bg-card/60 hover:bg-secondary/40',
            )}
          >
            <p className="text-xs font-mono text-muted-foreground">{body}</p>
            <p className="text-xl font-bold mt-1">{count}</p>
            <p className="text-[10px] text-muted-foreground">references</p>
          </div>
        ))}
      </motion.div>

      {/* Filter bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center gap-2">
        <Filter size={13} className="text-muted-foreground" />
        <div className="flex items-center gap-1">
          {BODIES.map(b => (
            <button
              key={b}
              onClick={() => setBodyFilter(b)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                bodyFilter === b ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
              )}
            >
              {b}{b !== 'All' && bodyCounts[b] !== undefined && ` (${bodyCounts[b]})`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Regulation cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Scale size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No regulations found for this filter</p>
          </div>
        ) : (
          filtered.map((reg, i) => (
            <motion.div key={reg.id + reg.clauseId} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <RegulationCard reg={reg} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
