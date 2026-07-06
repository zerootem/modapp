import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="footer-flex">
        <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
          <span style={{fontSize:'12px'}}>&copy; 2026 جميع الحقوق محفوظة.</span>
          <span style={{fontSize:'12px'}}>صنع بـحب مود ويب!</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
