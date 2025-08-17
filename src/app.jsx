import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import App from './components/Main.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Archive from './components/Archive.jsx';
import Article from './components/Article';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import ArticleCreate from './components/ArticleCreate.jsx';
import ForumCreate from './components/ForumCreate.jsx';
import ForumMenu from './components/ForumMenu';
import Forum from './components/Forum.jsx';
import ThreadCreate from './components/ThreadCreate.jsx';
import Thread from './components/Thread.jsx';


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
            <Route path="/article/:id" element={<Article/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/article-create" element={<ArticleCreate />} />
            <Route path="/forum-create" element={<ForumCreate />} />
            <Route path="/forums" element={<ForumMenu />} />
            <Route path="/forums/:forumID" element={<Forum />} />
            <Route path="/forums/:forumID/new-thread" element={<ThreadCreate />} />
            <Route path="/forums/:forumID/threads/:threadID" element={<Thread />} />
          </Routes>
        </main>
      </div>
    </Router>
  </StrictMode>
);