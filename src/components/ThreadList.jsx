import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ThreadList = ({ threads, clickable = false }) => {
  const navigate = useNavigate();
  const { forumID } = useParams();

  return (
    <ul className="thread-list">
      {threads.map(thread => (
        <li
          key={thread.id}
          className={clickable ? 'thread-item clickable' : 'thread-item'}
          onClick={() => clickable && navigate(`/forums/${forumID}/threads/${thread.id}`)}
        >
          <div className="thread-title">{thread.title}</div>
          <div className="thread-author">{thread.author}</div>
        </li>
      ))}
    </ul>
  );
};

export default ThreadList;