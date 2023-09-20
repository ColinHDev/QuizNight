import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultView from './DefaultView.jsx'
import Quiz from './Quiz.jsx'
import QuestionView from './QuestionView.jsx'

import {QuizProvider}  from './QuizContext.jsx'

import './index.css'
import QuizHeader from './QuizHeader.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <QuizProvider>
        <QuizHeader></QuizHeader>
        <Routes>
          <Route path="/" element={<DefaultView />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/question" element={<QuestionView />} />
        </Routes>
      </QuizProvider>
    </Router>
  </React.StrictMode>,
)
