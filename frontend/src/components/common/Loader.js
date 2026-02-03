import React from "react";
import "./Loader.css";

const Loader = ({ fullPage = false, text = "Loading..." }) => {
  if (fullPage) {
    return (
      <div className="loader-container fullpage">
        <div className="loader-content">
          <div className="loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>
          <div className="loader-text">{text}</div>
          <div className="loader-subtext">Please wait a moment...</div>
          <div className="loader-progress">
            <div className="loader-progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className="loader-card">
        <div className="loader">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>
        <div className="loader-text">{text}</div>
      </div>
    </div>
  );
};

export default Loader;
