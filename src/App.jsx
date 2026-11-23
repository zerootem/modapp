import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import RouteLoadingIndicator from './components/RouteLoadingIndicator';
import ToolsPage from './pages/ToolsPage';
import ToolDetail from './pages/ToolDetail';
import ImageToSvgPage from './pages/ImageToSvgPage';
import ThumbnailPage from './pages/ThumbnailPage';
import ArticleGeneratorPage from './pages/ArticleGeneratorPage';
import AboutPage from './pages/AboutPage';
import '@fontsource-variable/inclusive-sans';
import '@fontsource-variable/jetbrains-mono';
import './App.css';
import './styles/typography.css';
import './styles/react-theme-adaptations.css';

function App() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => window.__modweebHidePreloader?.());
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <ThemeProvider>
      <HashRouter>
        <RouteLoadingIndicator />
        <div className="modweeb-fullpage">
          <Header />
          <div className="content-wrapper">
            <Breadcrumb />
            <main className="route-content">
              <Routes>
                <Route path="/" element={<Navigate to="/tools" replace />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/tools/code-minifier" element={<ToolDetail />} />
                <Route path="/tools/image-to-svg" element={<ImageToSvgPage />} />
                <Route path="/tools/thumbnail-generator" element={<ThumbnailPage />} />
                <Route path="/tools/article-generator" element={<ArticleGeneratorPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
