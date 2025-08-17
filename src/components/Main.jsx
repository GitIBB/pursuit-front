import { useEffect, useState } from 'react'
import '../styles/Main.css'
import { fetchArticles } from '../utils/api.js';
import Section from './Sections.jsx'


function App() {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleArticles, setVisibleArticles] = useState({
    upper: [0, 1, 2, 3], // indices of visible articles
    middle: [0, 1, 2, 3],
    bottom: [0, 1, 2, 3],
  });


  useEffect(() => {
    const loadArticles = async () => {
      try {
        let data = await fetchArticles(12, 0);
        setArticles(data);
      } catch (err) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleScroll = (section, direction) => {
    setVisibleArticles((prev) => {
      const current = prev[section];
      let newVisible;

      if (direction === 'right') {
        newVisible = current.map((index) => (index + 4) % articles.length);
      } else {
        newVisible = current.map((index) => (index - 4 + articles.length) % articles.length);
      }

      return { ...prev, [section]: newVisible };
    });
  };

  return(
    <>
      <div className="grid-container">
        <div className="section-wrapper">
          <div className="section-title-badge">Category Placeholder</div>
          <Section
            articles={articles}
            visibleArticles={visibleArticles.upper}
            handleScroll={handleScroll}
            section="upper"
          />
        </div>
        <div className="section-wrapper">
          <div className="section-title-badge">Category Placeholder</div>
          <Section
            articles={articles}
            visibleArticles={visibleArticles.middle}
            handleScroll={handleScroll}
            section="middle"
          />
        </div>
        <div className="section-wrapper">
          <div className="section-title-badge">Category Placeholder</div>
          <Section
            articles={articles}
            visibleArticles={visibleArticles.bottom}
            handleScroll={handleScroll}
            section="bottom"
          />
        </div>
      </div>
    </>
  )
}

export default App;
