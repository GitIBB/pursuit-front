import { useState } from 'react';
import '../styles/Archive.css';

function Archive() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOption, setSortOption] = useState('Newest');
    const [filteredArticles, setFilteredArticles] = useState([]); // Placeholder for articles

    // Placeholder for categories (to be fetched from the database / expanded later)
    const categories = ['All', 'Technology', 'Health', 'Science', 'Business'];

    // Placeholder for sorting options, add more of these as needed
    const sortOptions = ['Most Popular', 'Highest Rated', 'Newest', 'Oldest'];

    // Placeholder for articles (to be replaced with database data)
    const articles = [
        { id: 1, title: 'Article 1', author: 'Author A', category: 'Technology', date: '2025-05-01' },
        { id: 2, title: 'Article 2', author: 'Author B', category: 'Health', date: '2025-04-15' },
        // Add more dummy articles here
    ];

    // Handle search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle category selection
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Handle sorting option selection
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Filter and sort articles (logic placeholder)
    const getFilteredArticles = () => {
        let filtered = articles;

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter((article) => article.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((article) =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort articles
        if (sortOption === 'Newest') {
            filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOption === 'Oldest') {
            filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        return filtered;
    };

    return (
        <>
            <div className="archive-container">
                <h1>Archive</h1>
                <div className="archive-controls-container">
                    <div className="archive-controls">
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <select value={selectedCategory} onChange={handleCategoryChange}>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <select value={sortOption} onChange={handleSortChange}>
                            {sortOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="archive-articles">
                    {getFilteredArticles().map((article) => (
                        <div key={article.id} className="archive-article">
                            <h2>{article.title}</h2>
                            <p>By {article.author}</p>
                            <p>Category: {article.category}</p>
                            <p>Date: {article.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Archive;