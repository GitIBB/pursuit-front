import { useEffect, useState } from 'react';
import '../styles/Profile.css'; 
import { apiRequest } from '../utils/auth.js'; 
import ArticleList from '../utils/ArticleList.jsx'; 

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
        console.log('User data:', data); // Debugging: Log the user data
        setUser(data);
      } catch (err) {
        console.error('Error fetching user data:', err.message); // Debugging: Log the error
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
  console.log('user ID:', user.ID, user.id);
  // Format the CreatedAt date dynamically based on the user's locale
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
        <p>Created At: {formattedDate}</p>
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