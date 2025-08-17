import { useEffect, useState } from 'react';
import '../styles/Profile.css'; 
import { apiRequest } from '../utils/auth.js'; 
import ArticleList from './ArticleList.jsx';
import { dateFormatter } from '../utils/miscTools.js';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiRequest('/api/me', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }
  const formattedDate = new Date(user.CreatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="profile-container">
      <div className="user-info-container">
        <h2>Profile</h2>
        <p>Email: {user.Email}</p>
        <p>Username: {user.Username}</p>
        <p>Account created: {user?.CreatedAt ? dateFormatter(user.CreatedAt) : 'N/A'}</p>
      </div>
      <div className="user-articles-list">
        <ArticleList
          fetchUrl={`/api/users/${user.ID || user.id}/articles`}
          emptyMessage="You haven't written any articles yet."
        />
        
      </div>
    </div>
  );
};

export default Profile;