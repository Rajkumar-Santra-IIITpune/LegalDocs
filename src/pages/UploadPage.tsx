import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Upload, FileText, Mic, Globe2, ChevronRight, Zap, ArrowRight, Check, ExternalLink, FlaskConical } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { SUPPORTED_LANGUAGES } from '../data/mockData'
import { Language } from '../types'

const FEATURES = [
  {
    icon: Shield,
    title: 'Legal-BERT Analysis',
    desc: 'Fine-tuned ML model classifies every clause as Safe, Caution, or High Risk',
  },
  {
    icon: Zap,
    title: 'SHAP Explainability',
    desc: 'Shapley values pinpoint the exact words triggering each risk score',
  },
  {
    icon: Globe2,
    title: '22 Indian Languages',
    desc: 'Bhashini-powered translation & voice input for all official Indian languages',
  },
]

const SAMPLE_DOCS = [
  {
    name: 'Employment Contract (Hindi)',
    type: 'Employment',
    lang: 'हिन्दी',
    risk: 'High Risk',
    riskClass: 'text-red-400 bg-red-500/10 border-red-500/25',
    demo: true,
  },
  {
    name: 'NDA — Startup (English)',
    type: 'NDA',
    lang: 'English',
    risk: 'Low Risk',
    riskClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    demo: true,
  },
  {
    name: 'SEBI Portfolio Manager Agreement',
    type: 'SEBI Regulatory',
    lang: 'English',
    risk: 'Medium',
    riskClass: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    url: 'https://www.sebi.gov.in/sebi_data/attachdocs/1441261015650.pdf',
  },
  {
    name: 'RBI Loan Agreement Template',
    type: 'Banking',
    lang: 'English',
    risk: 'Medium',
    riskClass: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    url: 'https://rbidocs.rbi.org.in/rdocs/Publications/PDFs/MCBLAF070712.pdf',
  },
  {
    name: 'MCA — Model Debenture Trust Deed',
    type: 'Corporate',
    lang: 'English',
    risk: 'Caution',
    riskClass: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    url: 'https://www.mca.gov.in/content/dam/mca/uploadedfiles/TRUST_DEED_MODEL_FORMAT.pdf',
  },
  {
    name: 'IndiaCode — Bhartiya Nyaya Sanhita 2023',
    type: 'Legislation',
    lang: 'English',
    risk: 'Reference',
    riskClass: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/20062/1/2023_45.pdf',
  },
]


export function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [lang, setLang] = useState<Language>(SUPPORTED_LANGUAGES[0])
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [step, setStep] = useState<'upload' | 'language' | 'ready'>('upload')

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length) {
      setFile(accepted[0])
      setStep('language')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 2800))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/3 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Shield size={18} className="text-primary" />
          </div>
          <div>
            <span className="text-base font-bold">NyayaLens</span>
            <span className="ml-2 text-xs text-muted-foreground font-mono">v2.1</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-xs text-muted-foreground">Bhashini API Connected</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 text-xs text-primary font-medium mb-6">
            <Zap size={11} />
            Hybrid RAG + Legal-BERT Pipeline
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Decode Every Clause,{' '}
            <span className="text-gradient">Before You Sign</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Upload any Indian legal contract in 22 languages. Get AI-powered risk scores, SHAP explanations,
            regulatory mapping to BNS & SEBI, and safer clause rewrites — all in your native language.
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-2xl space-y-4"
        >
          {/* Step 1: Drop zone */}
          <div
            {...getRootProps()}
            className={cn(
              'relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300',
              isDragActive
                ? 'border-primary bg-primary/10 scale-[1.01]'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-border hover:border-primary/50 hover:bg-primary/5',
            )}
          >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <FileText size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setFile(null); setStep('upload') }}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Remove & choose another
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl border flex items-center justify-center transition-colors',
                    isDragActive ? 'bg-primary/20 border-primary/50' : 'bg-secondary border-border',
                  )}>
                    <Upload size={22} className={isDragActive ? 'text-primary' : 'text-muted-foreground'} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {isDragActive ? 'Drop your contract here' : 'Drop your contract or click to browse'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Supports PDF, DOCX · Scanned documents via OCR</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="outline">
                      <Upload size={13} />
                      Browse Files
                    </Button>
                    <span className="text-xs text-muted-foreground">or</span>
                    <Button size="sm" variant="outline">
                      <Mic size={13} />
                      Voice Input
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step 2: Language Select */}
          <AnimatePresence>
            {step !== 'upload' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-border bg-card/60 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe2 size={15} className="text-primary" />
                      <span className="text-sm font-medium">Document Language</span>
                    </div>
                    <span className="text-xs text-muted-foreground">via Bhashini NMT</span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowLangPicker(v => !v)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base">{lang.nativeName}</span>
                        <span className="text-sm text-muted-foreground">— {lang.name}</span>
                      </span>
                      <ChevronRight size={14} className={cn('text-muted-foreground transition-transform', showLangPicker && 'rotate-90')} />
                    </button>
                    <AnimatePresence>
                      {showLangPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute top-full mt-2 left-0 right-0 z-20 rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-0.5 p-1.5 max-h-52 overflow-y-auto">
                            {SUPPORTED_LANGUAGES.map(l => (
                              <button
                                key={l.code}
                                onClick={() => { setLang(l); setShowLangPicker(false); setStep('ready') }}
                                className={cn(
                                  'flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors hover:bg-secondary',
                                  lang.code === l.code && 'bg-primary/15 text-primary',
                                )}
                              >
                                <span className="text-sm font-medium">{l.nativeName}</span>
                                <span className="text-xs text-muted-foreground">{l.name}</span>
                                {lang.code === l.code && <Check size={11} className="ml-auto text-primary" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze button */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  className="w-full h-12 text-base font-semibold glow-primary"
                  onClick={handleAnalyze}
                  loading={analyzing}
                >
                  {analyzing ? (
                    <span>Analyzing with Legal-BERT & Bhashini…</span>
                  ) : (
                    <>
                      Analyze Contract
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
                {analyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 space-y-1"
                  >
                    {[
                      '🔄 Translating via Bhashini NMT…',
                      '🧩 Segmenting clauses with spaCy…',
                      '🤖 Classifying with Legal-BERT…',
                      '🔍 Retrieving precedents from FAISS…',
                    ].map((msg, i) => (
                      <motion.p
                        key={msg}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.6 }}
                        className="text-xs text-muted-foreground text-center font-mono"
                      >
                        {msg}
                      </motion.p>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sample Documents */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full max-w-2xl mt-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical size={13} className="text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Try with a sample document
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_DOCS.map((doc, i) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                {doc.demo ? (
                  /* Demo docs — navigate directly to dashboard */
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card/40 hover:bg-card/80 hover:border-border/80 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{doc.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{doc.type}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{doc.lang}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', doc.riskClass)}>
                        {doc.risk}
                      </span>
                      <ArrowRight size={11} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </button>
                ) : (
                  /* Real public PDFs — open in new tab */
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card/40 hover:bg-card/80 hover:border-border/80 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{doc.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{doc.type}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{doc.lang}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', doc.riskClass)}>
                        {doc.risk}
                      </span>
                      <ExternalLink size={11} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Demo docs run a simulated analysis · External links open the real government PDF in a new tab
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass rounded-xl p-4 text-center"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-3">
                <f.icon size={16} className="text-primary" />
              </div>
              <p className="text-sm font-semibold mb-1">{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          NyayaLens · Bhashini × Legal-BERT × SHAP · Built for India's 22 official languages
        </p>
      </footer>
    </div>
  )
}
