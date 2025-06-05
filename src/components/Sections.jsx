import { Link } from 'react-router-dom';
import '../styles/Sections.css'
import extractPlainText from '../utils/extractPlainText'; // Adjust the import path as needed
import { getArticleFields } from '../utils/articleFields'; // Adjust the import path as needed


function Section({ sectionTitle, articles, visibleArticles, handleScroll, section }) {
  return (
    <section className={`${section}-section section-with-title`}>
      <div className="articles-wrapper">
        <button className="nav-button left" onClick={() => handleScroll(section, 'left')}>
          &lt;
        </button>
        <div className="articles-container">
          {visibleArticles.map((index) => {
            const article = articles[index];
            if (!article) return null;
            
            const { id: articleId, title: articleTitle, author, date, category } = getArticleFields(article);

            let image = article.body?.images?.titleImage;
            if (!image && article.image_url) image = article.image_url;

            return (
              <Link
                to={`/article/${articleId}`}
                className="frontpage-article-link"
                key={articleId}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article key={articleId} className="frontpage-article">
                  <h3 className="article-preview-title">{articleTitle}</h3>
                  <div className="article-preview-image-container">
                    {image && (
                      <img
                        src={image.startsWith('http') ? image : `${import.meta.env.VITE_BACKEND_URL || "https://localhost:8080"}${image}`}
                        alt={`Image for ${articleTitle}`}
                        className="article-preview-image"
                      />
                    )}
                  </div>
                  <div className="article-preview-content">
                      <p className="article-preview-category">
                        Category: {category || 'Uncategorized'}
                      </p>
                    <div className="article-preview-author-date">
                      <p className="article-preview-author">
                        <span className="article-preview-author-label">author:</span> {author}
                      </p>
                      <p className="article-preview-date">
                        {date && new Date(date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {/* You can add more fields here if needed */}
                    <p className="article-preview-text">
                      {/* Show a preview of the content if available */}
                      {article.body?.content?.introduction
                        ? extractPlainText(article.body.content.introduction)
                        : ''}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        <button className="nav-button right" onClick={() => handleScroll(section, 'right')}>
          &gt;
        </button>
      </div>
    </section>
  );
}

export default Section;