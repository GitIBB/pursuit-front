import { Link } from 'react-router-dom';
import '../styles/MiniPreview.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:8080";

const MiniPreview = ({ article }) => {
  const title = article.Title;
  const author = article.Username;
  const createdAt = article.CreatedAt;

    let image = article.Body?.images?.titleImage;
    if (!image && article.ImageUrl?.String) {
      image = article.ImageUrl.String;
    }

  let formattedDate = '';
  if (createdAt) {
    formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  console.log('MiniPreview article:', article); // Debugging: Log the article data

  return (
    <Link to={`/article/${article.ID || article.id}`} className="mini-preview-link">
      <div className="mini-preview">
        {image && (
          <img
            src={image.startsWith('http') ? image : `${BACKEND_URL}${image}`}
            alt={title}
            className="mini-preview-image"
          />
        )}
        <div className="mini-preview-info">
          <div className="mini-preview-title">{title}</div>
          <div className="mini-preview-meta">
            <span className="mini-preview-author"> Author: {author}</span>
            {formattedDate && <span className="mini-preview-date">{formattedDate}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MiniPreview;