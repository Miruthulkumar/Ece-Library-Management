import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">📚</div>
              <div className="footer-logo-text">
                <h3>MKCE ECE Library</h3>
              </div>
            </div>
            <p className="footer-description">
              Modern library management for Electronics and Communication Engineering.
            </p>
            <div className="footer-badge">
              🎓 Academic Excellence
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/books">Browse Books</Link></li>
              <li><Link to="/my-books">My Books</Link></li>
              <li><Link to="/reservations">Reservations</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-text">library@ece.edu</span>
              </div>
              <div className="footer-contact-item">
                <span className="contact-icon">🕐</span>
                <span className="contact-text">Mon-Fri: 9 AM - 5 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} <strong>MKCE ECE</strong>. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/help">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
