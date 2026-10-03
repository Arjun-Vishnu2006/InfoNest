// @ts-nocheck
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, LockKeyhole, Phone, Sparkles, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "Learner" });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { requestRegisterOtp, register, loading } = useAuth();
  const nav = useNavigate();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function showErrors(err) {
    const data = err.response?.data;
    if (data?.errors?.length) {
      const fe = {};
      data.errors.forEach((x) => { fe[x.field] = fe[x.field] ? `${fe[x.field]}, ${x.message}` : x.message; });
      setFieldErrors(fe);
      setError(data.errors.map((x) => x.message).join(". "));
    } else {
      setError(data?.message || (err.message === "Network Error" ? "Cannot connect to server. Please verify the backend is running on port 5000." : err.message || "Registration failed."));
    }
  }

  async function sendOtp(e) {
    e.preventDefault();
    setError(""); setFieldErrors({});
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    try {
      const r = await requestRegisterOtp({ email: form.email, phone: form.phone });
      setStep(2);
    } catch (err) { showErrors(err); }
  }

  async function verifyAndRegister(e) {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) { setError("Enter the 6-digit OTP."); return; }
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role, otp });
      nav(form.role === "ContentCreator" ? "/creator/dashboard" : "/feed");
    } catch (err) { showErrors(err); }
  }

  async function resend() {
    setError("");
    try {
      const r = await requestRegisterOtp({ email: form.email, phone: form.phone });
      setOtp("");
    } catch (err) { showErrors(err); }
  }

  return (
    <div className="authPage adorableAuth">
      <div className="authDecor authDecorOne">✦</div><div className="authDecor authDecorTwo">♡</div>
      <div className="authCard authCardCute">
        <div className="authBrand cuteBrand overflow-hidden"><img src="/infonest-logo.png" alt="InfoNest" className="w-full h-full object-cover rounded-2xl" /></div>
        {step === 1 ? (
          <>
            <div className="authKicker">JOIN THE NEST</div>
            <h1>Create your account ✨</h1>
            <p className="muted">Learn, share and grow with the InfoNest community.</p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={sendOtp}>
              <label>Name<input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Your name" />{fieldErrors.name && <small className="fieldError">{fieldErrors.name}</small>}</label>
              <label>Email<input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required placeholder="you@example.com" />{fieldErrors.email && <small className="fieldError">{fieldErrors.email}</small>}</label>
              <label>Phone number<div className="inputIconWrap"><Phone size={16}/><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="9876543210" /></div>{fieldErrors.phone && <small className="fieldError">{fieldErrors.phone}</small>}</label>
              <div className="formGrid2"><label>Password<input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={8} placeholder="8+ chars, 1 number" /></label><label>Confirm<input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} required placeholder="Repeat password" /></label></div>
              <label>Account type<select value={form.role} onChange={(e) => set("role", e.target.value)}><option>Learner</option><option>ContentCreator</option></select></label>
              <div className="emailOtpNotice"><Mail size={17}/><span><b>Email verification</b> — a 6-digit OTP will be sent to your registered email. The code expires after 5 minutes.</span></div>
              <button className="btn primary full cuteBtn" disabled={loading}>{loading ? "Sending OTP…" : "Send OTP to email →"}</button>
            </form>
          </>
        ) : (
          <>
            <button className="backLink" onClick={() => { setStep(1); setError(""); }}><ArrowLeft size={15}/> Edit details</button>
            <div className="otpIcon"><LockKeyhole size={25}/></div>
            <div className="authKicker">EMAIL VERIFICATION</div>
            <h1>One tiny step 🔐</h1>
            <p className="muted">Enter the 6-digit code sent to <b>{form.email}</b>.</p>
            <div className="authMiniNote"><Mail size={16}/> Check your inbox and spam/junk folder for the InfoNest verification email.</div>
            {error && <div className="error">{error}</div>}
            <form onSubmit={verifyAndRegister}>
              <label>6-digit OTP<input className="otpInput" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required placeholder="000000" /></label>
              <button className="btn primary full cuteBtn" disabled={loading}>{loading ? "Verifying…" : "Verify & create account ✓"}</button>
            </form>
            <button className="resendBtn" onClick={resend} disabled={loading}>↻ Resend OTP</button>
            <div className="verifiedHint"><CheckCircle2 size={16}/> OTP expires after 5 minutes.</div>
          </>
        )}
        <p className="center muted">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
