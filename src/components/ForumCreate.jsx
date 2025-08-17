import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/auth';
import '../styles/ForumCreate.css';

// component to create a new forum, purely for admin use (might be removed, handled by backend)

const ForumCreate = ({ onCreated }) => {
  const [name, setTitle] = useState('');
  const [categories, setCategory] = useState([]);
  const [forumCategoryID, setForumCategoryID] = useState('');
  const [forumType, setForumType] = useState('general'); // default type
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userID, setUserId] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiRequest('/api/me');
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.UserRole);
          setUserId(data.ID);
        } else {
          setUserRole(null);
          setUserId(null);
        }
      } catch {
        setUserRole(null);
        setUserId(null);
      }
      setCheckingRole(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategory(data);
          if (data.length > 0) setForumCategoryID(data[0].id);
        }
      } catch {
        setCategory([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Submitting forum with owner_id:', userID);

    const selectedCategory = categories.find(cat => cat.id === forumCategoryID);

    // forum_type is "community", category must also be "community"
    if (
      forumType === "community" &&
      (!selectedCategory || selectedCategory.name.toLowerCase() !== "community")
    ) {
      setError('If Forum Type is "Community", the Category must also be "Community".');
      setLoading(false);
      return;
    }
    // category is "community", forum_type must also be "community"
    if (
      selectedCategory &&
      selectedCategory.name.toLowerCase() === "community" &&
      forumType !== "community"
    ) {
      setError('If Category is "Community", the Forum Type must also be "Community".');
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest('/admin/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          forum_category_id: forumCategoryID,
          description,
          forum_type: forumType,
          owner_id: userID,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create forum');
      } else {
        setTitle('');
        setDescription('');
        if (onCreated) onCreated();
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  if (checkingRole) {
    return <div>Loading...</div>;
  }

  if (userRole !== 'admin') {
    return <div className="forum-create-container"><div className="error">Forbidden: Admins only</div></div>;
  }

   return (
    <div className="forum-create-container">
      <form className="forum-create-form" onSubmit={handleSubmit}>
        <h2>Create Forum</h2>
        {error && <div className="error">{error}</div>}
        <label>
          Name:
          <input
            value={name}
            onChange={e => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label>
          Category:
          <select className="forum-select-box"
            value={forumCategoryID}
            onChange={e => setForumCategoryID(e.target.value)}
            required
            disabled={loading}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Forum Type:
          <select className="forum-select-box"
            value={forumType}
            onChange={e => setForumType(e.target.value)}
            required
            disabled={loading}
          >
            <option value="community">Community</option>
            <option value="general">General</option>
            <option value="article">Article</option>
            <option value="board">Site</option>
          </select>
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Forum'}
        </button>
      </form>
    </div>
  );
};

export default ForumCreate;