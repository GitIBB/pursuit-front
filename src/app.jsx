import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import App from './components/Main.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Archive from './components/Archive.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Router>
      <div className="nav-container">
        <Navbar />
        <nav>
          <Sidebar />
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/article" element={<Article/>} />
          </Routes>
        </main>
      </div>
    </Router>
  </StrictMode>
);