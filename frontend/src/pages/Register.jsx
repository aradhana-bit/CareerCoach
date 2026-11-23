import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
export default function Register() {
 const [name,setName]=useState('');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');
 const {register}=useAuth();const navigate=useNavigate();
 async function submit(e){e.preventDefault();setError('');try{await register({name,email,password});navigate('/dashboard');}catch(x){setError(x.message);}}
 return <section className="panel narrow"><div className="eyebrow">START HERE</div><h1>Create account</h1><form onSubmit={submit}><label>Full name<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password (at least 8 characters)<input type="password" minLength="8" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<p className="error">{error}</p>}<button className="button full">Create account</button></form><p className="muted">Already registered? <Link to="/login">Log in</Link></p></section>;
}
