import React from 'react';
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
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import '@fontsource-variable/jetbrains-mono';
import './App.css';
import './styles/accent-themes.css';
import './styles/typography.css';
import './styles/react-theme-adaptations.css';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <RouteLoadingIndicator />
        <a className="skip-to-content" href="#main-content">تخطَّ إلى المحتوى</a>
        <div className="modweeb-fullpage">
          <Header />
          <div className="content-wrapper">
            <Breadcrumb />
            <main className="route-content" id="main-content" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<Navigate to="/tools" replace />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/tools/code-minifier" element={<ToolDetail />} />
                <Route path="/tools/image-to-svg" element={<ImageToSvgPage />} />
                <Route path="/tools/thumbnail-generator" element={<ThumbnailPage />} />
                <Route path="/tools/article-generator" element={<ArticleGeneratorPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
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
