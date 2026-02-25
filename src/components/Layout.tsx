import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import {
  LayoutDashboard, FileText, List, Scale, Link2, History,
  Shield, ChevronRight, Zap,
} from 'lucide-react'
import { MOCK_ANALYSIS } from '../data/mockData'
import { Chatbot } from './Chatbot'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview & scores' },
  { to: '/document', icon: FileText, label: 'Document Viewer', desc: 'Heatmap & clauses' },
  { to: '/clauses', icon: List, label: 'Clause Analysis', desc: 'XAI & SHAP insights' },
  { to: '/regulations', icon: Scale, label: 'Regulations', desc: 'BNS & SEBI mapping' },
  { to: '/conflicts', icon: Link2, label: 'Conflict Detector', desc: 'Contradictions' },
  { to: '/history', icon: History, label: 'History', desc: 'Past analyses' },
]

const riskColor = (score: number) => {
  if (score >= 70) return 'text-red-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-emerald-400'
}

export function Layout() {
  const data = MOCK_ANALYSIS
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-border bg-card/40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Shield size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">NyayaLens</p>
            <p className="text-[10px] text-muted-foreground">Legal Risk Intelligence</p>
          </div>
        </div>

        {/* Active Document */}
        <div className="mx-3 mt-4 rounded-lg border border-border bg-secondary/40 p-3">
          <div className="flex items-start gap-2">
            <FileText size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate text-foreground">{data.fileName}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{data.language.nativeName} → EN</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap size={11} className={riskColor(data.overallRiskScore)} />
              <span className={cn('text-xs font-bold', riskColor(data.overallRiskScore))}>
                Risk: {data.overallRiskScore}/100
              </span>
            </div>
            <div className={cn(
              'text-[10px] font-medium px-2 py-0.5 rounded-full',
              data.overallRiskScore >= 70 ? 'bg-red-500/15 text-red-400' :
              data.overallRiskScore >= 40 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400',
            )}>
              {data.overallRiskScore >= 70 ? 'HIGH' : data.overallRiskScore >= 40 ? 'MEDIUM' : 'LOW'}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, desc }) => {
            const active = location.pathname === to
            return (
              <NavLink key={to} to={to}>
                <div className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                  active
                    ? 'bg-primary/15 border border-primary/25 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
                )}>
                  <Icon size={15} className={cn(active ? 'text-primary' : 'group-hover:text-foreground')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{desc}</p>
                  </div>
                  {active && <ChevronRight size={12} className="text-primary" />}
                </div>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">Powered by Bhashini</p>
              <p className="text-[10px] text-muted-foreground">22 Indian languages</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  )
}
