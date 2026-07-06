import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import ToolsPage from './pages/ToolsPage';
import ToolDetail from './pages/ToolDetail';
import './App.css';

function App() {
  return (
    <HashRouter>
      <div className="modweeb-fullpage">
        <Header />
        <div className="content-wrapper">
          <Breadcrumb />
          <Routes>
            <Route path="/" element={<Navigate to="/tools" replace />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/code-minifier" element={<ToolDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
