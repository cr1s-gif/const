import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './paginas/inicio';
import DashboardPage from './paginas/dashboard';
import QuizContainer from './paginas/questioncontainer';
import Resultados from './paginas/resultados';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quizcontainer" element={<QuizContainer />} />
        <Route path="/resultados" element={<Resultados />} />
      </Routes>
    </Router>
  );
};

export default App;