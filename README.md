# NyayaLens — Legal Risk Intelligence

A complete React frontend for AI-powered legal contract analysis supporting 22 Indian languages.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v3 (dark theme) |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v7 |
| File Upload | React Dropzone |

## Pages

| Route | Page |
|---|---|
| `/` | Upload & Language selection |
| `/dashboard` | Risk overview, gauge, charts |
| `/document` | Risk heatmap document viewer |
| `/clauses` | Clause-by-clause SHAP analysis |
| `/regulations` | BNS / SEBI / RBI regulatory mapping |
| `/conflicts` | Internal clause conflict detector |
| `/history` | Analysis history |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Architecture (frontend mirrors backend pipeline)

```
Upload → Language Detection (Bhashini)
       → Clause Segmentation (spaCy)
       → Legal-BERT Classification (Safe/Caution/High Risk)
       → FAISS RAG Retrieval (Case Precedents)
       → SHAP Explainability
       → Llama-3 Rewrite Engine
       → Regulatory Mapping (BNS / SEBI / RBI)
       → Conflict Detection
       → Bhashini Translation (Output)
```
