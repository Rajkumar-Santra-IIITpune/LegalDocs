import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { UploadPage } from './pages/UploadPage'
import { DashboardPage } from './pages/DashboardPage'
import { DocumentViewerPage } from './pages/DocumentViewerPage'
import { ClauseAnalysisPage } from './pages/ClauseAnalysisPage'
import { RegulationsPage } from './pages/RegulationsPage'
import { ConflictsPage } from './pages/ConflictsPage'
import { HistoryPage } from './pages/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/document" element={<DocumentViewerPage />} />
          <Route path="/clauses" element={<ClauseAnalysisPage />} />
          <Route path="/regulations" element={<RegulationsPage />} />
          <Route path="/conflicts" element={<ConflictsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
