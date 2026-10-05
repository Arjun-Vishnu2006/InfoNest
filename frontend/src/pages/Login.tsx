// @ts-nocheck
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Phone, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, demoLogin, loading } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError(""); setFieldErrors({});
    try { const { redirectTo } = await login({ email, phone, password }); nav(redirectTo || "/feed"); }
    catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) { const fe = {}; data.errors.forEach((x) => fe[x.field] = x.message); setFieldErrors(fe); setError(data.errors.map((x) => x.message).join(". ")); }
      else setError(data?.message || (err.message === "Network Error" ? "Cannot connect to server. Please verify the backend is running on port 5000." : err.message || "Login failed. Check your credentials."));
    }
  }

  return (
    <div className="authPage adorableAuth">
      <div className="authDecor authDecorOne">✦</div><div className="authDecor authDecorTwo">♡</div>
      <div className="authCard authCardCute">
        <div className="authBrand cuteBrand overflow-hidden"><img src="/infonest-logo.png" alt="InfoNest" className="w-full h-full object-cover rounded-2xl" /></div>
        <div className="authKicker">WELCOME BACK</div>
        <h1>Good to see you again 👋</h1>
        <p className="muted">Sign in and continue your learning journey.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" />{fieldErrors.email && <small className="fieldError">{fieldErrors.email}</small>}</label>
          <label>Phone number<div className="inputIconWrap"><Phone size={16}/><input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required placeholder="9876543210" /></div>{fieldErrors.phone && <small className="fieldError">{fieldErrors.phone}</small>}</label>
          <label>Password<div className="inputIconWrap"><LockKeyhole size={16}/><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Your password" /></div>{fieldErrors.password && <small className="fieldError">{fieldErrors.password}</small>}</label>
          <button className="btn primary full cuteBtn" disabled={loading}>{loading ? "Signing in…" : "Login to InfoNest →"}</button>
        </form>
        {import.meta.env.VITE_DEMO_MODE !== 'false' && <button type="button" onClick={() => { demoLogin(); nav('/feed'); }} className="btn full mt-3 border border-purple-400/30 text-purple-200">Continue with Demo Account</button>}
        <div className="authMiniNote">🔒 Email + phone number + password keeps your account tied to your verified phone.</div>
        <p className="center muted">New to InfoNest? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
