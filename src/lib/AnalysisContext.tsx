import { createContext, useContext, useState, ReactNode } from 'react'
import { AnalysisResult, Language } from '../types'
import { extractTextFromFile } from './extractor'
import { generateAnalysis } from './generator'
import { MOCK_ANALYSIS } from '../data/mockData'

type AnalysisContextType = {
    currentAnalysis: AnalysisResult | null
    isAnalyzing: boolean
    analyzeDocument: (file: File | null, lang: Language) => Promise<void>
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(MOCK_ANALYSIS)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const analyzeDocument = async (file: File | null, lang: Language) => {
        setIsAnalyzing(true)
        try {
            if (!file) {
                // Mock demo logic
                setCurrentAnalysis(MOCK_ANALYSIS)
                await new Promise(r => setTimeout(r, 1500))
                return
            }

            // 1. Extract raw text
            const text = await extractTextFromFile(file)

            // 2. Pass real text to AI or Heuristic Generator
            const result = await generateAnalysis(text, file, lang)

            setCurrentAnalysis(result as AnalysisResult)
        } catch (e) {
            console.error('Analysis failed:', e)
            // fallback to mock gracefully if it fails
            setCurrentAnalysis(MOCK_ANALYSIS)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <AnalysisContext.Provider value={{ currentAnalysis, isAnalyzing, analyzeDocument }}>
            {children}
        </AnalysisContext.Provider>
    )
}

export function useAnalysis() {
    const context = useContext(AnalysisContext)
    if (!context) {
        throw new Error('useAnalysis must be used within an AnalysisProvider')
    }
    return context
}
