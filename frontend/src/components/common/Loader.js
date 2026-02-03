import React from "react";
import "./Loader.css";

const Loader = ({ fullPage = false, text = "Loading..." }) => {
  if (fullPage) {
    return (
      <div className="loader-container fullpage">
        {/* Animated Background Particles */}
        <div className="loader-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
        
        <div className="loader-content">
          {/* Book Loader with Pages */}
          <div className="loader-book-wrapper">
            <div className="loader-book">
              <div className="book-spine"></div>
              <div className="book-page page-1"></div>
              <div className="book-page page-2"></div>
              <div className="book-page page-3"></div>
            </div>
            <div className="book-shadow"></div>
          </div>
          
          {/* Orbiting Rings */}
          <div className="loader-orbit-system">
            <div className="orbit-ring ring-1"></div>
            <div className="orbit-ring ring-2"></div>
            <div className="orbit-ring ring-3"></div>
            <div className="orbit-center"></div>
          </div>
          
          <div className="loader-text-wrapper">
            <div className="loader-text">{text}</div>
            <div className="loader-subtext">Please wait a moment...</div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="loader-progress">
            <div className="loader-progress-bar"></div>
            <div className="progress-glow"></div>
          </div>
          
          {/* Pulsing Dots */}
          <div className="loader-dots">
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className="loader-card">
        {/* Spinning Gradient Loader */}
        <div className="loader-spinner-wrapper">
          <div className="loader-spinner">
            <div className="spinner-ring ring-outer"></div>
            <div className="spinner-ring ring-middle"></div>
            <div className="spinner-ring ring-inner"></div>
            <div className="spinner-core"></div>
          </div>
        </div>
        <div className="loader-text">{text}</div>
      </div>
    </div>
  );
};

export default Loader;
