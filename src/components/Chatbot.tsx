import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, X, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const HARDCODED_ANSWERS: Record<string, string> = {
  'What are the high-risk clauses in this contract?': 'Based on our analysis, the top 3 high-risk clauses are: (1) Unlimited liability clause in Section 5.2 - could expose you to significant financial risk, (2) Termination without cause in Section 7.1 - allows either party to terminate with only 30 days notice, and (3) Unilateral amendment rights in Section 8.3 - permits the counterparty to modify terms unilaterally. We recommend negotiating these items.',
  'Are there any legal conflicts we should address?': 'Yes, we detected 12 conflicts in this contract. Key conflicts include: Contradiction between Section 3.2 (payment terms) and Section 6.1 (discount schedule). Section 4.5 contradicts Section 9.2 regarding liability caps. The confidentiality obligations in Section 10 appear to conflict with the data sharing requirements in Section 2.3. We recommend resolving these conflicts before execution.',
  'Summarize the payment terms section': 'Payment Terms Summary (Section 3): Invoices are due within 30 days of delivery (Net-30). A 5% early payment discount is available if payment is made within 10 days. Late payments accrue 1.5% monthly interest. Quarterly reconciliation is required with a 15-day dispute period. The contract includes provision for partial payments with prorated services. Currency is USD and wire transfer is the primary payment method.',
  'Which clauses need regulatory review?': 'The following 5 clauses require regulatory review: (1) Data Processing clause (Section 2.3) - needs GDPR/CCPA compliance verification, (2) Export Control clause (Section 6.4) - verify against current trade restrictions, (3) Dispute Resolution (Section 11.1) - arbitration clause may conflict with mandatory jurisdiction rules, (4) Indemnity clause (Section 5.4) - needs compliance with industry standards, (5) Compliance & Reporting (Section 9.1) - verify against regulatory requirements in your jurisdiction.',
  'Explain the indemnification clause': 'Indemnification Clause (Section 5.4): Each party agrees to indemnify and hold harmless the other from claims arising from its breach of the agreement. The indemnifying party will defend any claims at its expense. However, this clause has no cap on liability and no time limitation on claims, which is unusual. It applies to third-party claims only, not internal disputes. We recommend adding a cap of 12 months and capping liability at 2x annual fees to reduce risk exposure.',
  'What are the termination conditions?': 'Termination Conditions (Section 7): Either party can terminate without cause with 30 days written notice. Upon termination, you have 60 days to wind down services. There is a 6-month survival clause for confidentiality and indemnification. Early termination has no penalties for good cause (breach). Outstanding invoices remain due. Intellectual property rights revert according to Section 4. Customer data must be returned within 30 days. We flag the absence of termination penalties as a risk - consider adding early termination fees.',
  'What are the intellectual property rights?' : 'IP Rights (Section 4): All pre-existing IP belongs to the respective owning party. Work product created during the engagement belongs to the client unless otherwise specified in statements of work. The vendor retains rights to tools, methodologies, and templates used. There is a mutual non-exclusive license for baseline materials. However, the clause lacks clarity on derivative works - we recommend clarifying ownership if modifications are made to existing IP. Third-party components are licensed separately under their original terms.',
  'What confidentiality obligations apply?': 'Confidentiality Obligations (Section 10): Both parties must keep sensitive information confidential for 5 years after disclosure. Exceptions include: information already public, independently developed, or legally required to be disclosed. Employees and contractors must sign NDAs. Confidential information can be disclosed to advisors under NDA. Breach results in injunctive relief without requiring proof of damages. However, the definition of "confidential information" is overly broad - we recommend narrowing it to focus on genuinely sensitive data.',
  'Are there any force majeure provisions?': 'Force Majeure (Section 12): The contract includes a comprehensive force majeure clause covering acts of God, war, terrorism, pandemics, and other unforeseen events. Upon a force majeure event, the affected party must provide notice within 5 days. Performance obligations are suspended (not terminated) during the event. If suspension exceeds 60 days, either party can terminate without penalty. However, the clause excludes cyber attacks and pandemics in certain contexts - clarification is needed. Payment obligations continue during force majeure unless services cannot be performed.',
  'What are the warranty and liability terms?': 'Warranty & Liability (Sections 5-6): The vendor warrants services will be performed professionally and comply with laws. There is a 30-day warranty coverage period. However, there is a broad disclaimer excluding consequential, incidental, and indirect damages. Liability is capped at 1x annual contract value or $50,000 (whichever is greater), but this is considered moderate risk. There is no warranty for third-party components. The cap applies to all claims combined (aggregate cap), which limits your recovery in major incidents. We recommend negotiating for higher caps on critical services.',
}

const QUERY_LIST = Object.keys(HARDCODED_ANSWERS)

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Legal AI Assistant. I can help you analyze clauses, identify risks, and answer questions about this contract. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Get hardcoded answer or default response
    setTimeout(() => {
      const answer = HARDCODED_ANSWERS[messageText] || 'This is a great question! In a live implementation, this query would be processed by our AI engine to provide a detailed analysis. For now, try asking one of the suggested questions above.'
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 800)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <Card className="h-full flex flex-col border-0">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MessageCircle size={20} />
                      Legal AI Assistant
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/70">Chat to analyze your contract</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 text-xs text-white font-medium">
                    <Sparkles size={12} />
                    Live
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-4 min-h-0 p-4">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {messages.length === 1 && inputValue === '' && messages[0].sender === 'bot' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5 py-2">
                      <p className="text-xs text-muted-foreground font-medium px-1">Popular questions:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {QUERY_LIST.map((query, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            onClick={() => handleSendMessage(query)}
                            className="text-left p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-xs text-foreground/80 hover:text-foreground transition-all border border-primary/20 hover:border-primary/40"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                              <span className="line-clamp-2">{query}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {messages.map((message, i) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn('flex gap-2', message.sender === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-xs px-3 py-2.5 rounded-lg text-sm break-words',
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-secondary text-foreground rounded-bl-none'
                        )}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                      <div className="bg-secondary text-foreground px-3 py-2.5 rounded-lg rounded-bl-none flex items-center gap-2">
                        <span className="text-sm">Analyzing</span>
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <motion.span
                              key={i}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ delay: i * 0.15, repeat: Infinity, duration: 1.2 }}
                              className="block w-1.5 h-1.5 rounded-full bg-foreground/40"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                          handleSendMessage()
                        }
                      }}
                      placeholder="Ask a question..."
                      className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      disabled={isLoading}
                    />
                    <Button
                      size="icon"
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                      className="flex-shrink-0"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Press Enter to send</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
