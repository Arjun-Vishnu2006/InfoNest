import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Logout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [working, setWorking] = useState(false);
  const [done, setDone] = useState(false);

  const handleLogout = async () => {
    setWorking(true);
    await logout();
    setDone(true);
    setWorking(false);
  };

  useEffect(() => {
    if (!user) setDone(true);
  }, [user]);

  return (
    <div className="authPage adorableAuth">
      <div className="authDecor authDecorOne">✦</div>
      <div className="authDecor authDecorTwo">♡</div>
      <div className="authCard authCardCute text-center">
        <div className="authBrand cuteBrand overflow-hidden mx-auto">
          <img src="/infonest-logo.png" alt="InfoNest" className="w-full h-full object-cover rounded-2xl" />
        </div>
        <div className="authKicker">COSMOS SESSION</div>
        {done ? (
          <>
            <div className="otpIcon mx-auto"><CheckCircle2 size={28} /></div>
            <h1>You’re logged out 👋</h1>
            <p className="muted">Your InfoNest session has been safely ended.</p>
            <button className="btn primary full cuteBtn" onClick={() => navigate('/login')}>
              Login again →
            </button>
            <p className="center muted">New to InfoNest? <Link to="/register">Create an account</Link></p>
          </>
        ) : (
          <>
            <div className="otpIcon mx-auto"><LogOut size={28} /></div>
            <h1>Log out of InfoNest?</h1>
            <p className="muted">You can come back anytime and continue your learning journey.</p>
            <button className="btn primary full cuteBtn" onClick={handleLogout} disabled={working}>
              {working ? 'Logging out…' : 'Log out securely'}
            </button>
            <Link className="btn full" to="/feed">Stay logged in</Link>
          </>
        )}
        <div className="authMiniNote"><Sparkles size={16} /> Learn Together. Share Freely. Grow Further.</div>
      </div>
    </div>
  );
}
