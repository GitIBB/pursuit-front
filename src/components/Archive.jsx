import { useState, useEffect } from 'react';
import '../styles/Archive.css';
import { fetchArticles, fetchCategories } from '../utils/api.js';

function Archive() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [sortOption, setSortOption] = useState('Newest');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const sortOptions = ['Newest', 'Oldest'];

        // Fetch categories from backend
    useEffect(() => {
        fetchCategories()
            .then(data => setCategories(['All', ...data.map(cat => cat.name)]))
            .catch(() => setCategories(['All']));
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchArticles(pageSize, (page - 1) * pageSize)
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [page]);

    // Filter and sort articles
    const getFilteredArticles = () => {
        let filtered = articles;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(article => article.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (article.username && article.username.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (sortOption === 'Newest') {
            filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortOption === 'Oldest') {
            filtered = filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        return filtered;
    };

    // Pagination controls (client-side, since backend returns a page at a time)
    // If your backend returns total count, you can use it for totalPages
    // Here, we just show Next/Prev based on page number
    return (
        <div className="archive-container">
            <h1>Archive</h1>
            <div className="archive-controls-container">
                <div className="archive-controls">
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                        {sortOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="archive-articles">
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {!loading && !error && getFilteredArticles().map(article => (
                    <div key={article.id} className="archive-article">
                        <h2>{article.title}</h2>
                        <p>By {article.username}</p>
                        <p>Category: {article.category || 'Uncategorized'}</p>
                        <p>Date: {new Date(article.created_at).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            <div className="archive-pagination">
                <button onClick={() => setPage(page => Math.max(1, page - 1))} disabled={page === 1}>Previous</button>
                <span>Page {page}</span>
                <button onClick={() => setPage(page => page + 1)} disabled={articles.length < pageSize}>Next</button>
            </div>
        </div>
    );
}

export default Archive;