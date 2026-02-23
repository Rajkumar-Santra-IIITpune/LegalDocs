import { motion } from 'framer-motion'
import { FileText, Clock, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { RiskBadge } from '../components/ui/RiskBadge'
import { Progress } from '../components/ui/Progress'
import { SUPPORTED_LANGUAGES } from '../data/mockData'
import { cn, getRiskBarColor } from '../lib/utils'

const HISTORY = [
  {
    id: 'doc-2026-001',
    name: 'Employment_Contract_TechCorp.pdf',
    type: 'Employment',
    language: SUPPORTED_LANGUAGES[1],
    date: '2026-02-21T10:30:00Z',
    riskScore: 72,
    riskLevel: 'high' as const,
    clauseCount: 12,
    conflictCount: 2,
    trend: 'up',
  },
  {
    id: 'doc-2026-002',
    name: 'Vendor_Agreement_Infra2026.docx',
    type: 'Vendor',
    language: SUPPORTED_LANGUAGES[2],
    date: '2026-02-18T14:22:00Z',
    riskScore: 44,
    riskLevel: 'medium' as const,
    clauseCount: 9,
    conflictCount: 1,
    trend: 'down',
  },
  {
    id: 'doc-2026-003',
    name: 'NDA_Startup_Feb2026.pdf',
    type: 'NDA',
    language: SUPPORTED_LANGUAGES[0],
    date: '2026-02-14T09:05:00Z',
    riskScore: 28,
    riskLevel: 'low' as const,
    clauseCount: 6,
    conflictCount: 0,
    trend: 'stable',
  },
  {
    id: 'doc-2026-004',
    name: 'Rental_Agreement_Mumbai.pdf',
    type: 'Rental',
    language: SUPPORTED_LANGUAGES[3],
    date: '2026-02-10T11:45:00Z',
    riskScore: 61,
    riskLevel: 'medium' as const,
    clauseCount: 15,
    conflictCount: 1,
    trend: 'up',
  },
  {
    id: 'doc-2026-005',
    name: 'Freelance_Contract_Design.docx',
    type: 'Freelance',
    language: SUPPORTED_LANGUAGES[0],
    date: '2026-02-05T16:30:00Z',
    riskScore: 15,
    riskLevel: 'safe' as const,
    clauseCount: 7,
    conflictCount: 0,
    trend: 'down',
  },
]

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp size={12} className="text-red-400" />
  if (trend === 'down') return <TrendingDown size={12} className="text-emerald-400" />
  return <Minus size={12} className="text-muted-foreground" />
}

export function HistoryPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Analysis History</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {HISTORY.length} documents analysed · Powered by NyayaLens
        </p>
      </motion.div>

      {/* Aggregate stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Documents', value: HISTORY.length, color: 'text-primary' },
          { label: 'Avg Risk Score', value: Math.round(HISTORY.reduce((s, d) => s + d.riskScore, 0) / HISTORY.length), color: 'text-amber-400' },
          { label: 'High Risk Docs', value: HISTORY.filter(d => d.riskLevel === 'high').length, color: 'text-red-400' },
          { label: 'Conflicts Found', value: HISTORY.reduce((s, d) => s + d.conflictCount, 0), color: 'text-orange-400' },
        ].map(s => (
          <Card key={s.label} className="text-center">
            <CardContent className="pt-4 pb-4">
              <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* History list */}
      <div className="space-y-3">
        {HISTORY.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
          >
            <Card className="hover:border-border/70 cursor-pointer transition-all hover:bg-card/80 group">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/60 border border-border flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold truncate">{doc.name}</p>
                      <span className="text-xs bg-secondary/70 px-2 py-0.5 rounded-full text-muted-foreground flex-shrink-0">
                        {doc.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(doc.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-muted-foreground">{doc.language.nativeName}</span>
                      <span className="text-xs text-muted-foreground">{doc.clauseCount} clauses</span>
                      {doc.conflictCount > 0 && (
                        <span className="text-xs text-amber-400">{doc.conflictCount} conflict{doc.conflictCount > 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <div className="mt-2">
                      <Progress value={doc.riskScore} colorClass={getRiskBarColor(doc.riskScore)} className="h-1.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-lg font-bold">{doc.riskScore}</span>
                        <TrendIcon trend={doc.trend} />
                      </div>
                      <RiskBadge level={doc.riskLevel} size="sm" />
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
