import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ForumMenu.css';

const ForumSection = ({ title, forums }) => {
  if (!forums.length) return null;
  return (
    <div className="forum-section">
      <h3>{title}</h3>
      <ul className="forum-list">
        {forums.map(forum => (
          <li key={forum.id}>
            <Link to={`/forums/${forum.id}`}>
              <strong>{forum.forum_name}</strong>
            </Link>
            <div>{forum.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumSection;