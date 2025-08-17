import React, { useEffect, useRef, useState } from 'react';
import { apiRequest } from '../utils/auth';
import '../styles/Post.css';
import { dateFormatter } from '../utils/miscTools';

// post component to display individual posts,
// handles displaying the post content, user info, and actions like reply
// RepliesPanel.jsx and Thread.jsx depend on this component
// does not handle ancestry/child states - delegates that to Thread.jsx

const Post = ({ post, onReply, onShowReplies }) => {
  const [user, setUser] = useState(null);
  const [showRepliesPanel, setShowRepliesPanel] = useState(false);
  const activePost = post;

  useEffect(() => {
    const fetchUser = async () => {
      if (!activePost.user_id) return;
      try {
        const res = await apiRequest(`/api/users/${activePost.user_id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user ?? data);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [activePost.user_id]);

  // extract plaintext from Lexical JSON - REPLACE WITH the appropriate utility function
  let text = typeof activePost.content === 'string' ? activePost.content : '';
  try {
    const json = typeof activePost.content === 'string' ? JSON.parse(activePost.content) : activePost.content;
    if (json.root?.children) {
      text = json.root.children
        .map(node => node.children?.map(c => c.text).join(''))
        .join('\n');
    }
  } catch {
    console.error('Failed to parse content JSON:', activePost.content);
  }

  return (
    <div className="post-container">
      <div className="post-meta">
        {/* profile pic or placeholder */}
        <div className="profile-pic-placeholder">
          {user && user.profile_picture_url ? (
            <img src={user.profile_picture_url} alt="Profile"/>
          ) : null}
        </div>
        <div className="meta-info">
          <span className="meta-name">{user?.Username}</span>
          <span className="meta-role">{user?.UserRole ?? 'Member'}</span>
          <span className="meta-signup">
            Joined: {user?.CreatedAt ? dateFormatter(user.CreatedAt) : 'N/A'}
          </span>
        </div>
      </div>
      <div className="post-content-container">
        <div className="post-header">
          <span className="post-date">
            {dateFormatter(activePost.created_at)}
          </span>
          <button
            className="post-replies-button"
            onClick={onShowReplies}
          >
            {showRepliesPanel ? "Hide Replies" : "View Replies"}
          </button>
        </div>
        <div className="post-content">
          {text.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <div className="post-footer">
          <div className="post-footer-actions">
            {/*references button will add the selected comment or highlighted text as a reference,*/}
            {/*when user makes a post, the reference will then be included in the post as a clickable element,*/}
            {/*users can toggle references on and off before posting, and can choose where in their post the reference appears,*/}
            {/*through a simple drag-and-drop interface which inserts the reference into the text editor,*/}
            {/*at most five references can be made in a single post.*/}
            <button className="post-reference-button" disabled>
              Reference this post
            </button>
            {/*rate button will allow users to rate a post by various subjective measures*/}
            {/*such as thumbs up/down and various others such as whether a post is helpful, thought-provoking, raises good points or is off-topic*/}
            <button className="post-rate-button" disabled>
              Rate
            </button>
            <button className="reply-button" onClick={onReply}>
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;