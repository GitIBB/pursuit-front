import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Article.css';
import { apiRequest } from '../utils/auth';

function Article() {
    const location = useLocation();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const articleID = queryParams.get('id');

    useEffect(() => {
        if (!articleID) {
            setError('Article ID is missing');
            setLoading(false);
            return;
        }

        const fetchArticle = async (id) => {
            try {
                setLoading(true);
                const response = await apiRequest(`/api/articles/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch article');
                }
                const data = await response.json();
                setArticle(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle(articleID);
    }, [articleID]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!article) return <div>Article not found</div>;

    // Destructure body for easier access
    const { headers = {}, content = {}, images = {} } = article.body || {};

    return (
        <div className="article">
            <h1>{article.title}</h1>
            {/* Main/title image */}
            {article.image_url && (
                <img
                    src={article.image_url}
                    alt={article.title}
                    className="article-image"
                />
            )}

            {/* Introduction Section */}
            {headers.introduction && <h2>{headers.introduction}</h2>}
            {images.titleImage && (
                <img src={images.titleImage} alt="Title Section" className="article-section-image" />
            )}
            {content.introduction && <p>{content.introduction}</p>}

            {/* Main Body Section */}
            {headers.mainBody && <h2>{headers.mainBody}</h2>}
            {images.introToBodyImage && (
                <img src={images.introToBodyImage} alt="Intro to Body" className="article-section-image" />
            )}
            {content.mainBody && <p>{content.mainBody}</p>}

            {/* Conclusion Section */}
            {headers.conclusion && <h2>{headers.conclusion}</h2>}
            {images.bodyToConclusionImage && (
                <img src={images.bodyToConclusionImage} alt="Body to Conclusion" className="article-section-image" />
            )}
            {content.conclusion && <p>{content.conclusion}</p>}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                    {article.tags.map((tag, idx) => (
                        <span key={idx} className="article-tag">{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Article;