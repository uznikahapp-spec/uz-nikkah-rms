import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Edit3, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Clock, 
  Download,
  FolderArchive,
  CheckCircle,
  Clock3,
  Phone,
  User,
  ExternalLink,
  Coins,
  Send,
  Building
} from 'lucide-react';
import { formatPKDate, getHijriDate } from '../utils/dateUtils';
import { storageService } from '../utils/storageService';

export default function RecordDetailsModal({ record, onClose, onEdit, onPrint, onRecordUpdated }) {
  if (!record) return null;

  const [activeImagePreview, setActiveImagePreview] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryName, setDeliveryName] = useState(record.groom?.name || '');
  const [deliveryPhone, setDeliveryPhone] = useState(record.groom?.phone || '');
  const [deliveryNotes, setDeliveryNotes] = useState('نکاح نامہ حوالے کر دیا گیا ہے۔');

  const agreedNum = parseInt(record.fee?.agreedAmount || '0', 10);
  const receivedNum = parseInt(record.fee?.receivedAmount || '0', 10);
  const isNumericAgreed = !isNaN(agreedNum) && agreedNum > 0;
  const remaining = isNumericAgreed ? Math.max(0, agreedNum - (isNaN(receivedNum) ? 0 : receivedNum)) : 0;

  // محفوظ طریقے سے رقم یا اردو ٹیکسٹ فارمیٹ کرنے کا فنکشن
  const formatMoneyOrText = (val) => {
    if (val === undefined || val === null || val === '') return '-';
    const str = String(val).trim();
    if (/^\d+$/.test(str)) {
      return `${Number(str).toLocaleString()} روپے`;
    }
    return str;
  };

  // فوری ترسیل کی تصدیق کرنا
  const handleMarkDelivered = () => {
    const updated = storageService.markDelivered(
      record.id, 
      deliveryName, 
      deliveryPhone, 
      deliveryNotes
    );
    if (updated) {
      setShowDeliveryForm(false);
      if (onRecordUpdated) onRecordUpdated(updated);
    }
  };

  const folderTitle = record.folderTitle || `${record.serialNo} - ${record.groom?.name} و ${record.bride?.name}`;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '960px' }}>
        
        {/* ہیڈر بار مع فولڈر ٹائٹل اور ایکشن بٹنز */}
        <div className="card-header-styled" style={{ padding: '16px 24px', margin: 0, borderBottom: '2px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <FolderArchive size={26} color="var(--primary-700)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-900)' }}>
                {folderTitle}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span className="badge badge-green font-num">فارم: {record.serialNo}</span>
                <span className={`badge ${record.registrationType === 'computerized' ? 'badge-blue' : 'badge-gold'}`}>
                  {record.registrationType === 'computerized' ? 'کمپیوٹرائزڈ نکاح نامہ' : 'صرف دستی نکاح نامہ'}
                </span>
                <span className={`badge ${record.delivery?.isDelivered ? 'badge-green' : 'badge-red'}`}>
                  {record.delivery?.isDelivered ? '✓ حوالے کر دیا گیا ہے' : '⏳ دفتر میں موجود (غیر وصول شدہ)'}
                </span>
                {record.officiantType === 'guest' && (
                  <span className="badge badge-gold">
                    مہمان نکاح خواں: {record.guestOfficiant?.name || 'دیگر عالم'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={() => onEdit(record)}>
              <Edit3 size={16} />
              <span>ترمیم</span>
            </button>
            <button className="btn btn-primary" onClick={() => onPrint(record)}>
              <Printer size={16} />
              <span>۴ پرت پرنٹ نکالیں</span>
            </button>
            <button className="btn-icon" onClick={onClose} title="بند کریں">
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
          
          {/* ============================================================ */}
          {/* وصولی، فیس اور تاریخ کی خلاصہ پٹی                             */}
          {/* ============================================================ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {/* تاریخ و مقام */}
            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>تاریخ و مقام انعقاد:</span>
              <strong style={{ fontSize: '0.92rem' }}>{formatPKDate(record.nikkahDate)}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{record.hijriDate || getHijriDate(record.nikkahDate)}</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>{record.location || record.unionCouncil || '-'}</div>
            </div>

            {/* فیس سمری */}
            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>فیس اکاؤنٹنگ:</span>
              {isNumericAgreed ? (
                <>
                  <div>طے شدہ: <strong className="font-num">{agreedNum.toLocaleString()} روپے</strong></div>
                  <div>وصول شدہ: <span className="font-num" style={{ color: '#059669', fontWeight: 700 }}>{receivedNum ? `${receivedNum.toLocaleString()} روپے` : '0'}</span></div>
                  <div>
                    بقایا: <span className="font-num" style={{ color: remaining > 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>
                      {remaining > 0 ? `${remaining.toLocaleString()} روپے واجب الادا` : 'مکمل ادا شدہ'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>فیس تفصیل: <strong style={{ color: 'var(--primary-800)' }}>{record.fee?.agreedAmount || 'حسب معمول'}</strong></div>
                  <div>وصول شدہ: <span className="font-num" style={{ color: '#059669', fontWeight: 700 }}>{receivedNum ? `${receivedNum.toLocaleString()} روپے` : 'حسب ضابطہ'}</span></div>
                  <div>اسٹیٹس: <span className="badge badge-green">تصدیق شدہ</span></div>
                </>
              )}
            </div>

            {/* ترسیل کی کیفیت */}
            <div style={{ background: record.delivery?.isDelivered ? '#ecfdf5' : '#fffbeb', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${record.delivery?.isDelivered ? '#a7f3d0' : '#fde68a'}` }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>نکاح نامہ وصولی و حوالگی:</span>
              {record.delivery?.isDelivered ? (
                <div>
                  <strong style={{ color: '#065f46' }}>✓ وصول کنندہ: {record.delivery.deliveredTo || 'فریقین'}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#047857' }}>تاریخ: {formatPKDate(record.delivery.deliveryDate)} {record.delivery.recipientPhone ? `(${record.delivery.recipientPhone})` : ''}</div>
                  {record.delivery.deliveryNotes && <div style={{ fontSize: '0.76rem', color: '#4b5563', marginTop: '2px' }}>{record.delivery.deliveryNotes}</div>}
                </div>
              ) : (
                <div>
                  <strong style={{ color: '#b45309' }}>⏳ دفتر میں موجود ہے</strong>
                  <div style={{ fontSize: '0.78rem', color: '#92400e', marginBottom: '6px' }}>ابھی تک فریقین کے حوالے نہیں کیا گیا۔</div>
                  {!showDeliveryForm ? (
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      onClick={() => setShowDeliveryForm(true)}
                    >
                      ابھی وصولی مارک کریں
                    </button>
                  ) : (
                    <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginTop: '6px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="وصول کنندہ کا نام" 
                        value={deliveryName} 
                        onChange={(e) => setDeliveryName(e.target.value)}
                        style={{ fontSize: '0.82rem', padding: '4px 8px', marginBottom: '6px' }}
                      />
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="رابطہ فون نمبر" 
                        value={deliveryPhone} 
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        style={{ fontSize: '0.82rem', padding: '4px 8px', marginBottom: '6px' }}
                      />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={handleMarkDelivered}>
                          محفوظ کریں
                        </button>
                        <button type="button" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setShowDeliveryForm(false)}>
                          منسوخ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* نکاح خواں تفصیل */}
            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>نکاح کس نے پڑھایا:</span>
              {record.officiantType === 'guest' && record.guestOfficiant?.name ? (
                <div>
                  <strong style={{ color: 'var(--primary-800)' }}>{record.guestOfficiant.name}</strong>
                  {record.guestOfficiant.fatherName && <div style={{ fontSize: '0.78rem' }}>ولد {record.guestOfficiant.fatherName}</div>}
                  {record.guestOfficiant.masjidOrArea && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{record.guestOfficiant.masjidOrArea}</div>}
                  {record.guestOfficiant.phone && <div className="font-num" style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>{record.guestOfficiant.phone}</div>}
                </div>
              ) : (
                <div>
                  <strong style={{ color: '#064e3b' }}>ذاتی (خود نکاح رجسٹرار)</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>مجاز نکاح رجسٹرار دفتر</div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* دستاویزات والٹ اور فوٹو گیلری (CNIC، کمپیوٹرائزڈ نکاح نامہ)      */}
          {/* ============================================================ */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1.5px solid var(--primary-300)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ImageIcon size={20} color="var(--primary-700)" />
              <h4 style={{ margin: 0, color: 'var(--primary-900)', fontSize: '1rem' }}>
                دستاویزات والٹ اور فوٹو گیلری (شناختی کارڈز اور نکاح ناموں کی تصاویر)
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
              
              {/* کمپیوٹرائزڈ نکاح نامہ (NRC) */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', background: 'var(--bg-card)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--primary-800)' }}>
                  کمپیوٹرائزڈ نکاح نامہ (NRC)
                </span>
                {record.vaultDocuments?.computerizedNikkahImg ? (
                  <div 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setActiveImagePreview({ src: record.vaultDocuments.computerizedNikkahImg, title: 'کمپیوٹرائزڈ نکاح نامہ' })}
                  >
                    <img 
                      src={record.vaultDocuments.computerizedNikkahImg} 
                      alt="NRC Certificate" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-700)', display: 'block', marginTop: '4px' }}>بڑا کر کے دیکھیں 🔍</span>
                  </div>
                ) : (
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.75rem', color: '#9ca3af' }}>
                    تصویر موجود نہیں
                  </div>
                )}
              </div>

              {/* دولہا شناختی کارڈ (فرنٹ) */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', background: 'var(--bg-card)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--primary-800)' }}>
                  دولہا CNIC (فرنٹ)
                </span>
                {record.vaultDocuments?.groomCnicFront || record.groom?.cnicImageFront ? (
                  <div 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setActiveImagePreview({ src: record.vaultDocuments?.groomCnicFront || record.groom?.cnicImageFront, title: 'دولہا شناختی کارڈ (فرنٹ)' })}
                  >
                    <img 
                      src={record.vaultDocuments?.groomCnicFront || record.groom?.cnicImageFront} 
                      alt="Groom CNIC Front" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-700)', display: 'block', marginTop: '4px' }}>بڑا کر کے دیکھیں 🔍</span>
                  </div>
                ) : (
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.75rem', color: '#9ca3af' }}>
                    تصویر موجود نہیں
                  </div>
                )}
              </div>

              {/* دولہا شناختی کارڈ (بیک) */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', background: 'var(--bg-card)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--primary-800)' }}>
                  دولہا CNIC (بیک)
                </span>
                {record.vaultDocuments?.groomCnicBack || record.groom?.cnicImageBack ? (
                  <div 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setActiveImagePreview({ src: record.vaultDocuments?.groomCnicBack || record.groom?.cnicImageBack, title: 'دولہا شناختی کارڈ (بیک)' })}
                  >
                    <img 
                      src={record.vaultDocuments?.groomCnicBack || record.groom?.cnicImageBack} 
                      alt="Groom CNIC Back" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-700)', display: 'block', marginTop: '4px' }}>بڑا کر کے دیکھیں 🔍</span>
                  </div>
                ) : (
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.75rem', color: '#9ca3af' }}>
                    تصویر موجود نہیں
                  </div>
                )}
              </div>

              {/* دلہن شناختی کارڈ (فرنٹ) */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', background: 'var(--bg-card)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--gold-700)' }}>
                  دلہن CNIC (فرنٹ)
                </span>
                {record.vaultDocuments?.brideCnicFront || record.bride?.cnicImageFront ? (
                  <div 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setActiveImagePreview({ src: record.vaultDocuments?.brideCnicFront || record.bride?.cnicImageFront, title: 'دلہن شناختی کارڈ (فرنٹ)' })}
                  >
                    <img 
                      src={record.vaultDocuments?.brideCnicFront || record.bride?.cnicImageFront} 
                      alt="Bride CNIC Front" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold-700)', display: 'block', marginTop: '4px' }}>بڑا کر کے دیکھیں 🔍</span>
                  </div>
                ) : (
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.75rem', color: '#9ca3af' }}>
                    تصویر موجود نہیں
                  </div>
                )}
              </div>

              {/* دلہن شناختی کارڈ (بیک) */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', background: 'var(--bg-card)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--gold-700)' }}>
                  دلہن CNIC (بیک)
                </span>
                {record.vaultDocuments?.brideCnicBack || record.bride?.cnicImageBack ? (
                  <div 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => setActiveImagePreview({ src: record.vaultDocuments?.brideCnicBack || record.bride?.cnicImageBack, title: 'دلہن شناختی کارڈ (بیک)' })}
                  >
                    <img 
                      src={record.vaultDocuments?.brideCnicBack || record.bride?.cnicImageBack} 
                      alt="Bride CNIC Back" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold-700)', display: 'block', marginTop: '4px' }}>بڑا کر کے دیکھیں 🔍</span>
                  </div>
                ) : (
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.75rem', color: '#9ca3af' }}>
                    تصویر موجود نہیں
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ============================================================ */}
          {/* فریقین کا تقابلی کارڈ (دولہا اور دلہن)                         */}
          {/* ============================================================ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            
            {/* دولہا کارڈ */}
            <div style={{ border: '1.5px solid var(--primary-500)', borderRadius: '12px', padding: '16px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                <h4 style={{ color: 'var(--primary-800)', margin: 0 }}>
                  کوائف دولہا (Groom)
                </h4>
                {record.groom?.hasVakil === false ? (
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>✓ خود حاضر مجلس</span>
                ) : (
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>وکیل مقرر شدہ</span>
                )}
              </div>
              <p><strong>نام گرامی:</strong> {record.groom?.name}</p>
              <p><strong>ولدیت:</strong> {record.groom?.fatherName}</p>
              <p><strong>شناختی کارڈ:</strong> <span className="font-num">{record.groom?.cnic || 'درج نہیں'}</span></p>
              <p>
                <strong>عمر / پیدائش:</strong> <span className="font-num">{record.groom?.age || '-'}</span> سال
                {record.groom?.dob && <span className="font-num" style={{ color: 'var(--text-muted)', marginRight: '6px', fontSize: '0.84rem' }}>(تاریخ پیدائش: {record.groom.dob})</span>}
                {' '}({record.groom?.maritalStatus || 'کنوارا'})
              </p>
              <p><strong>فون نمبر:</strong> <span className="font-num">{record.groom?.phone || '-'}</span></p>
              <p><strong>سکونت / پتہ:</strong> {record.groom?.address || '-'}</p>
              {record.groom?.hasVakil !== false && record.groom?.vakilName ? (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed var(--border-color)' }}>
                  <strong>وکیل دولہا:</strong> {record.groom.vakilName} (ولد {record.groom.vakilFatherName || '-'})
                  {record.groom.vakilCnic && <div className="font-num" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>شناختی کارڈ: {record.groom.vakilCnic}</div>}
                  {record.groom.vakilAddress && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>سکونت: {record.groom.vakilAddress}</div>}
                </div>
              ) : (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#16a34a' }}>
                  دولہا بذات خود حاضر مجلس تھا، وکیل کی حاجت نہ تھی۔
                </div>
              )}
            </div>

            {/* دلہن کارڈ */}
            <div style={{ border: '1.5px solid var(--gold-500)', borderRadius: '12px', padding: '16px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                <h4 style={{ color: 'var(--gold-700)', margin: 0 }}>
                  کوائف دلہن (Bride)
                </h4>
                {record.bride?.hasVakil === false ? (
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>✓ خود حاضر مجلس</span>
                ) : (
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>وکیل مقرر شدہ</span>
                )}
              </div>
              <p><strong>نام گرامی:</strong> {record.bride?.name}</p>
              <p><strong>ولدیت:</strong> {record.bride?.fatherName}</p>
              <p><strong>شناختی کارڈ:</strong> <span className="font-num">{record.bride?.cnic || 'درج نہیں'}</span></p>
              <p>
                <strong>عمر / پیدائش:</strong> <span className="font-num">{record.bride?.age || '-'}</span> سال
                {record.bride?.dob && <span className="font-num" style={{ color: 'var(--text-muted)', marginRight: '6px', fontSize: '0.84rem' }}>(تاریخ پیدائش: {record.bride.dob})</span>}
                {' '}({record.bride?.maritalStatus || 'کنواری'})
              </p>
              <p><strong>فون نمبر:</strong> <span className="font-num">{record.bride?.phone || '-'}</span></p>
              <p><strong>سکونت / پتہ:</strong> {record.bride?.address || '-'}</p>
              {record.bride?.hasVakil !== false && record.bride?.vakilName ? (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed var(--border-color)' }}>
                  <strong>وکیل دلہن:</strong> {record.bride.vakilName} (ولد {record.bride.vakilFatherName || '-'})
                  {record.bride.vakilCnic && <div className="font-num" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>شناختی کارڈ: {record.bride.vakilCnic}</div>}
                  {record.bride.vakilAddress && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>سکونت: {record.bride.vakilAddress}</div>}
                </div>
              ) : (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#16a34a' }}>
                  دلہن بذات خود حاضر مجلس تھی اور خود ایجاب و قبول کیا۔
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* حق مہر، شرائط اور گواہان                                     */}
          {/* ============================================================ */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
            <h4 style={{ color: 'var(--primary-800)', marginBottom: '8px' }}>حق مہر و شرائطِ نکاح:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>کل رقم مہر: <strong className="font-num" style={{ color: '#064e3b' }}>{formatMoneyOrText(record.mehr?.totalAmount)}</strong> {record.mehr?.totalAmountWords ? `(${record.mehr.totalAmountWords})` : ''}</div>
              <div>معجل (نقد): <span className="font-num">{formatMoneyOrText(record.mehr?.muajjal)}</span></div>
              <div>مؤجل (واجب الادا): <span className="font-num">{formatMoneyOrText(record.mehr?.muwajjal)}</span></div>
              <div>سونے کا وزن / زیور: <span>{record.mehr?.goldWeight || '-'}</span></div>
            </div>
            {record.mehr?.specialConditions && (
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed var(--border-color)' }}>
                <strong>خصوصی شرائط:</strong> {record.mehr.specialConditions}
              </div>
            )}
          </div>

          {/* شرعی گواہان */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', background: 'var(--bg-card)', marginBottom: '16px' }}>
            <h4 style={{ color: 'var(--primary-800)', marginBottom: '10px' }}>شرعی گواہانِ نکاح:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div>
                <strong>۱۔ {record.witnessGroom1?.name || '-'}</strong> ولد {record.witnessGroom1?.fatherName || '-'}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>CNIC: <span className="font-num">{record.witnessGroom1?.cnic || '-'}</span> | فون: <span className="font-num">{record.witnessGroom1?.phone || '-'}</span></div>
              </div>
              <div>
                <strong>۲۔ {record.witnessBride1?.name || record.witnessGroom2?.name || '-'}</strong> ولد {record.witnessBride1?.fatherName || record.witnessGroom2?.fatherName || '-'}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>CNIC: <span className="font-num">{record.witnessBride1?.cnic || record.witnessGroom2?.cnic || '-'}</span> | فون: <span className="font-num">{record.witnessBride1?.phone || record.witnessGroom2?.phone || '-'}</span></div>
              </div>
            </div>
          </div>

          {/* دستخط و مہر جات (خانہ ۲۵) گیلری */}
          {(() => {
            const signs = record.columnSignatures || {};
            const signatureList = [
              { key: 'groomSignatureImg', label: 'دستخط دولہا', src: signs.groomSignatureImg },
              { key: 'groomVakilSignatureImg', label: 'دستخط وکیل دولہا', src: signs.groomVakilSignatureImg },
              { key: 'brideSignatureImg', label: 'دستخط دلہن', src: signs.brideSignatureImg },
              { key: 'brideVakilSignatureImg', label: 'دستخط وکیل دلہن', src: signs.brideVakilSignatureImg },
              { key: 'shariWitness1SignatureImg', label: 'دستخط شرعی گواہ ۱', src: signs.shariWitness1SignatureImg || signs.witnessesSignatureImg },
              { key: 'shariWitness2SignatureImg', label: 'دستخط شرعی گواہ ۲', src: signs.shariWitness2SignatureImg },
              { key: 'marriageWitness1SignatureImg', label: 'دستخط گواہ شادی ۱', src: signs.marriageWitness1SignatureImg },
              { key: 'marriageWitness2SignatureImg', label: 'دستخط گواہ شادی ۲', src: signs.marriageWitness2SignatureImg },
              { key: 'nikkahKhawanSignatureImg', label: 'دستخط نکاح خواں', src: signs.nikkahKhawanSignatureImg },
              { key: 'registrarSealImg', label: 'مہر و دستخط رجسٹرار', src: signs.registrarSealImg }
            ].filter(s => !!s.src);

            if (signatureList.length === 0) return null;

            return (
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', background: 'var(--bg-card)' }}>
                <h4 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                  دستخط و مہر جات گیلری (خانہ ۲۵ - کل {signatureList.length} دستخط محفوظ):
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '10px' }}>
                  {signatureList.map(sig => (
                    <div 
                      key={sig.key} 
                      style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', background: 'var(--bg-card-subtle)', textAlign: 'center', cursor: 'pointer' }}
                      onClick={() => setActiveImagePreview({ src: sig.src, title: sig.label })}
                    >
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--primary-800)' }}>
                        {sig.label}
                      </span>
                      <img src={sig.src} alt={sig.label} style={{ width: '100%', height: '55px', objectFit: 'contain', background: '#ffffff', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                      <span style={{ fontSize: '0.68rem', color: 'var(--primary-700)', display: 'block', marginTop: '4px' }}>زوم کریں 🔍</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

        </div>

        {/* فلوٹنگ لائٹ باکس برائے امیج زومر */}
        {activeImagePreview && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(0,0,0,0.85)', 
              zIndex: 9999, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setActiveImagePreview(null)}
          >
            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ fontSize: '1.1rem' }}>{activeImagePreview.title}</strong>
                <button className="btn-icon" onClick={() => setActiveImagePreview(null)}><X size={20} /></button>
              </div>
              <img src={activeImagePreview.src} alt="Preview" style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '6px' }} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
