import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Article.css';

function Article() {
    const location = useLocation();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extract query parameters (e.g., ?id=123)
    const queryParams = new URLSearchParams(location.search);
    const articleID = queryParams.get('id');

    useEffect(() => {
        if (!articleID) {
            setError('Article ID is missing');
            setLoading(false);
            return;
        }

        // Fetch article data dynamically
        const fetchArticle = async (id) => {
            try {
                setLoading(true);
                const response = await fetch(`/api/articles/${id}`); // Replace with your API endpoint
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

    return (
        <div className="article">
            <h1>{article.title}</h1>
            <p>{article.content}</p>
        </div>
    );
}

export default Article;
