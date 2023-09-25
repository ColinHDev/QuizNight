import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WelcomeView from './WelcomeView.jsx'
import QuizGridView from './QuizGridView.jsx'
import QuestionView from './QuestionView.jsx'
import FinalResultsView from './FinalResultsView.jsx'

import { QuizProvider } from './QuizContext.jsx'

import QuizHeader from './layout/QuizHeader.jsx'

import './ressources/css/QuizStyles.css'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <QuizProvider>
        <div className='overflow-hidden relative h-screen'>
          <QuizHeader></QuizHeader>
          <Routes>
            <Route path="/" element={<WelcomeView />} />
            <Route path="/quiz" element={<QuizGridView />} />
            <Route path="/question" element={<QuestionView />} />
            <Route path="/results" element={<FinalResultsView />} />
          </Routes>
        </div>
      </QuizProvider>
    </Router>
  </React.StrictMode>,
)
