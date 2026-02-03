import React from 'react';
import '../styles/Settings.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="settings-container">
        
        {/* Header */}
        <div className="settings-header">
          <h1>Account</h1>
          <div className="member-since">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Member Since October 2023</span>
          </div>
        </div>

        <div className="settings-content">
          
          {/* SECTION 1: MEMBERSHIP & BILLING */}
          <div className="settings-section">
            <div className="section-label">
              <h3>Membership & Billing</h3>
              <button className="cancel-btn">Cancel Membership</button>
            </div>
            
            <div className="section-body">
              <div className="account-row">
                <span className="email-text">admin@sanflix.com</span>
                <a href="#" className="link-text">Change account email</a>
              </div>
              <div className="account-row">
                <span className="password-text">Password: ********</span>
                <a href="#" className="link-text">Change password</a>
              </div>
              <div className="account-row">
                <span className="phone-text">Phone: 0812-3456-7890</span>
                <a href="#" className="link-text">Change phone number</a>
              </div>
              
              <div className="divider-thin"></div>
              
              <div className="account-row billing-row">
                <div className="card-info">
                  <span className="card-icon">💳</span>
                  <span>•••• •••• •••• 4242</span>
                </div>
                <a href="#" className="link-text">Update payment info</a>
              </div>
              <div className="account-row">
                <span className="next-bill">Next billing date: March 1, 2026</span>
                <a href="#" className="link-text">Billing details</a>
              </div>
            </div>
          </div>

          <div className="divider-thick"></div>

          {/* SECTION 2: PLAN DETAILS */}
          <div className="settings-section">
            <div className="section-label">
              <h3>Plan Details</h3>
            </div>
            <div className="section-body plan-body">
              <div className="plan-name">
                <strong>Premium Ultra HD</strong>
                <span className="badge">4K HDR</span>
              </div>
              <a href="#" className="link-text">Change plan</a>
            </div>
          </div>

          <div className="divider-thick"></div>

          {/* SECTION 3: SETTINGS */}
          <div className="settings-section">
            <div className="section-label">
              <h3>Settings</h3>
            </div>
            <div className="section-body">
              <div className="account-row">
                <span>Parental controls</span>
                <a href="#" className="link-text">Manage</a>
              </div>
              <div className="account-row">
                <span>Test participation</span>
                <a href="#" className="link-text">Manage</a>
              </div>
              <div className="account-row">
                <span>Language</span>
                <a href="#" className="link-text">Change</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;