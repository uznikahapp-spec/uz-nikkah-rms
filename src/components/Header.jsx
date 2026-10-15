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
  profile
}) {
  return (
    <header className="app-header no-print">
      <div className="header-brand">
        <div className="header-logo-icon">
          <BookHeart size={30} />
        </div>
        <div className="header-title-box">
          <h1>نکاح رجسٹریشن پورٹل</h1>
          <p>
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
