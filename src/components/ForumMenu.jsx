import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/auth';
import '../styles/ForumMenu.css';
import ForumSection from './ForumSections';

const ForumMenu = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await apiRequest('/api/forums');
        if (response.ok) {
          const data = await response.json();
          setForums(data);
        } else {
          setError('Failed to load forums');
        }
      } catch {
        setError('Network error');
      }
      setLoading(false);
    };
    fetchForums();
  }, []);

  if (loading) return <div>Loading forums...</div>;
  if (error) return <div className="error">{error}</div>;

  const generalForums = forums.filter(f => f.forum_type === 'general');
  // separate general forums further at a later point. Want to separate into humanities, natural sciences, social sciences, etc.
  // for now, just keep them as general forums

  const articlesForums = forums.filter(f => f.forum_type === 'article');
  // articles forums should also be separated into different categories at a later point in a similar way to general forums.

  const siteForums = forums.filter(f => f.forum_type === 'site');
  const communityForums = forums.filter(f => f.forum_type === 'community');

  return (
    <div className="forum-menu">
      <ForumSection title="Article Boards" forums={articlesForums} />
      <ForumSection title="General Boards" forums={generalForums} />
      <ForumSection title="Site Boards" forums={siteForums} />
      <ForumSection title="Community Boards" forums={communityForums} />
    </div>
  );
};

export default ForumMenu;