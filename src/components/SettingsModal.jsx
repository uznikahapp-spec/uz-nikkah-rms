import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Download, 
  Upload, 
  ShieldCheck, 
  HardDrive, 
  UserCheck, 
  Cloud,
  FileCheck2,
  Database,
  CheckCircle2
} from 'lucide-react';
import { storageService } from '../utils/storageService';

export default function SettingsModal({ profile, onSaveProfile, onClose, recordsCount }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'cloud', 'backup'
  const [formData, setFormData] = useState({ ...profile });
  const [importStatus, setImportStatus] = useState('');
  
  // فائر بیس کنفیگریشن
  const [firebaseConfigStr, setFirebaseConfigStr] = useState(() => {
    const saved = storageService.getFirebaseConfig();
    return saved ? JSON.stringify(saved, null, 2) : '';
  });
  const [firebaseStatus, setFirebaseStatus] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    alert('نکاح خواں پروفائل کامیابی کے ساتھ محفوظ ہو گیا!');
    onClose();
  };

  const handleExport = () => {
    storageService.exportBackup();
  };

  const handleSaveFirebase = () => {
    try {
      if (!firebaseConfigStr.trim()) {
        storageService.saveFirebaseConfig(null);
        setFirebaseStatus('فائر بیس کنکشن ہٹا دیا گیا، ایپ لوکل موڈ پر ہے۔');
        return;
      }
      const parsed = JSON.parse(firebaseConfigStr);
      storageService.saveFirebaseConfig(parsed);
      setFirebaseStatus('فائر بیس کنفیگریشن محفوظ ہو گئی! ریئل ٹائم کلاؤڈ سنک فعال ہے۔');
    } catch {
      setFirebaseStatus('غلط فارمیٹ! برائے مہربانی درست JSON کیز چسپاں کریں۔');
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const result = storageService.importBackup(json);
        if (result.success) {
          setImportStatus(`کامیابی: ${result.count} نکاح ریکارڈز بحال کر دیے گئے۔ پیج ریفریش کریں۔`);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setImportStatus('خرابی: ' + result.message);
        }
      } catch (err) {
        setImportStatus('فائل درست JSON فارمیٹ میں نہیں ہے۔');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '800px' }}>
        <div className="card-header-styled" style={{ padding: '16px 24px', margin: 0, borderBottom: '2px solid var(--border-color)' }}>
          <div className="card-title-with-icon">
            <UserCheck size={24} color="var(--primary-700)" />
            <span>نکاح رجسٹرار پورٹل ترتیبات و کلاؤڈ سنک</span>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* نیویگیشن ٹیبز بار برائے سیٹنگز */}
        <div style={{ display: 'flex', gap: '8px', padding: '12px 24px 0', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)' }}>
          <button 
            type="button" 
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.86rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => setActiveTab('profile')}
          >
            نکاح خواں پروفائل
          </button>
          <button 
            type="button" 
            className={`btn ${activeTab === 'backup' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.86rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => setActiveTab('backup')}
          >
            بیک اپ و ڈیٹا ایکسپورٹ
          </button>
          <button 
            type="button" 
            className={`btn ${activeTab === 'cloud' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.86rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => setActiveTab('cloud')}
          >
            گوگل فائر بیس کلاؤڈ سنک (مفت)
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          
          {/* ۱. نکاح خواں پروفائل ٹیب */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h4 style={{ color: 'var(--primary-800)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>
                سرکاری نکاح خواں / رجسٹرار کی معلومات
              </h4>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">نکاح خواں کا نام</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.name || ''} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ولدیت</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.fatherName || ''} 
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">سرکاری لائسنس / رجسٹریشن نمبر</label>
                  <input 
                    type="text" 
                    className="form-input font-num" 
                    value={formData.licenseNo || ''} 
                    onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">شناختی کارڈ نمبر</label>
                  <input 
                    type="text" 
                    className="form-input font-num" 
                    value={formData.cnic || ''} 
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">موبائل فون نمبر</label>
                  <input 
                    type="text" 
                    className="form-input font-num" 
                    value={formData.phone || ''} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">یونین کونسل / وارڈ</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.unionCouncil || ''} 
                    onChange={(e) => setFormData({ ...formData, unionCouncil: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">ضلع و تحصیل</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.district || ''} 
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">دفتر کا پتہ / مسجد</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.officeAddress || ''} 
                    onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">طے شدہ ڈیفالٹ فیس (روپے)</label>
                  <input 
                    type="number" 
                    className="form-input font-num" 
                    value={formData.feeDefault || '5000'} 
                    onChange={(e) => setFormData({ ...formData, feeDefault: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  منسوخ کریں
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 24px' }}>
                  <Save size={18} />
                  <span>پروفائل محفوظ کریں</span>
                </button>
              </div>
            </form>
          )}

          {/* ۲. بیک اپ ٹیب */}
          {activeTab === 'backup' && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, rgba(6,78,59,0.06) 0%, rgba(217,119,6,0.06) 100%)', border: '1.5px solid var(--border-color)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <HardDrive size={22} />
                  <span>مکمل ڈیٹا اور دستاویزات والٹ بیک اپ</span>
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  آپ کا تمام ریکارڈ (کل {recordsCount} نکاح نامے اور فولڈرز) لوکل ڈیوائس پر محفوظ ہے۔ آپ سنگل کلک پر مکمل ڈیٹا، شناختی کارڈز اور کالمز کا آف لائن بیک اپ حاصل کر سکتے ہیں۔
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  <button type="button" className="btn btn-primary" onClick={handleExport}>
                    <Download size={18} />
                    <span>مکمل ڈیٹا بیک اپ ڈاؤن لوڈ کریں (JSON)</span>
                  </button>

                  <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={18} />
                    <span>بیک اپ فائل اپلوڈ کریں</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      style={{ display: 'none' }} 
                      onChange={handleImportFile}
                    />
                  </label>
                </div>

                {importStatus && (
                  <div style={{ marginTop: '12px', fontSize: '0.88rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                    {importStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ۳. فائر بیس کلاؤڈ سنک ٹیب */}
          {activeTab === 'cloud' && (
            <div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Cloud size={22} color="var(--primary-700)" />
                  <strong style={{ fontSize: '1rem', color: 'var(--primary-900)' }}>گوگل فائر بیس (Google Firebase) مفت کلاؤڈ کنکشن</strong>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  اگر آپ چاہتے ہیں کہ آپ کے موبائل اور کمپیوٹر کا ڈیٹا خودکار طریقے سے انٹرنیٹ پر محفوظ رہے اور دنیا میں کسی بھی موبائل پر بیک وقت کھلے، تو آپ [console.firebase.google.com](https://console.firebase.google.com) پر مفت اکاؤنٹ بنا کر اپنے پروجیکٹ کی کیز (Firebase Config JSON) یہاں چسپاں کر سکتے ہیں۔
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Firebase Config کیز (JSON فارمیٹ میں)</label>
                <textarea 
                  className="form-control font-num" 
                  rows={6}
                  placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "nikkah-app.firebaseapp.com",\n  "projectId": "nikkah-app",\n  "storageBucket": "nikkah-app.appspot.com",\n  "appId": "1:..."\n}`}
                  value={firebaseConfigStr}
                  onChange={(e) => setFirebaseConfigStr(e.target.value)}
                  style={{ direction: 'ltr', textAlign: 'left', fontSize: '0.85rem' }}
                />
              </div>

              {firebaseStatus && (
                <div style={{ marginTop: '8px', fontSize: '0.88rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                  {firebaseStatus}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-primary" onClick={handleSaveFirebase}>
                  <CheckCircle2 size={16} />
                  <span>کلاؤڈ سیٹنگز محفوظ کریں</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
