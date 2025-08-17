import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/auth';
import '../styles/ForumView.css'; 
import ThreadList from './ThreadList';

const Forum = () => {
  const { forumID } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortCategory, setSortCategory] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc or 'asc'

  useEffect(() => {
    const fetchForumAndThreads = async () => {
      try {
        const forumRes = await apiRequest(`/api/forums/${forumID}`);
        if (!forumRes.ok) throw new Error('Failed to load forum');
        const forumData = await forumRes.json();
        setForum(forumData);
        const threadsRes = await apiRequest(`/api/forums/${forumID}/threads`);
        if (!threadsRes.ok) throw new Error('Failed to load threads');
        const threadsData = await threadsRes.json();
        const threadsArray = Array.isArray(threadsData)
          ? threadsData
          : threadsData.threads || [];
       setThreads(threadsArray);
      } catch (err) {
        setError(err.message || 'Network error');
      }
      setLoading(false);
    };
    fetchForumAndThreads();
  }, [forumID]);

  if (loading) return <div>Loading forum...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!forum) return <div>Forum not found.</div>;

  // thread sorting logic. Most of these values are not currently implemented in the database, so this is primarily just placeholder logic for now.
  const threadList = Array.isArray(threads) ? threads : [];
  const sortedThreads = [...threadList].sort((a, b) => {
    let aValue, bValue;
    switch (sortCategory) {
      case 'date':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case 'replies':
        aValue = a.replies_count || 0;
        bValue = b.replies_count || 0;
        break;
      case 'references':
        aValue = a.references_count || 0;
        bValue = b.references_count || 0;
        break;
      case 'views':
        aValue = a.views_count || 0;
        bValue = b.views_count || 0;
        break;
      case 'activity':
        // ex: (replies + views) / thread age in hours
        const ageA = (Date.now() - new Date(a.created_at)) / 3600000;
        const ageB = (Date.now() - new Date(b.created_at)) / 3600000;
        aValue = ageA > 0 ? ((a.replies_count || 0) + (a.views_count || 0)) / ageA : 0;
        bValue = ageB > 0 ? ((b.replies_count || 0) + (b.views_count || 0)) / ageB : 0;
        break;
      default:
        aValue = 0;
        bValue = 0;
    }
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="forum-view-container">
        <div className="forum-header">
          <button
            className="back-to-forumMenu-btn"
            onClick={() => navigate('/forums')}>
            <span>&larr;</span>
            Back
          </button>
          <div className="thread-sorting-interface">
            <label>
              Search Forum:&nbsp;
              <input
                type="text"
                placeholder="Search threads..."
                onChange={e => {
                  const searchTerm = e.target.value.toLowerCase();
                  setThreads(prevThreads =>
                    prevThreads.filter(thread =>
                      thread.title.toLowerCase().includes(searchTerm) ||
                      thread.author.toLowerCase().includes(searchTerm)
                    )
                  );
                }}
              />
            </label>
            <label>
              Sort By:&nbsp;
              <select
                value={sortCategory}
                onChange={e => setSortCategory(e.target.value)}
              >
                <option value="date">Date Created</option>
                <option value="replies">Number of Replies</option>
                <option value="references">Number of References</option>
                <option value="views">Number of Views</option>
                <option value="activity">Activity</option>
              </select>
            </label>
            <label>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </label>
            <button
              className="new-thread-btn"
              onClick={() => navigate(`/forums/${forumID}/new-thread`)}
            >
              Create
              New Thread
            </button>
          </div>
        </div>
      <div className="forum-view-interface">
        <h2>{forum.Name}</h2>
        <ThreadList threads={sortedThreads} clickable={true} />
      </div>
    </div>
  );
};

export default Forum;