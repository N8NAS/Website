import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">SANFLIX</h1>
        <p className="login-desc">Sign in to continue watching</p>

        <button className="google-login">
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <div className="forgot">
          <a href="#">Forgot password?</a>
        </div>

        <button className="signin-btn">Sign In</button>

        <p className="signup-text">
          Don&apos;t have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
}