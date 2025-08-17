import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest, isLoggedIn } from '../utils/auth';
import Post from './Post';
import '../styles/Thread.css';
import TextEditorReplies from '../utils/textEditorReplies';
import RepliesPanel from './RepliesPanel';

const Thread = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { forumID, threadID } = useParams();
  const [thread, setThread] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [posts, setPosts] = useState([]);
  const sortedPosts = [...posts].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const postRefs = useRef({});

  const [openRepliesPanels, setOpenRepliesPanels] = useState([]); // array of post IDs

  const textEditorRef = useRef(null);
  const [replyToPostID, setReplyToPostID] = useState(null);
  const replyToPost = posts.find(p => p.id === replyToPostID);

  // !!!!! unused at the moment - incorportate (fix use)
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // login check
  useEffect(() => {
    isLoggedIn().then(result => {
      setLoggedIn(result);
      setAuthChecked(true);
    });
  }, []);

  function flattenPosts(nestedPosts) {
    const result = [];
    function recurse(item) {
      if (item.post) result.push(item.post);
      if (Array.isArray(item.children)) {
        item.children.forEach(recurse);
      }
    }
    nestedPosts.forEach(recurse);
    return result;
  }

  const fetchThreadAndPosts = async () => {
    try {
      const tRes = await apiRequest(`/api/threads/${threadID}`);
      if (!tRes.ok) throw new Error('Failed to load thread');
      const tData = await tRes.json();

      const cRes = await apiRequest(`/api/threads/${threadID}/posts?page=${currentPage}&limit=10`);
      if (!cRes.ok) throw new Error('Failed to load posts');
      const pData = await cRes.json();

      const rawList = Array.isArray(pData.posts) ? pData.posts : [];
      if (Array.isArray(pData.posts)) {
        const flatPosts = flattenPosts(rawList);
        setThread(tData.thread ?? tData);
        setPosts(flatPosts);
        setTotalPages(pData.metadata.total_pages);
        setCurrentPage(pData.metadata.current_page);
        setError('');
      }
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {    
    if (!forumID || !threadID) return;
    setLoading(true);
    fetchThreadAndPosts();
  }, [forumID, threadID]);

  useEffect(() => {
    fetchThreadAndPosts();
  }, [currentPage]);

  const handleShowReplies = (post) => {
    setOpenRepliesPanels(prev =>
      prev.some(panel => panel.rootId === post.id)
        ? prev
        : [...prev, { rootId: post.id, ancestry: [post] }]
    );
  };

  // unused at the moment
  const handleSelectPost = (rootId, post) => {
    setSelectedPostByPanel(prev => ({ ...prev, [rootId]: post }));
  };

  const handleCloseReplies = (postID) => {
    setOpenRepliesPanels(prev => prev.filter(panel => panel.rootId !== postID));
  };

  const handleReplySubmit = useCallback(async () => {
    setError('');
    setSuccess(false);
    try {
      if (!await isLoggedIn()) {
        throw new Error('Not authenticated');
      }
      const content = textEditorRef.current.getContent();
      const payload = {
        parent_id: replyToPost.id,
        content,
      };
      if (!replyToPost || !replyToPost.id) {
        setError('No parent post selected for reply.');
        return;
      }
      const response = await apiRequest(`/api/threads/${threadID}/posts`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    } catch (err) {
      setError(err.message);
    } finally {
      setSuccess(true);
      setReplyToPostID(null); // close editor after submit
    }
  }, [replyToPostID, threadID]);

  const handleClose = useCallback(() => setReplyToPostID(null), []);

  // early return for loading / error / not found
  if (loading || error || !thread || posts.length === 0) {
    return (
      <div className="thread-view-container">
        {loading && <p className="thread-message">Loading thread…</p>}
        {error && <p className="thread-error">{error}</p>}
        {!loading && !thread && <p className="thread-message">Thread not found.</p>}
        {!loading && posts.length === 0 && <p className="thread-message">No posts found.</p>}
      </div>
    );
  }

  return (
    <div className="thread-view-container">
      <p className="system-message-container"></p>
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="thread-title">{thread.title}</h2>
      <div className="thread-main-layout">
        <div className="posts-section">
          {sortedPosts.map(post => {
            const panel = openRepliesPanels.find(p => p.rootId === post.id);
            const displayPost = panel ? panel.ancestry[panel.ancestry.length - 1] : post;
            console.log('DisplayPost:', displayPost);
            return (
              <React.Fragment key={post.id}>
                <div ref={el => postRefs.current[post.id] = el}>
                  <Post
                    post={displayPost}
                    onReply={() => setReplyToPostID(displayPost.id)}
                    onShowReplies={() => handleShowReplies(post)}
                  />
                {replyToPostID === post.id && (
                  <div className="reply-editor-container" style={{ position: 'relative', width: '100%' }}>
                    <h4>Replying to: {post.id}</h4>
                    <TextEditorReplies
                      ref={textEditorRef}
                      onSubmit={handleReplySubmit}
                      onClose={handleClose}
                    />
                  </div>
                )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
          {/*for each open post, render a repliespanel*/}
          {openRepliesPanels.map(panel => {
          const post = posts.find(p => p.id === panel.rootId);
          const postEl = postRefs.current[panel.rootId];
          const rect = postEl ? postEl.getBoundingClientRect() : { top: 0, left: 0, width: 400, height: 200 };
          return (
            <div
              key={panel.rootId}
              className="replies-panel-sidebar"
              style={{
                position: 'absolute',
                left: 'calc(70%)',
                top: `${rect.top-150}px`,
                height: `${rect.height}px`,
                boxSizing: 'border-box',
                zIndex: 901,
              }}
            >
              {/* render repliespanel and pass root post + ancestry to repliespanel */}
              <RepliesPanel
                rootPost={post}
                ancestry={panel.ancestry}
                onSelectPost={newAncestry => {
                  setOpenRepliesPanels(prev =>
                    prev.map(p =>
                      p.rootId === panel.rootId
                        ? { ...p, ancestry: newAncestry }
                        : p
                    )
                  );
                }}
              />
              <button onClick={() => handleCloseReplies(panel.rootId)}>Close</button>
            </div>
          );
        })}
      </div>
      <div className="pagination-controls">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Thread;