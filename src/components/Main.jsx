import { useState } from 'react'
import '../styles/Main.css'
import articles from '../data/articlesData' // REPLACE WITH DATA SOURCE
import Section from './Sections.jsx'

function App() {

  // State to track the visible articles for each section
  const [visibleArticles, setVisibleArticles] = useState({
    upper: [0, 1, 2, 3], // indices of visible articles
    middle: [0, 1, 2, 3],
    bottom: [0, 1, 2, 3],
  });

  // Function to handle navigation
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
        <Section          
          title="Upper Section"
          articles={articles}
          visibleArticles={visibleArticles.upper}
          handleScroll={handleScroll}
          section="upper"
        />
        <Section
          title="Middle Section"
          articles={articles}
          visibleArticles={visibleArticles.middle}
          handleScroll={handleScroll}
          section="middle"
        ></Section>
        <Section
          title="Lower Section"
          articles={articles}
          visibleArticles={visibleArticles.bottom}
          handleScroll={handleScroll}
          section="bottom"
          />
      </div>
    </>
  )
}

export default App;
