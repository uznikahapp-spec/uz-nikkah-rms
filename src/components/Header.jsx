import React from 'react';
import { 
  BookHeart, 
  Moon, 
  Sun, 
  PlusCircle, 
  Settings, 
  DatabaseBackup,
  UserCheck,
  LogOut,
  Shield,
  User
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  darkMode, 
  setDarkMode, 
  onOpenSettings,
  onOpenNewForm,
  profile,
  cloudSynced,
  currentUser,
  onLogout
}) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="app-header no-print">
      <div className="header-brand">
        <div className="header-logo-icon">
          <BookHeart size={30} />
        </div>
        <div className="header-title-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0 }}>نکاح رجسٹریشن پورٹل</h1>
            <span 
              className={`badge ${cloudSynced ? 'badge-green' : 'badge-gold'}`} 
              style={{ fontSize: '0.72rem', padding: '2px 8px' }}
              title={cloudSynced ? 'گوگل فائر بیس سے منسلک ہے' : 'لوکل موڈ پر فعال ہے'}
            >
              {cloudSynced ? 'کلاؤڈ آن لائن 🟢' : 'آف لائن لوکل 🟡'}
            </span>
          </div>
          <p style={{ marginTop: '2px' }}>
            {profile?.name ? profile.name : 'ڈیجیٹل نکاح مینجمنٹ سسٹم'} 
            {profile?.licenseNo && (
              <span style={{ marginRight: '8px', opacity: 0.85, fontSize: '0.8rem' }} className="font-num">
                (لائسنس: {profile.licenseNo})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* فعال صارف کا بیج */}
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card-subtle)', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <User size={15} color={isAdmin ? 'var(--gold-600)' : 'var(--primary-700)'} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: isAdmin ? 'var(--gold-700)' : 'var(--primary-700)', fontWeight: 600 }}>
                {isAdmin ? '👑 چیف رجسٹرار (Admin)' : '✍️ اسسٹنٹ کاتب (Staff)'}
              </div>
            </div>
          </div>
        )}

        {/* نیا اندراج بٹن */}
        <button 
          className="btn btn-gold" 
          onClick={onOpenNewForm}
          title="نیا نکاح رجسٹر کریں"
        >
          <PlusCircle size={18} />
          <span>نیا اندراج</span>
        </button>

        {/* ڈارک/لائٹ موڈ */}
        <button 
          className="btn-icon" 
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'لائٹ موڈ' : 'ڈارک موڈ'}
        >
          {darkMode ? <Sun size={19} color="#fbbf24" /> : <Moon size={19} color="#064e3b" />}
        </button>

        {/* ترتیبات و بیک اپ (صرف چیف ایڈمن کو نظر آئے گا) */}
        {isAdmin && (
          <button 
            className="btn-icon" 
            onClick={onOpenSettings}
            title="نکاح خواں ترتیبات، عملہ اور ڈیٹا بیک اپ"
          >
            <Settings size={19} />
          </button>
        )}

        {/* لاگ آؤٹ بٹن */}
        <button 
          className="btn-icon" 
          onClick={onLogout}
          title="پورٹل سے لاگ آؤٹ کریں"
          style={{ color: '#dc2626' }}
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}
