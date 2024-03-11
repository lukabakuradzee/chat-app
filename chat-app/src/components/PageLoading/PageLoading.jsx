import React from 'react';
import { RingLoader } from 'react-spinners';

function PageLoading() {
    
  return (
    <div className="overlay">
      <div className="app-logo-box">
        <i className="fa-brands fa-microblog app-logo-overlay"></i>
      </div>
      <div className="bar-loader" style={{}}>
        <RingLoader color="#fe3c72" loading={true} />
      </div>
      <footer>
        <h3 className="company-name">From</h3>
        <p>
          <span>
            <i class="fa-brands fa-joomla"></i>
          </span>
          Meta
        </p>
      </footer>
    </div>
  );
}

export default PageLoading;
