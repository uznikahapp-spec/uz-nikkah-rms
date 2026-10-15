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
  CheckCircle2,
  Users,
  PlusCircle,
  Trash2,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { storageService } from '../utils/storageService';
import { authService } from '../utils/authService';

export default function SettingsModal({ profile, onSaveProfile, onClose, recordsCount }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'users', 'cloud', 'backup'
  const [formData, setFormData] = useState({ ...profile });
  const [importStatus, setImportStatus] = useState('');
  
  // صارفین کا ڈیٹا
  const [usersList, setUsersList] = useState(() => authService.getUsers());
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('staff');
  const [userActionMsg, setUserActionMsg] = useState('');

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

  const handleCreateUser = (e) => {
    e.preventDefault();
    setUserActionMsg('');
    if (!newUserName || !newUserUsername || !newUserPassword) {
      setUserActionMsg('براہ کرم تمام ضروری خانے پر کریں۔');
      return;
    }

    const res = authService.addUser({
      name: newUserName,
      username: newUserUsername.trim(),
      password: newUserPassword,
      phone: newUserPhone,
      role: newUserRole
    });

    if (res.success) {
      setUsersList(authService.getUsers());
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserUsername('');
      setNewUserPassword('');
      setNewUserPhone('');
      setUserActionMsg('نیا صارف کامیابی سے شامل کر دیا گیا!');
    } else {
      setUserActionMsg(res.message);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('کیا آپ واقعی اس صارف کا لاگ ان ختم کرنا چاہتے ہیں؟')) {
      const res = authService.deleteUser(userId);
      if (res.success) {
        setUsersList(authService.getUsers());
      } else {
        alert(res.message);
      }
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
      <div className="modal-dialog" style={{ maxWidth: '850px' }}>
        <div className="card-header-styled" style={{ padding: '16px 24px', margin: 0, borderBottom: '2px solid var(--border-color)' }}>
          <div className="card-title-with-icon">
            <UserCheck size={24} color="var(--primary-700)" />
            <span>نکاح رجسٹرار پورٹل ترتیبات، عملہ و کلاؤڈ سنک</span>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* نیویگیشن ٹیبز بار برائے سیٹنگز */}
        <div style={{ display: 'flex', gap: '6px', padding: '12px 24px 0', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', flexWrap: 'wrap' }}>
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
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.86rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => setActiveTab('users')}
          >
            صارفین و عملہ (اختیارات)
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

        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
          
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

          {/* ۲. صارفین و عملہ ٹیب (Roles & Authorization) */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary-800)' }}>مجاز عملہ اور لاگ ان اکاؤنٹس</h4>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    ایڈمن کے پاس مکمل اختیارات ہیں، جبکہ سٹاف صرف اندراج اور پرنٹ کر سکتا ہے (ریکارڈ ڈیلیٹ نہیں کر سکتا)۔
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ padding: '6px 14px', fontSize: '0.86rem' }}
                  onClick={() => setShowAddUserModal(true)}
                >
                  <PlusCircle size={16} />
                  <span>نیا صارف شامل کریں</span>
                </button>
              </div>

              {userActionMsg && (
                <div style={{ background: 'var(--primary-50)', color: 'var(--primary-900)', padding: '8px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.86rem' }}>
                  {userActionMsg}
                </div>
              )}

              {/* صارفین کی لسٹ */}
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>نام</th>
                      <th>یوزر نیم</th>
                      <th>کردار (Role)</th>
                      <th>موبائل فون</th>
                      <th>پاسورڈ</th>
                      <th style={{ textAlign: 'center' }}>اقدامات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => {
                      const isAdmin = u.role === 'admin';
                      return (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.name}</strong>
                          </td>
                          <td className="font-num">{u.username}</td>
                          <td>
                            <span className={`badge ${isAdmin ? 'badge-gold' : 'badge-green'}`}>
                              {isAdmin ? '👑 چیف رجسٹرار (Admin)' : '✍️ اسسٹنٹ کاتب (Staff)'}
                            </span>
                          </td>
                          <td className="font-num">{u.phone || '-'}</td>
                          <td className="font-num" style={{ letterSpacing: '1px' }}>{u.password}</td>
                          <td style={{ textAlign: 'center' }}>
                            {!isAdmin ? (
                              <button 
                                className="btn-icon" 
                                title="صارف ڈیلیٹ کریں"
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                <Trash2 size={16} color="#dc2626" />
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>مین ایڈمن</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* نیا صارف شامل کرنے کا پینل */}
              {showAddUserModal && (
                <div style={{ marginTop: '20px', background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '10px', border: '1.5px solid var(--primary-400)' }}>
                  <h4 style={{ margin: '0 0 12px', color: 'var(--primary-900)' }}>نیا صارف / اسسٹنٹ اکاؤنٹ بنائیں</h4>
                  <form onSubmit={handleCreateUser}>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">پورا نام *</label>
                        <input type="text" className="form-control" placeholder="مولانا قاری علی احمد" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">یوزر نیم (لاگ ان کے لیے) *</label>
                        <input type="text" className="form-control" placeholder="aliahmad" value={newUserUsername} onChange={(e) => setNewUserUsername(e.target.value)} required />
                      </div>
                    </div>
                    <div className="form-grid-3" style={{ marginTop: '10px' }}>
                      <div className="form-group">
                        <label className="form-label">پاسورڈ *</label>
                        <input type="text" className="form-control font-num" placeholder="پاسورڈ درج کریں" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">موبائل فون</label>
                        <input type="text" className="form-control font-num" placeholder="0300-xxxxxxx" value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">کردار / اختیارات</label>
                        <select className="form-control" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                          <option value="staff">اسسٹنٹ کاتب (Staff - ڈیلیٹ ممنوع)</option>
                          <option value="admin">چیف ایڈمن (Admin - تمام اختیارات)</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>منسوخ</button>
                      <button type="submit" className="btn btn-primary">اکاؤنٹ بنائیں</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ۳. بیک اپ ٹیب */}
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

          {/* ۴. فائر بیس کلاؤڈ سنک ٹیب */}
          {activeTab === 'cloud' && (
            <div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Cloud size={22} color="var(--primary-700)" />
                  <strong style={{ fontSize: '1rem', color: 'var(--primary-900)' }}>گوگل فائر بیس (Google Firebase) مفت کلاؤڈ کنکشن</strong>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  آپ کا لائیو کلاؤڈ ڈیٹا بیس کامیابی کے ساتھ منسلک ہے۔ جب بھی کوئی نیا نکاح نامہ موبائل یا لیپ ٹاپ پر درج ہوگا، وہ خودکار طریقے سے انٹرنیٹ پر بیک اپ ہو جائے گا۔
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
