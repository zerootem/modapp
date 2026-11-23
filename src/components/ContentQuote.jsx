import React from 'react';

function ContentQuote({ children, variant = 'editorial', citation, className = '' }) {
  return (
    <figure className={`mw-quote mw-quote--${variant}${className ? ` ${className}` : ''}`}>
      <blockquote>
        <p dir="auto">{children}</p>
      </blockquote>
      {citation && <figcaption dir="auto">{citation}</figcaption>}
    </figure>
  );
}

export default ContentQuote;
