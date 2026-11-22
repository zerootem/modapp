import React from 'react';
import { Link } from 'react-router-dom';

function ToolCard({ to, href, title, description, tags = [] }) {
  const Card = href ? 'a' : Link;
  const destination = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { to };

  return (
    <Card {...destination} className="tool-card" aria-label={title}>
      <div className="tool-card-content">
        <div className="tool-card-head">
          <h3 className="tool-card-title">{title}</h3>
          <div className="tool-card-tags" aria-label={`تصنيفات ${title}`}>
            {tags.map((tag) => (
              <span className="tool-card-tag" dir="auto" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="tool-card-desc">{description}</p>
      </div>
    </Card>
  );
}

export default ToolCard;
