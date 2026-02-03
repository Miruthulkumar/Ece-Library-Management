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
                <p>Management System</p>
              </div>
            </div>
            <p className="footer-description">
              A modern digital library management solution for the Electronics and 
              Communication Engineering department, empowering students and faculty 
              with seamless access to knowledge.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
                📘
              </a>
              <a href="https://twitter.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
                🐦
              </a>
              <a href="https://instagram.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
                📷
              </a>
              <a href="https://linkedin.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
                💼
              </a>
            </div>
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
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><a href="/books?category=ece">ECE Core Subjects</a></li>
              <li><a href="/books?category=jlpt">JLPT Preparation</a></li>
              <li><a href="/books?category=digital">Digital Resources</a></li>
              <li><a href="/books?category=reference">Reference Books</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <div className="footer-contact-icon">📧</div>
                <div className="footer-contact-info">
                  <div className="footer-contact-label">Email</div>
                  <div className="footer-contact-value">library@ece.edu</div>
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">📞</div>
                <div className="footer-contact-info">
                  <div className="footer-contact-label">Phone</div>
                  <div className="footer-contact-value">+91 123 456 7890</div>
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">🕐</div>
                <div className="footer-contact-info">
                  <div className="footer-contact-label">Hours</div>
                  <div className="footer-contact-value">Mon-Fri: 9 AM - 5 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} <strong>MKCE ECE Department</strong>. All rights reserved.
            Built with ❤️ for academic excellence.
          </div>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/help">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
