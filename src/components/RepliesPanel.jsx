import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/auth';
import '../styles/RepliesPanel.css';


function getPlainText(content) {
  try {
    const obj = typeof content === 'string' ? JSON.parse(content) : content;
    const paragraphs = obj.root?.children || [];
    return paragraphs
      .map(p => (p.children ? p.children.map(c => c.text).join(' ') : ''))
      .join('\n');
  } catch {
    return '[Invalid content]';
  }
}

const RepliesPanel = ({ ancestry, onSelectPost }) => {
  if (!ancestry || ancestry.length === 0) {
  return <div className="replies-panel">Post has no replies.</div>;
  }

  const currentPost = ancestry[ancestry.length - 1];
  const [children, setChildren] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    if (!currentPost || !currentPost.id) return;
    const fetchChildren = async () => {
      const res = await apiRequest(`/api/posts/${currentPost.id}/children`);
      if (res.ok) {
        const data = await res.json();
        setChildren(data.posts.map(item => item.post ?? item));
        setTotalPages(data.totalPages);
      }
    };
    fetchChildren();
  }, [currentPost?.id, page]);
  
  const handleTabSelect = (tabIndex) => {
    const newAncestry = ancestry.slice(0, tabIndex + 1);
    if (onSelectPost) onSelectPost(newAncestry);
  };
  const handleChildSelect = (childPost) => {
    const newAncestry = [...ancestry, childPost];
    if (onSelectPost) onSelectPost(newAncestry);
  };

  return (
    <div className="replies-panel">
        <div className="replies-tabs">
            {ancestry.map((c, idx) => (
                <button
                    key={c.id}
                    className={idx === ancestry.length - 1 ? "active" : ""}
                    onClick={() => handleTabSelect(idx)}
                >
                    {idx}
                </button>
            ))}
        </div>
        <div className="replies-list">
            {children.map(child => (
                <div key={child.id}>
                    {/* Render child summary */}
                    <button onClick={() => handleChildSelect(child)}>
                      {getPlainText(child.content)}
                    </button>
                </div>
            ))}
        </div>
        <div className="replies-pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button
              disabled={totalPages <= 1 || page >= totalPages || children.length === 0}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
        </div>
    </div>
  );
};

export default RepliesPanel;