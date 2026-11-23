import React from 'react';

const LATIN_RUN = /([A-Za-z][A-Za-z0-9+#./_-]*[.,:;!?]?)/g;

function BidiText({ text }) {
  if (typeof text !== 'string') return text ?? null;

  return text.split(LATIN_RUN).map((part, index) => (
    /^[A-Za-z]/.test(part)
      ? <bdi key={`latin-${index}`} dir="ltr">{part}</bdi>
      : part
  ));
}

export default BidiText;
