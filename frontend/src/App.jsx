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
  return <><header className="topbar"><Link className="brand" to="/">CareerCoach</Link><nav>{user ? <><Link to="/dashboard">Dashboard</Link><Link to="/profile">Profile</Link><Link to="/resume">Resume</Link><Link to="/interview">Interview</Link><Link to="/history">History</Link>{user.role === 'admin' && <Link to="/admin">Admin</Link>}<button className="small secondary" onClick={() => { logout(); navigate('/'); }}>Log out</button></> : <><Link to="/login">Login</Link><Link className="nav-cta" to="/register">Get started</Link></>}</nav></header><main>{children}</main><footer>CareerCoach · Build your next opportunity</footer></>;
}
function Home() { return <section className="hero"><div className="eyebrow">YOUR CAREER, WITH A PLAN</div><h1>Prepare smarter.<br/><span>Present your best.</span></h1><p>Build a stronger resume and practise role-specific interview questions with your personal career workspace.</p><div className="actions"><Link className="button" to="/register">Create your account</Link><Link className="button secondary" to="/login">I already have an account</Link></div><div className="feature-grid"><article><b>01 / PROFILE</b><h3>Your experience, organised</h3><p>Keep education, skills and projects in one place.</p></article><article><b>02 / RESUME</b><h3>Resume-ready wording</h3><p>Turn your profile into a clear professional summary.</p></article><article><b>03 / INTERVIEW</b><h3>Practise with purpose</h3><p>Prepare questions for the role you want.</p></article></div></section>; }
export default function App() {
 return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/><Route path="/resume" element={<ProtectedRoute><Resume/></ProtectedRoute>}/><Route path="/interview" element={<ProtectedRoute><Interview/></ProtectedRoute>}/><Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Layout>;
}
