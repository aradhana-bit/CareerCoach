import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
export default function Login() {
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState('');
 const {login}=useAuth(); const navigate=useNavigate();
 async function submit(e){e.preventDefault();setError('');try{await login({email,password});navigate('/dashboard');}catch(x){setError(x.message);}}
 return <section className="panel narrow"><div className="eyebrow">WELCOME BACK</div><h1>Log in</h1><p className="muted">Continue building your career profile.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<p className="error">{error}</p>}<button className="button full">Log in</button></form><p className="muted">New here? <Link to="/register">Create an account</Link></p></section>;
}
