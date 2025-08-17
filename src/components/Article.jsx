import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../styles/Article.css';
import { apiRequest } from '../utils/auth.js';
import LexicalViewer from '../utils/textViewer'; 

function Article() {
    const { id } = useParams();
    const location = useLocation();
    const [article, setArticle] = useState(null);6
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:8080";


    useEffect(() => {
        if (!id) {
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

        fetchArticle(id);
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!article) return <div>Article not found</div>;

    // destructure
    const { headers = {}, content = {}, images = {} } = article.body || {};

    return (
        <div className="article">
            <h1>{article.title}</h1>

            {/* intro */}
            
            {images.titleImage && (
                <img src={`${BACKEND_URL}${images.titleImage}`} alt="Title Section" className="article-section-image" />
            )}
            {headers.introduction && <h2>{headers.introduction}</h2>}
            {content.introduction && (
            <LexicalViewer initialJson={content.introduction} />
            )}

            {/* main */}
            {headers.mainBody && <h2>{headers.mainBody}</h2>}
            {images.introToBodyImage && (
                <img src={`${BACKEND_URL}${images.introToBodyImage}`} alt="Intro to Body" className="article-section-image" />
            )}
            {content.mainBody && (
            <LexicalViewer initialJson={content.mainBody} />
            )}

            {/* conc */}
            {headers.conclusion && <h2>{headers.conclusion}</h2>}
            {images.bodyToConclusionImage && (
                <img src={`${BACKEND_URL}${images.bodyToConclusionImage}`} alt="Body to Conclusion" className="article-section-image" />
            )}
            {content.conclusion && (
            <LexicalViewer initialJson={content.conclusion} />
            )}

            {/* tag*/}
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