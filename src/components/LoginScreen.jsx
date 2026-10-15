import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Sparkles, 
  ArrowLeft,
  CheckCircle2,
  BookHeart
} from 'lucide-react';
import { authService } from '../utils/authService';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin786');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const result = authService.login(username, password, rememberMe);
      setLoading(false);

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.message);
      }
    }, 400);
  };

  // کوئک لاگ ان شارٹ کٹ بٹن
  const fillCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, rgba(6,78,59,0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(245,158,11,0.12), transparent 60%), var(--bg-main)',
      padding: '20px'
    }}>
      <div 
        className="card" 
        style={{ 
          maxWidth: '460px', 
          width: '100%', 
          padding: '36px 30px', 
          border: '1.5px solid var(--border-color)', 
          boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
          borderRadius: '18px',
          background: 'var(--bg-card)'
        }}
      >
        {/* اسلامی لوگو اور ہیڈر */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 4px 15px rgba(6,78,59,0.35)',
              border: '2px solid #fbbf24'
            }}
          >
            <BookHeart size={34} />
          </div>

          <div style={{ fontFamily: 'var(--font-nastaliq)', fontSize: '1.4rem', color: 'var(--primary-800)', marginBottom: '4px' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <h2 style={{ fontSize: '1.65rem', margin: '0 0 6px', color: 'var(--primary-900)', fontWeight: 800 }}>
            نکاح رجسٹریشن پورٹل
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            محفوظ داخلے کے لیے اپنے کوائف درج فرمائیں
          </p>
        </div>

        {/* ایرر الرٹ اگر غلط پاسورڈ ہو */}
        {errorMessage && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #f87171',
            color: '#991b1b',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '18px',
            fontSize: '0.86rem',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        {/* فارم */}
        <form onSubmit={handleSubmit}>
          {/* یوزر نیم */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              <User size={16} color="var(--primary-700)" />
              <span>یوزر نیم یا موبائل نمبر</span>
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="مثال: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{ padding: '10px 14px', fontSize: '0.95rem' }}
            />
          </div>

          {/* پاسورڈ */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              <Lock size={16} color="var(--primary-700)" />
              <span>پاسورڈ</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-control font-num" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '10px 40px 10px 14px', fontSize: '0.95rem', letterSpacing: showPassword ? 'normal' : '2px' }}
              />
              <button 
                type="button" 
                className="btn-icon" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', left: '8px', top: '7px', background: 'transparent' }}
                title={showPassword ? 'چھپائیں' : 'دیکھیں'}
              >
                {showPassword ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          {/* یاد رکھیں چیک باکس */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              <span>اس ڈیوائس پر لاگ ان رکھیں</span>
            </label>
          </div>

          {/* لاگ ان بٹن */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '1.05rem', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? 'تصدیق ہو رہی ہے...' : 'محفوظ لاگ ان کریں'}
          </button>
        </form>

        {/* کوئک ڈیمو اکاؤنٹس ہیلپر */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            آسانی کے لیے پہلے سے بنے ہوئے اکاؤنٹس:
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              onClick={() => fillCredentials('admin', 'admin786')}
            >
              👑 چیف رجسٹرار (admin)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              onClick={() => fillCredentials('assistant', 'staff123')}
            >
              ✍️ اسسٹنٹ کاتب (assistant)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
