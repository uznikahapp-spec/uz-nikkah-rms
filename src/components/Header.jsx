import React from 'react';
import { 
  BookHeart, 
  Moon, 
  Sun, 
  PlusCircle, 
  Settings, 
  DatabaseBackup,
  UserCheck
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  darkMode, 
  setDarkMode, 
  onOpenSettings,
  onOpenNewForm,
  profile,
  cloudSynced
}) {
  return (
    <header className="app-header no-print">
      <div className="header-brand">
        <div className="header-logo-icon">
          <BookHeart size={30} />
        </div>
        <div className="header-title-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

      <div className="header-actions">
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

        {/* ترتیبات و بیک اپ */}
        <button 
          className="btn-icon" 
          onClick={onOpenSettings}
          title="نکاح خواں ترتیبات اور ڈیٹا بیک اپ"
        >
          <Settings size={19} />
        </button>
      </div>
    </header>
  );
}
