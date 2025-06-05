import { useEffect, useState } from 'react';
import { apiRequest } from './auth';
import MiniPreview from '../components/MiniPreview';
import '../styles/ArticleList.css';

const ArticleList = ({ fetchUrl, emptyMessage = "No articles found." }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiRequest(fetchUrl);
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [fetchUrl]);

  if (loading) return <div className="article-list-box">Loading articles...</div>;
  if (error) return <div className="article-list-box error-message">{error}</div>;
  if (!articles.length) return <div className="article-list-box">{emptyMessage}</div>;

  return (
    <div className="article-list-box">
        <ul className="article-list-vertical">
            {articles.map(article => (
                <li key={article.ID || article.id}>
                <MiniPreview article={article} />
                </li>
            ))}
        </ul>
    </div>
  );
};

export default ArticleList;