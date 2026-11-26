import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './state/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Resume from './pages/Resume.jsx';
import Interview from './pages/Interview.jsx';
import History from './pages/History.jsx';
import Admin from './pages/Admin.jsx';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <><header className="topbar"><Link className="brand" to="/"><span className="brand-mark">C</span>CareerCoach</Link><nav>{user ? <><Link to="/dashboard">Dashboard</Link><Link to="/profile">Profile</Link><Link to="/resume">Resume</Link><Link to="/interview">Interview</Link><Link to="/history">History</Link>{user.role === 'admin' && <Link to="/admin">Admin</Link>}<button className="small secondary" onClick={() => { logout(); navigate('/'); }}>Log out</button></> : <><Link to="/login">Log in</Link><Link className="nav-cta" to="/register">Get started <span aria-hidden="true">↗</span></Link></>}</nav></header><main className="site-main">{children}</main><footer>CareerCoach <span>·</span> Build your next opportunity</footer></>;
}

function Home() {
  return <div className="landing">
    <section className="landing-hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot"></span> YOUR NEXT CHAPTER STARTS HERE</div>
        <h1>Your ambition deserves a <span>better game plan.</span></h1>
        <p className="hero-description">One focused workspace to shape your story, build a stronger resume and prepare for the opportunities ahead.</p>
        <div className="actions hero-actions"><Link className="button hero-primary" to="/register">Build your career plan <span aria-hidden="true">→</span></Link><Link className="button hero-secondary" to="/login">I have an account</Link></div>
        <div className="hero-note"><span className="note-check">✓</span> Your profile. Your resume. Your next move.</div>
      </div>
      <div className="hero-visual" aria-label="CareerCoach workspace preview">
        <div className="visual-glow"></div>
        <div className="preview-window">
          <div className="preview-top"><div className="window-dots"><i></i><i></i><i></i></div><span>YOUR CAREER WORKSPACE</span><span className="preview-status">● READY</span></div>
          <div className="preview-body">
            <div className="preview-greeting"><div><span className="preview-kicker">YOUR WORKSPACE</span><h3>Make your next move.</h3><p>A little progress adds up.</p></div><div className="preview-avatar">Y</div></div>
            <div className="preview-progress"><div className="progress-heading"><span>Career profile</span><strong>YOUR STARTING POINT</strong></div><div className="progress-track"><span></span></div><small>Add your experience, skills and goals to get started.</small></div>
            <div className="preview-tools"><div className="preview-tool"><span className="tool-icon resume-icon">↗</span><div><strong>Resume Studio</strong><small>Shape your experience</small></div><b>→</b></div><div className="preview-tool"><span className="tool-icon interview-icon">◎</span><div><strong>Interview Prep</strong><small>Practise with purpose</small></div><b>→</b></div></div>
            <div className="preview-bottom"><span>SMALL STEPS. BIGGER POSSIBILITIES.</span><span>CAREERCOACH</span></div>
          </div>
        </div>
        <div className="floating-note"><span>✦</span><div><strong>Start with your story</strong><small>Your next opportunity begins here.</small></div></div>
      </div>
    </section>
    <section className="landing-trust"><span>LESS GUESSWORK</span><i></i><span>MORE DIRECTION</span><i></i><span>BETTER PREPARATION</span></section>
    <section className="landing-section">
      <div className="section-heading"><div><div className="eyebrow">A WORKSPACE THAT WORKS FOR YOU</div><h2>Everything you need to move <span>forward.</span></h2></div><p>Keep the important parts of your career journey organised, clear and ready when opportunity knocks.</p></div>
      <div className="landing-features">
        <article className="landing-feature"><div className="feature-top"><span className="feature-number">01</span><span className="feature-symbol">◈</span></div><h3>Know your story</h3><p>Bring your education, skills, experience and projects together in one organised profile.</p><Link to="/register">Create your profile <span>→</span></Link></article>
        <article className="landing-feature featured-card"><div className="feature-top"><span className="feature-number">02</span><span className="feature-symbol">▤</span></div><h3>Build your resume</h3><p>Turn the details of your journey into clear, professional resume content you can refine.</p><Link to="/register">Explore resume tools <span>→</span></Link></article>
        <article className="landing-feature"><div className="feature-top"><span className="feature-number">03</span><span className="feature-symbol">◎</span></div><h3>Walk in prepared</h3><p>Generate role-specific interview questions and practise thinking through your answers.</p><Link to="/register">Prepare for interviews <span>→</span></Link></article>
      </div>
    </section>
    <section className="landing-bottom-cta"><div><div className="eyebrow">YOUR JOURNEY, YOUR PACE</div><h2>Ready to make your next move?</h2><p>Start building a career workspace that grows with you.</p></div><Link className="button hero-primary" to="/register">Get started for free <span aria-hidden="true">→</span></Link></section>
  </div>;
}

export default function App() {
 return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/><Route path="/resume" element={<ProtectedRoute><Resume/></ProtectedRoute>}/><Route path="/interview" element={<ProtectedRoute><Interview/></ProtectedRoute>}/><Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Layout>;
}
