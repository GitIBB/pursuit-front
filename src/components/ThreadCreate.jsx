import React, { useEffect, useState, useRef } from 'react';
import CommentEditor from '../utils/commentEditor';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { apiRequest, isLoggedIn } from '../utils/auth';
import '../styles/ThreadCreate.css';


const ThreadCreate = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { forumID } = useParams();

    const textEditorRef = useRef(null);
    const [editorContent, setEditorContent] = useState({
    originalPost: '',
    });

    const [loggedIn, setLoggedIn] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
    isLoggedIn().then(result => {
      setLoggedIn(result);
      setAuthChecked(true);
        });
    }, []);


    if (!authChecked) return null;

    if (!loggedIn) return <Navigate to="/login" replace />;


    const handleContentChange = () => {
        if (textEditorRef.current) {
            const updatedContent = textEditorRef.current.getContent();
            setEditorContent(updatedContent);
        }
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      if (!title.trim()) throw new Error('Title is required');
      if (!editorContent) throw new Error('Content is required');

      // 1. Create the thread
      const threadRes = await apiRequest(`/api/forums/${forumID}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          forum_id: forumID,
        }),
      });

      if (!threadRes.ok) throw new Error('Failed to create thread');
      const threadData = await threadRes.json();
      const threadID = threadData.thread.id;

      // 2. create the original post comment
      const commentRes = await apiRequest(`/api/threads/${threadID}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editorContent, // this should be different - fix 
          is_op: true,
        }),
      });

      if (!commentRes.ok) throw new Error('Failed to create original post');
      setSuccess(true);
      navigate(`/forums/${forumID}/threads/${threadID}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="thread-create-container">
        <form onSubmit={handleSubmit} className="thread-create-form">
        <input
            type="text"
            placeholder="Thread Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
        />
        <div className="thread-post-editor">
            <CommentEditor ref={textEditorRef} onContentChange={handleContentChange} />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Create Thread</button>
        </form>
    </div>
  );
};

export default ThreadCreate;