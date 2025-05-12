import React from "react";
import '../styles/Sections.css'

function Section({ title, articles, visibleArticles, handleScroll, section }) {
    return (
      <section className={`${section}-section`}>
        <h2 className="section-title">{title}</h2>
        <div className="articles-wrapper">
          <button className="nav-button left" onClick={() => handleScroll(section, 'left')}>
            &lt;
          </button>
          <div className="articles-container">
            {visibleArticles.map((index) => (
              <article key={articles[index].id} className="frontpage-article">
                <h3 className="article-preview-title">{articles[index].title}
                </h3>

                <div className="article-preview-image-container">
                  <img src={articles[index].image}
                  alt={`Image for ${articles[index].title}`} 
                  className="article-preview-image" />
                </div>

                <div className="article-preview-content">
                  <div className="article-preview-author-date">
                     <p className="article-preview-author">{articles[index].author}</p>
                    <p className="article-preview-date">{articles[index].date}</p>
                  </div>
                  <div className="article-preview-info-container">
                    <p className="article-preview-comments">{articles[index].comments}</p>
                    <p className="article-preview-mentions">{articles[index].mentions}</p>
                    <p className="article-preview-rating">{articles[index].ratingScore}</p>
                    <p className="article-preview-evalProfile">{articles[index].evalTypes}</p>
                  </div>
                 
                  <p className="article-preview-text">{articles[index].content}</p>
                </div>
              </article>
            ))}
          </div>
          <button className="nav-button right" onClick={() => handleScroll(section, 'right')}>
            &gt;
          </button>
        </div>
      </section>
    );
  }

  export default Section;