import React, { useState } from 'react';
import { 
  FileCheck, 
  User, 
  Users, 
  Coins, 
  Camera, 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  X,
  Phone,
  MoonStar,
  Receipt,
  CheckSquare,
  SkipForward,
  Image as ImageIcon,
  Layers,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  Eye,
  Building,
  UserCheck
} from 'lucide-react';
import { compressImage, formatBytes } from '../utils/imageCompressor';
import { formatCNIC, formatPhone, getHijriDate } from '../utils/dateUtils';

export default function NewNikkahForm({ 
  onSave, 
  onCancel, 
  initialData = null,
  profile
}) {
  // بنیادی ابتدائی اسٹیٹ
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        hijriDate: initialData.hijriDate || getHijriDate(initialData.nikkahDate)
      };
    }
    return {
      serialNo: '',
      folderTitle: '',
      nikkahDate: new Date().toISOString().slice(0, 10),
      hijriDate: getHijriDate(new Date().toISOString().slice(0, 10)),
      nikkahTime: '20:30',
      location: '',
      wardVillage: '',
      unionCouncil: profile?.unionCouncil || '',
      district: profile?.district || 'لاہور',

      // نکاح خواں کی قسم
      officiantType: 'self', // 'self' یا 'guest'
      guestOfficiant: {
        name: '',
        fatherName: '',
        masjidOrArea: '',
        phone: ''
      },

      // قسم نکاح نامہ
      registrationType: 'computerized', // 'computerized' یا 'manual_only'

      // دولہا
      groom: {
        name: '',
        fatherName: '',
        cnic: '',
        age: '',
        maritalStatus: 'کنوارا',
        phone: '',
        address: '',
        vakilName: '',
        vakilFatherName: '',
        vakilCnic: '',
        vakilPhone: '',
        vakilAddress: '',
        vakilWitnesses: ''
      },

      // دلہن
      bride: {
        name: '',
        fatherName: '',
        cnic: '',
        age: '',
        maritalStatus: 'کنواری',
        phone: '',
        address: '',
        vakilName: '',
        vakilFatherName: '',
        vakilCnic: '',
        vakilPhone: '',
        vakilAddress: '',
        vakilWitnesses: ''
      },

      // گواہان
      witnessGroom1: { name: '', fatherName: '', cnic: '', phone: '', address: '' },
      witnessGroom2: { name: '', fatherName: '', cnic: '', phone: '', address: '' },
      witnessBride1: { name: '', fatherName: '', cnic: '', phone: '', address: '' },
      witnessBride2: { name: '', fatherName: '', cnic: '', phone: '', address: '' },

      // مہر اور شرائط
      mehr: {
        totalAmount: '',
        totalAmountWords: '',
        muajjal: '',
        muwajjal: '',
        paidAtNikkah: '',
        goldWeight: '',
        specialConditions: '',
        delegatedDivorce: 'نہیں',
        husbandRestrictions: 'کوئی نہیں',
        dowerDocs: 'رسید مہر الگ سے تیار کی گئی۔',
        existingWives: 'نہیں',
        permissionLetter: ''
      },

      // فیس
      fee: {
        agreedAmount: profile?.feeDefault || '5000',
        receivedAmount: ''
      },

      // وصولی و ترسیل
      delivery: {
        isDelivered: false,
        deliveredTo: '',
        deliveryDate: '',
        recipientPhone: '',
        deliveryNotes: ''
      },

      tracking: {
        isRegistered: true,
        isComputerizedReceived: false,
        isDelivered: false
      },

      // کالمز کی تصاویر اور دستخط
      columnSignatures: {},
      
      // دستاویزات والٹ (شناختی کارڈز اور کمپیوٹرائزڈ نکاح نامہ)
      vaultDocuments: {
        groomCnicFront: null,
        groomCnicBack: null,
        brideCnicFront: null,
        brideCnicBack: null,
        computerizedNikkahImg: null,
        manualNikkahImgs: []
      },

      skippedColumns: [],
      notes: ''
    };
  });

  // ویو موڈ: 'boxes' (باکس بائی باکس موڈ) یا 'full_form' (تمام خانے ایک ساتھ)
  const [viewMode, setViewMode] = useState('boxes');
  const [currentBox, setCurrentBox] = useState(1);
  const [showNavigator, setShowNavigator] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState('');

  // نسٹڈ ڈیٹا اپڈیٹ کرنے کا ہینڈلر
  const updateNested = (parentKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [field]: value
      }
    }));
  };

  // سیدھا ڈیٹا اپڈیٹ کرنے کا ہینڈلر
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // کالم کو سکپ یا ان سکپ کرنا
  const toggleSkipColumn = (colNumber) => {
    setFormData((prev) => {
      const skipped = new Set(prev.skippedColumns || []);
      if (skipped.has(colNumber)) {
        skipped.delete(colNumber);
      } else {
        skipped.add(colNumber);
      }
      return {
        ...prev,
        skippedColumns: Array.from(skipped)
      };
    });
  };

  const isSkipped = (colNum) => (formData.skippedColumns || []).includes(colNum);

  // کسی کالم کے ساتھ دستخط یا تصویر اٹیچ کرنا
  const handleAttachColumnImage = async (key, file) => {
    if (!file) return;
    try {
      setCompressing(true);
      setCompressionInfo('تصویر کا سائز کمپریس ہو رہا ہے...');
      const compressedDataUrl = await compressImage(file, 1200, 0.75);

      setFormData((prev) => ({
        ...prev,
        columnSignatures: {
          ...prev.columnSignatures,
          [key]: compressedDataUrl
        }
      }));
      setCompressionInfo('تصویر کامیابی سے اٹیچ ہو گئی!');
      setTimeout(() => setCompressionInfo(''), 2500);
    } catch (err) {
      console.error(err);
      alert('تصویر اپلوڈ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setCompressing(false);
    }
  };

  // کسی والٹ دستاویز کی تصویر اپلوڈ کرنا (CNIC, NRC)
  const handleVaultDocUpload = async (docKey, file) => {
    if (!file) return;
    try {
      setCompressing(true);
      setCompressionInfo('دستاویز کمپریس ہو رہی ہے...');
      const compressed = await compressImage(file, 1200, 0.75);

      setFormData((prev) => ({
        ...prev,
        vaultDocuments: {
          ...prev.vaultDocuments,
          [docKey]: compressed
        }
      }));
      setCompressionInfo('دستاویز والٹ میں محفوظ ہو گئی!');
      setTimeout(() => setCompressionInfo(''), 2500);
    } catch (err) {
      console.error(err);
      alert('دستاویز اپلوڈ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setCompressing(false);
    }
  };

  // فارم سبمٹ ہینڈلر
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!formData.serialNo) {
      alert('برائے مہربانی رجسٹریشن یا فارم نمبر ضرور درج کریں۔');
      setCurrentBox(1);
      return;
    }

    if (!formData.groom?.name || !formData.bride?.name) {
      alert('برائے مہربانی دولہا اور دلہن کا نام ضرور درج کریں۔');
      setCurrentBox(2);
      return;
    }

    // فولڈر ٹائٹل خودکار سنواریں
    const folderTitle = `${formData.serialNo} - ${formData.groom.name} و ${formData.bride.name}${formData.officiantType === 'guest' ? ' (مہمان نکاح خواں)' : ''}`;

    onSave({
      ...formData,
      folderTitle
    });
  };

  // ۲۵ سرکاری کالمز کے عنوانات برائے نیویگیٹر
  const COLUMN_TITLES = [
    { num: 1, title: 'مقام و علاقہ نکاح' },
    { num: 2, title: 'کوائف دولہا مع سکونت' },
    { num: 3, title: 'عمر دولہا' },
    { num: 4, title: 'کوائف دلہن مع سکونت' },
    { num: 5, title: 'حیثیت دلہن (کنواری/بیوہ/مطلقہ)' },
    { num: 6, title: 'عمر دلہن' },
    { num: 7, title: 'وکیل دلہن' },
    { num: 8, title: 'گواہان تقرری وکیل دلہن' },
    { num: 9, title: 'وکیل دولہا' },
    { num: 10, title: 'گواہان تقرری وکیل دولہا' },
    { num: 11, title: 'شرعی گواہانِ نکاح' },
    { num: 12, title: 'تاریخ نکاح (شمسی و ہجری)' },
    { num: 13, title: 'رقم حق مہر' },
    { num: 14, title: 'مہر معجل و مؤجل' },
    { num: 15, title: 'موقع پر ادا شدہ مہر' },
    { num: 16, title: 'مہر جائیداد / سونا' },
    { num: 17, title: 'خصوصی شرائط نکاح' },
    { num: 18, title: 'تفویضِ طلاق' },
    { num: 19, title: 'پابندی حق طلاق' },
    { num: 20, title: 'دستاویزات مہر و نان نفقہ' },
    { num: 21, title: 'پہلے سے موجود بیوی' },
    { num: 22, title: 'اجازت نامہ ثالثی کونسل' },
    { num: 23, title: 'کوائف نکاح خواں (ذاتی / مہمان)' },
    { num: 24, title: 'فیس، وصولی و قسم نکاح نامہ' },
    { num: 25, title: 'دستخط، انگوٹھا جات و مہر' }
  ];

  return (
    <div className="card" style={{ maxWidth: '980px', margin: '0 auto', background: 'var(--bg-card)' }}>
      {/* ہیڈر بار مع موڈ سوئچر */}
      <div className="card-header-styled" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <div className="card-title-with-icon">
            <Sparkles size={24} color="var(--primary-700)" />
            <span>نکاح رجسٹریشن فارم (سرکاری ۲۵ کالمز باقاعدہ فارمیٹ)</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            موبائل و کمپیوٹر پر آسانی سے اندراج کریں، خانے سکپ کریں یا دستخط کی تصویر لگائیں
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* باکس موڈ بمقابلہ فل فارم موڈ بٹن */}
          <button 
            type="button" 
            className={`btn ${viewMode === 'boxes' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '7px 14px', fontSize: '0.86rem' }}
            onClick={() => setViewMode(viewMode === 'boxes' ? 'full_form' : 'boxes')}
          >
            <Layers size={16} />
            <span>{viewMode === 'boxes' ? 'پورے فارم کا جائزہ' : 'باکس بائی باکس موڈ'}</span>
          </button>

          <button type="button" className="btn-icon" onClick={onCancel} title="منسوخ کریں">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* الرٹ بینر اگر کمپریشن چل رہی ہو */}
      {compressionInfo && (
        <div style={{ background: 'var(--primary-50)', color: 'var(--primary-900)', padding: '10px 16px', borderRadius: '8px', margin: '16px 20px 0', border: '1px solid var(--primary-300)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} />
          <span>{compressionInfo}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* پروگریس اور باکس نیویگیشن بار (صرف باکس موڈ میں) */}
      {/* ========================================================================= */}
      {viewMode === 'boxes' && (
        <div style={{ padding: '16px 20px 0', background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-green font-num" style={{ fontSize: '1rem', padding: '4px 10px' }}>
                خانہ نمبر {currentBox} از ۲۵
              </span>
              <strong style={{ fontSize: '1rem', color: 'var(--primary-800)' }}>
                {COLUMN_TITLES[currentBox - 1]?.title}
              </strong>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              onClick={() => setShowNavigator(!showNavigator)}
            >
              <ListOrdered size={14} />
              <span>{showNavigator ? 'لسٹ چھپائیں' : 'تمام خانوں کی لسٹ'}</span>
            </button>
          </div>

          {/* پروگریس بار */}
          <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
            <div 
              style={{ 
                width: `${(currentBox / 25) * 100}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--primary-600), var(--gold-500))',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>

          {/* تمام ۲۵ خانوں کا نیویگیٹر گرڈ (اگر کھلا ہو) */}
          {showNavigator && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px', padding: '10px 0 16px', borderTop: '1px dashed var(--border-color)' }}>
              {COLUMN_TITLES.map((col) => {
                const skipped = isSkipped(col.num);
                const active = currentBox === col.num;
                return (
                  <button
                    key={col.num}
                    type="button"
                    onClick={() => {
                      setCurrentBox(col.num);
                      setShowNavigator(false);
                    }}
                    style={{
                      padding: '6px 8px',
                      fontSize: '0.78rem',
                      textAlign: 'right',
                      borderRadius: '6px',
                      border: active ? '2px solid var(--primary-700)' : '1px solid var(--border-color)',
                      background: active ? 'var(--primary-100)' : skipped ? '#fee2e2' : 'var(--bg-card)',
                      color: active ? 'var(--primary-900)' : skipped ? '#991b1b' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    <span className="font-num" style={{ fontWeight: 700 }}>{col.num}.</span> {col.title}
                    {skipped && <span style={{ display: 'block', fontSize: '0.7rem', color: '#dc2626' }}>سکپ شدہ</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* مرکزی فارم ایریا                                                         */}
      {/* ========================================================================= */}
      <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
        
        {/* =================================================== */}
        {/* باکس بائی باکس رینڈرنگ (ہر کالم ایک باکس کی صورت میں) */}
        {/* =================================================== */}
        {viewMode === 'boxes' ? (
          <div>
            {/* ہیڈر ایکشن بار برائے کرنٹ باکس: سکپ بٹن اور تصویر بٹن */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: isSkipped(currentBox) ? '#fef2f2' : 'transparent', padding: '8px 12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn ${isSkipped(currentBox) ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  onClick={() => toggleSkipColumn(currentBox)}
                >
                  <SkipForward size={15} />
                  <span>{isSkipped(currentBox) ? 'خانہ سکپ ختم کریں' : 'یہ خانہ ابھی سکپ کریں (Skip)'}</span>
                </button>
                {isSkipped(currentBox) && (
                  <span style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>
                    یہ خانہ سکپ لسٹ میں شامل ہے (بعد میں پر کر سکتے ہیں)
                  </span>
                )}
              </div>

              {/* کالم امیج اٹیچمنٹ (دستخط یا تصویر) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <Camera size={15} />
                  <span>اس خانے میں تصویر / دستخط لگائیں</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleAttachColumnImage(`col_${currentBox}`, e.target.files[0]);
                      }
                    }} 
                  />
                </label>
              </div>
            </div>

            {/* اگر اس خانے کی تصویر اٹیچ ہے تو پری ویو */}
            {formData.columnSignatures?.[`col_${currentBox}`] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                <img 
                  src={formData.columnSignatures[`col_${currentBox}`]} 
                  alt={`Col ${currentBox} Attachment`} 
                  style={{ width: '80px', height: '60px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }} 
                />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--primary-800)' }}>خانہ نمبر {currentBox} میں تصویر / دستخط اٹیچ ہے</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>پرنٹ نکالتے وقت یہ تصویر اسی متعلقہ خانے میں ظاہر ہوگی۔</div>
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  onClick={() => {
                    const updated = { ...formData.columnSignatures };
                    delete updated[`col_${currentBox}`];
                    setFormData((prev) => ({ ...prev, columnSignatures: updated }));
                  }}
                >
                  <Trash2 size={14} />
                  <span>ہٹائیں</span>
                </button>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ہر خانے کا اندرونی ان پٹ فیلڈز                                       */}
            {/* ------------------------------------------------------------------ */}
            <div style={{ minHeight: '320px', padding: '16px', border: '1.5px solid var(--primary-300)', borderRadius: '12px', background: 'var(--bg-card)' }}>
              
              {/* کالم ۱: مقام و علاقہ */}
              {currentBox === 1 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱: نکاح کس وارڈ/دیہہ/قصبہ/تحصیل و ضلع میں ہوا
                  </h3>
                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label">رجسٹریشن / فارم نمبر (Serial No) *</label>
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="مثال: 145/26" 
                        value={formData.serialNo}
                        onChange={(e) => updateField('serialNo', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">وارڈ / دیہہ / قصبہ</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="مثال: وارڈ نمبر ۵، سبزہ زار" 
                        value={formData.wardVillage || ''}
                        onChange={(e) => updateField('wardVillage', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">یونین کونسل کا نام / نمبر</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="یونین کونسل نمبر ۱۰۴" 
                        value={formData.unionCouncil}
                        onChange={(e) => updateField('unionCouncil', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">مقامِ انعقادِ نکاح (شادی ہال / مسجد / گھر)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="قصرِ نور بینکوئٹ ہال، لاہور" 
                        value={formData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">تحصیل و ضلع</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="ضلع و تحصیل لاہور" 
                        value={formData.district}
                        onChange={(e) => updateField('district', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* کالم ۲: کوائف دولہا مع سکونت */}
              {currentBox === 2 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۲: دولہا اور اس کے والد کا نام معہ سکونت
                  </h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">نام دولہا (Groom Name) *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="محمد عثمان علی" 
                        value={formData.groom.name}
                        onChange={(e) => updateNested('groom', 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ولدیت دولہا (Father Name) *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="چوہدری لیاقت علی" 
                        value={formData.groom.fatherName}
                        onChange={(e) => updateNested('groom', 'fatherName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">شناختی کارڈ نمبر دولہا</label>
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="35202-xxxxxxx-x" 
                        value={formData.groom.cnic}
                        onChange={(e) => updateNested('groom', 'cnic', formatCNIC(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">رابطہ فون نمبر دولہا</label>
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="0300-xxxxxxx" 
                        value={formData.groom.phone}
                        onChange={(e) => updateNested('groom', 'phone', formatPhone(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label className="form-label">رہائشی پتہ / سکونت دولہا</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="مکان نمبر 45، بلاک بی، سبزہ زار سکیم، ملتان روڈ، لاہور" 
                      value={formData.groom.address}
                      onChange={(e) => updateNested('groom', 'address', e.target.value)}
                    />
                  </div>

                  {/* دولہا شناختی کارڈ اپلوڈ شارٹ کٹ */}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '5px 10px', cursor: 'pointer' }}>
                      <Camera size={14} />
                      <span>دولہا شناختی کارڈ (فرنٹ) اپلوڈ کریں</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleVaultDocUpload('groomCnicFront', e.target.files?.[0])} />
                    </label>
                    <label className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '5px 10px', cursor: 'pointer' }}>
                      <Camera size={14} />
                      <span>دولہا شناختی کارڈ (بیک) اپلوڈ کریں</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleVaultDocUpload('groomCnicBack', e.target.files?.[0])} />
                    </label>
                    {formData.vaultDocuments?.groomCnicFront && <span style={{ color: '#059669', fontSize: '0.8rem' }}>✓ فرنٹ تصویر موجود ہے</span>}
                  </div>
                </div>
              )}

              {/* کالم ۳: دولہا کی عمر */}
              {currentBox === 3 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۳: دولہا کی عمر (Groom's Age)
                  </h3>
                  <div className="form-group" style={{ maxWidth: '300px' }}>
                    <label className="form-label">عمر سالوں میں (مثلاً 28 سال)</label>
                    <input 
                      type="number" 
                      className="form-control font-num" 
                      placeholder="28" 
                      value={formData.groom.age}
                      onChange={(e) => updateNested('groom', 'age', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۴: کوائف دلہن مع سکونت */}
              {currentBox === 4 && (
                <div>
                  <h3 style={{ color: 'var(--gold-700)', marginBottom: '12px' }}>
                    خانہ نمبر ۴: دلہن اور اس کے والد کا نام معہ سکونت
                  </h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">نام دلہن (Bride Name) *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="فاطمہ زہرا" 
                        value={formData.bride.name}
                        onChange={(e) => updateNested('bride', 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ولدیت دلہن (Father Name) *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="میاں خادم حسین" 
                        value={formData.bride.fatherName}
                        onChange={(e) => updateNested('bride', 'fatherName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">شناختی کارڈ نمبر دلہن</label>
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="35201-xxxxxxx-x" 
                        value={formData.bride.cnic}
                        onChange={(e) => updateNested('bride', 'cnic', formatCNIC(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">رابطہ فون نمبر دلہن / سرپرست</label>
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="0321-xxxxxxx" 
                        value={formData.bride.phone}
                        onChange={(e) => updateNested('bride', 'phone', formatPhone(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label className="form-label">رہائشی پتہ / سکونت دلہن</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="گلی نمبر 2، محلہ اسلام پورہ، نزد جامع مسجد، لاہور" 
                      value={formData.bride.address}
                      onChange={(e) => updateNested('bride', 'address', e.target.value)}
                    />
                  </div>

                  {/* دلہن شناختی کارڈ اپلوڈ شارٹ کٹ */}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '5px 10px', cursor: 'pointer' }}>
                      <Camera size={14} />
                      <span>دلہن شناختی کارڈ (فرنٹ) اپلوڈ کریں</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleVaultDocUpload('brideCnicFront', e.target.files?.[0])} />
                    </label>
                    <label className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '5px 10px', cursor: 'pointer' }}>
                      <Camera size={14} />
                      <span>دلہن شناختی کارڈ (بیک) اپلوڈ کریں</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleVaultDocUpload('brideCnicBack', e.target.files?.[0])} />
                    </label>
                    {formData.vaultDocuments?.brideCnicFront && <span style={{ color: '#059669', fontSize: '0.8rem' }}>✓ فرنٹ تصویر موجود ہے</span>}
                  </div>
                </div>
              )}

              {/* کالم ۵: دلہن کنواری ہے یا بیوہ یا مطلقہ */}
              {currentBox === 5 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۵: دلہن کنواری ہے یا بیوہ یا مطلقہ
                  </h3>
                  <div className="form-group" style={{ maxWidth: '300px' }}>
                    <label className="form-label">ازدواجی حیثیت</label>
                    <select 
                      className="form-control"
                      value={formData.bride.maritalStatus}
                      onChange={(e) => updateNested('bride', 'maritalStatus', e.target.value)}
                    >
                      <option value="کنواری">کنواری (باكرہ)</option>
                      <option value="بیوہ">بیوہ</option>
                      <option value="مطلقہ">مطلقہ</option>
                    </select>
                  </div>
                </div>
              )}

              {/* کالم ۶: دلہن کی عمر */}
              {currentBox === 6 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۶: دلہن کی عمر (Bride's Age)
                  </h3>
                  <div className="form-group" style={{ maxWidth: '300px' }}>
                    <label className="form-label">عمر سالوں میں (مثلاً 25 سال)</label>
                    <input 
                      type="number" 
                      className="form-control font-num" 
                      placeholder="25" 
                      value={formData.bride.age}
                      onChange={(e) => updateNested('bride', 'age', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۷: وکیل دلہن */}
              {currentBox === 7 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۷: اگر دلہن کی طرف سے وکیل مقرر کیا گیا ہو تو اس کا نام، والد کا نام معہ سکونت
                  </h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">نام وکیلِ دلہن</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="محمد ارشد" 
                        value={formData.bride.vakilName || ''}
                        onChange={(e) => updateNested('bride', 'vakilName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ولدیت وکیلِ دلہن</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="میاں خادم حسین" 
                        value={formData.bride.vakilFatherName || ''}
                        onChange={(e) => updateNested('bride', 'vakilFatherName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">شناختی کارڈ وکیل</label>
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="35201-xxxxxxx-x" 
                        value={formData.bride.vakilCnic || ''}
                        onChange={(e) => updateNested('bride', 'vakilCnic', formatCNIC(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">فون نمبر وکیل</label>
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="0322-xxxxxxx" 
                        value={formData.bride.vakilPhone || ''}
                        onChange={(e) => updateNested('bride', 'vakilPhone', formatPhone(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label className="form-label">سکونت وکیلِ دلہن</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="اسلام پورہ، لاہور" 
                      value={formData.bride.vakilAddress || ''}
                      onChange={(e) => updateNested('bride', 'vakilAddress', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۸: گواہان تقرری وکیل دلہن */}
              {currentBox === 8 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۸: دلہن کی طرف سے مقرر کردہ وکیل کی تقرری کے گواہان معہ ولدیت، رشتہ اور سکونت
                  </h3>
                  <div className="form-group">
                    <label className="form-label">تفصیل گواہانِ تقرری وکیل (نام، ولدیت، رشتہ معہ دلہن و سکونت)</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      placeholder="۱۔ سید زوار شاہ ولد علی شاہ (چچا)، اسلام پورہ لاہور&#10;۲۔ کامران یوسف ولد محمد یوسف (ماموں)، لاہور"
                      value={formData.bride.vakilWitnesses || ''}
                      onChange={(e) => updateNested('bride', 'vakilWitnesses', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۹: وکیل دولہا */}
              {currentBox === 9 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۹: اگر دولہا کی طرف سے وکیل مقرر کیا گیا ہو تو اس کا نام، ولدیت و سکونت
                  </h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">نام وکیلِ دولہا</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="طارق محمود" 
                        value={formData.groom.vakilName || ''}
                        onChange={(e) => updateNested('groom', 'vakilName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ولدیت وکیلِ دولہا</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="عبدالرشید" 
                        value={formData.groom.vakilFatherName || ''}
                        onChange={(e) => updateNested('groom', 'vakilFatherName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">شناختی کارڈ وکیل</label>
                      <input 
                        type="text" 
                        className="form-control font-num" 
                        placeholder="35201-xxxxxxx-x" 
                        value={formData.groom.vakilCnic || ''}
                        onChange={(e) => updateNested('groom', 'vakilCnic', formatCNIC(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">سکونت وکیلِ دولہا</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="سبزہ زار، لاہور" 
                        value={formData.groom.vakilAddress || ''}
                        onChange={(e) => updateNested('groom', 'vakilAddress', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* کالم ۱۰: گواہان تقرری وکیل دولہا */}
              {currentBox === 10 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۰: دولہا کے مقرر کردہ وکیل کی تقرری کے گواہان معہ ولدیت و سکونت
                  </h3>
                  <div className="form-group">
                    <label className="form-label">گواہان تقرری وکیلِ دولہا (اگر دولہا خود حاضر نہ ہو اور وکیل کے ذریعے نکاح ہو)</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      placeholder="اگر دولہا خود مجلس میں حاضر ہو تو یہ خانہ خالی رکھا جا سکتا ہے۔"
                      value={formData.groom.vakilWitnesses || ''}
                      onChange={(e) => updateNested('groom', 'vakilWitnesses', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۱۱: شرعی گواہانِ نکاح */}
              {currentBox === 11 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۱: نکاح کے شرعی گواہان کے نام معہ ولدیت، شناختی کارڈ و سکونت
                  </h3>
                  
                  {/* شرعی گواہ نمبر ۱ */}
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '0 0 10px', color: 'var(--primary-700)' }}>شرعی گواہ نمبر ۱ (دولہا کی جانب سے)</h4>
                    <div className="form-grid-3">
                      <input type="text" className="form-control" placeholder="نام گواہ ۱" value={formData.witnessGroom1.name} onChange={(e) => updateNested('witnessGroom1', 'name', e.target.value)} />
                      <input type="text" className="form-control" placeholder="ولدیت" value={formData.witnessGroom1.fatherName} onChange={(e) => updateNested('witnessGroom1', 'fatherName', e.target.value)} />
                      <input type="text" className="form-control font-num" placeholder="شناختی کارڈ" value={formData.witnessGroom1.cnic} onChange={(e) => updateNested('witnessGroom1', 'cnic', formatCNIC(e.target.value))} />
                    </div>
                    <div className="form-grid-2" style={{ marginTop: '8px' }}>
                      <input type="text" className="form-control font-num" placeholder="فون نمبر" value={formData.witnessGroom1.phone} onChange={(e) => updateNested('witnessGroom1', 'phone', formatPhone(e.target.value))} />
                      <input type="text" className="form-control" placeholder="سکونت / پتہ" value={formData.witnessGroom1.address} onChange={(e) => updateNested('witnessGroom1', 'address', e.target.value)} />
                    </div>
                  </div>

                  {/* شرعی گواہ نمبر ۲ */}
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '0 0 10px', color: 'var(--gold-700)' }}>شرعی گواہ نمبر ۲ (دلہن کی جانب سے)</h4>
                    <div className="form-grid-3">
                      <input type="text" className="form-control" placeholder="نام گواہ ۲" value={formData.witnessBride1.name} onChange={(e) => updateNested('witnessBride1', 'name', e.target.value)} />
                      <input type="text" className="form-control" placeholder="ولدیت" value={formData.witnessBride1.fatherName} onChange={(e) => updateNested('witnessBride1', 'fatherName', e.target.value)} />
                      <input type="text" className="form-control font-num" placeholder="شناختی کارڈ" value={formData.witnessBride1.cnic} onChange={(e) => updateNested('witnessBride1', 'cnic', formatCNIC(e.target.value))} />
                    </div>
                    <div className="form-grid-2" style={{ marginTop: '8px' }}>
                      <input type="text" className="form-control font-num" placeholder="فون نمبر" value={formData.witnessBride1.phone} onChange={(e) => updateNested('witnessBride1', 'phone', formatPhone(e.target.value))} />
                      <input type="text" className="form-control" placeholder="سکونت / پتہ" value={formData.witnessBride1.address} onChange={(e) => updateNested('witnessBride1', 'address', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* کالم ۱۲: تاریخ انعقادِ نکاح */}
              {currentBox === 12 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۲: تاریخِ انعقادِ نکاح (شمسی و قمری) و وقت
                  </h3>
                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label">شمسی تاریخِ نکاح</label>
                      <input 
                        type="date" 
                        className="form-control font-num" 
                        value={formData.nikkahDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateField('nikkahDate', val);
                          updateField('hijriDate', getHijriDate(val));
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">قمری / ہجری تاریخ (قابلِ ترمیم)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.hijriDate}
                        onChange={(e) => updateField('hijriDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">وقتِ نکاح</label>
                      <input 
                        type="time" 
                        className="form-control font-num" 
                        value={formData.nikkahTime}
                        onChange={(e) => updateField('nikkahTime', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* کالم ۱۳: رقم حق مہر */}
              {currentBox === 13 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۳: رقم حق مہر (کل رقم بحساب ہندسہ و الفاظ)
                  </h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">کل رقم حق مہر (روپوں میں) *</label>
                      <input 
                        type="number" 
                        className="form-control font-num" 
                        placeholder="500000" 
                        value={formData.mehr.totalAmount}
                        onChange={(e) => updateNested('mehr', 'totalAmount', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">رقم بحسابِ الفاظ</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="پانچ لاکھ روپے فقط" 
                        value={formData.mehr.totalAmountWords}
                        onChange={(e) => updateNested('mehr', 'totalAmountWords', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* کالم ۱۴: مہر معجل اور مؤجل */}
              {currentBox === 14 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۴: مہر معجل اور مؤجل کی تفصیل
                  </h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">مہر معجل (نقد ادا شدہ)</label>
                      <input 
                        type="number" 
                        className="form-control font-num" 
                        placeholder="200000" 
                        value={formData.mehr.muajjal}
                        onChange={(e) => updateNested('mehr', 'muajjal', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">مہر مؤجل (واجب الادا عند الطلب)</label>
                      <input 
                        type="number" 
                        className="form-control font-num" 
                        placeholder="300000" 
                        value={formData.mehr.muwajjal}
                        onChange={(e) => updateNested('mehr', 'muwajjal', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* کالم ۱۵: موقع پر ادا شدہ مہر */}
              {currentBox === 15 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۵: مہر کا کتنا حصہ نکاح کے وقت ادا کیا گیا
                  </h3>
                  <div className="form-group">
                    <label className="form-label">موقع پر ادا شدہ مہر کی تفصیل</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="دو لاکھ روپے نقد موقع پر ادا کر دیے گئے۔" 
                      value={formData.mehr.paidAtNikkah || ''}
                      onChange={(e) => updateNested('mehr', 'paidAtNikkah', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۱۶: مہر جائیداد / سونا */}
              {currentBox === 16 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۶: کیا مہر کے عوض کوئی جائیداد یا طلائی زیورات دیے گئے؟
                  </h3>
                  <div className="form-group">
                    <label className="form-label">سونے کا وزن، طلائی زیورات یا منقولہ/غیر منقولہ جائیداد کی تفصیل</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      placeholder="پانچ تولہ طلائی زیورات بحق دلہن دیے گئے اور ان کی ملکیت تسلیم کی گئی۔"
                      value={formData.mehr.goldWeight || ''}
                      onChange={(e) => updateNested('mehr', 'goldWeight', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۱۷: خصوصی شرائط */}
              {currentBox === 17 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۷: خصوصی شرائط نکاح (اگر کوئی ہوں)
                  </h3>
                  <div className="form-group">
                    <label className="form-label">خصوصی شرائط (نان و نفقہ، الگ رہائش، زیورات کی حفاظت وغیرہ)</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      placeholder="نان و نفقہ ماہانہ مقررہ تاریخ کو ادا ہوگا۔ علیحدہ رہائش کا بندوبست ہوگا۔"
                      value={formData.mehr.specialConditions || ''}
                      onChange={(e) => updateNested('mehr', 'specialConditions', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۱۸: تفویضِ طلاق */}
              {currentBox === 18 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۸: کیا شوہر نے طلاق کا حق بیوی کو تفویض کیا ہے؟
                  </h3>
                  <div className="form-group">
                    <label className="form-label">تفویضِ طلاق کی کیفیت</label>
                    <select 
                      className="form-control"
                      value={formData.mehr.delegatedDivorce}
                      onChange={(e) => updateNested('mehr', 'delegatedDivorce', e.target.value)}
                    >
                      <option value="نہیں">نہیں (شوہر نے طلاق کا حق تفویض نہیں کیا)</option>
                      <option value="ہاں">ہاں (تفویض کیا ہے)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* کالم ۱۹: پابندی حق طلاق */}
              {currentBox === 19 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۱۹: کیا شوہر کے حقِ طلاق پر کوئی پابندی عائد کی گئی ہے؟
                  </h3>
                  <div className="form-group">
                    <label className="form-label">شوہر کے حقِ طلاق پر عائد شرائط / پابندی</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="کوئی نہیں / شرعی و قانونی پابندیاں" 
                      value={formData.mehr.husbandRestrictions || ''}
                      onChange={(e) => updateNested('mehr', 'husbandRestrictions', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۲۰: دستاویزات مہر و نان نفقہ */}
              {currentBox === 20 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۲۰: نکاح کے وقت مہر، نان نفقہ وغیرہ کی بابت دستاویزات
                  </h3>
                  <div className="form-group">
                    <label className="form-label">تیار کردہ دستاویزات / رسیدات کی تفصیل</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="مہر کی رسید الگ سے تیار کر کے دلہن کے حوالے کی گئی۔" 
                      value={formData.mehr.dowerDocs || ''}
                      onChange={(e) => updateNested('mehr', 'dowerDocs', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۲۱: پہلے سے موجود بیوی */}
              {currentBox === 21 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۲۱: کیا دولہا کی پہلے سے کوئی بیوی موجود ہے؟
                  </h3>
                  <div className="form-group" style={{ maxWidth: '320px' }}>
                    <label className="form-label">پہلی بیوی کی موجودگی</label>
                    <select 
                      className="form-control"
                      value={formData.mehr.existingWives}
                      onChange={(e) => updateNested('mehr', 'existingWives', e.target.value)}
                    >
                      <option value="نہیں">نہیں (پہلی شادی ہے / کنوارا)</option>
                      <option value="ہاں">ہاں (پہلے سے بیوی موجود ہے)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* کالم ۲۲: اجازت نامہ ثالثی کونسل */}
              {currentBox === 22 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۲۲: کیا دولہا نے دوسری شادی کے لیے ثالثی کونسل سے اجازت حاصل کی ہے؟
                  </h3>
                  <div className="form-group">
                    <label className="form-label">اجازت نامہ کا لیٹر نمبر و تاریخ (اگر لاگو ہو)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="اگر پہلی شادی ہو تو یہ خانہ خالی رہے گا۔" 
                      value={formData.mehr.permissionLetter || ''}
                      onChange={(e) => updateNested('mehr', 'permissionLetter', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* کالم ۲۳: نکاح خواں کے کوائف (ذاتی یا مہمان) */}
              {currentBox === 23 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۲۳: نکاح پڑھانے والے (نکاح خواں) کے کوائف
                  </h3>
                  
                  {/* نکاح خواں کی قسم کا انتخاب */}
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '8px', marginBottom: '16px', border: '1.5px solid var(--primary-400)' }}>
                    <label className="form-label" style={{ fontSize: '1rem', fontWeight: 700 }}>
                      نکاح کس نے پڑھایا ہے؟
                    </label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="officiantType" 
                          checked={formData.officiantType === 'self'} 
                          onChange={() => updateField('officiantType', 'self')} 
                        />
                        <strong>ذاتی (خود نکاح رجسٹرار نے پڑھایا)</strong>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="officiantType" 
                          checked={formData.officiantType === 'guest'} 
                          onChange={() => updateField('officiantType', 'guest')} 
                        />
                        <strong style={{ color: 'var(--primary-800)' }}>دیگر / مہمان نکاح خواں (کسی اور عالم دین نے پڑھایا)</strong>
                      </label>
                    </div>
                  </div>

                  {formData.officiantType === 'self' ? (
                    <div style={{ padding: '12px', background: 'var(--primary-50)', borderRadius: '8px', border: '1px solid var(--primary-300)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-900)' }}>رجسٹرار کے اپنے کوائف پرنٹ میں استعمال ہوں گے:</div>
                      <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                        {profile?.name || 'مولانا قاری محمد اسماعیل صدیقی'} (لائسنس: {profile?.licenseNo || 'NK-LHR-2024/89'})
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ color: 'var(--gold-700)', marginBottom: '10px' }}>دیگر / مہمان نکاح خواں کی معلومات درج کریں:</h4>
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">نام مہمان نکاح خواں *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="مولانا مفتی عبدالحئی قاسمی" 
                            value={formData.guestOfficiant?.name || ''}
                            onChange={(e) => updateNested('guestOfficiant', 'name', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">ولدیت نکاح خواں</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="قاری نور محمد" 
                            value={formData.guestOfficiant?.fatherName || ''}
                            onChange={(e) => updateNested('guestOfficiant', 'fatherName', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-grid-2" style={{ marginTop: '10px' }}>
                        <div className="form-group">
                          <label className="form-label">مسجد / مدرسہ / رہائشی علاقہ</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="جامع مسجد بیت المکرم، فیصل ٹاؤن، لاہور" 
                            value={formData.guestOfficiant?.masjidOrArea || ''}
                            onChange={(e) => updateNested('guestOfficiant', 'masjidOrArea', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">رابطہ فون نمبر</label>
                          <input 
                            type="text" 
                            className="form-control font-num" 
                            placeholder="0321-xxxxxxx" 
                            value={formData.guestOfficiant?.phone || ''}
                            onChange={(e) => updateNested('guestOfficiant', 'phone', formatPhone(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* کالم ۲۴: فیس رجسٹریشن، وصولی و قسم نکاح نامہ */}
              {currentBox === 24 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>
                    خانہ نمبر ۲۴: فیس رجسٹریشن، وصولی کی صورتحال اور قسمِ نکاح نامہ
                  </h3>

                  {/* قسم نکاح نامہ */}
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>نکاح نامہ کی قسم (Registration Type):</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="registrationType" 
                          checked={formData.registrationType === 'computerized'} 
                          onChange={() => updateField('registrationType', 'computerized')} 
                        />
                        <strong>کمپیوٹرائزڈ نکاح نامہ (نکاح رجسٹریشن سرٹیفکیٹ - کونسل / نادرا)</strong>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="registrationType" 
                          checked={formData.registrationType === 'manual_only'} 
                          onChange={() => updateField('registrationType', 'manual_only')} 
                        />
                        <strong>صرف دستی / مینول نکاح نامہ</strong>
                      </label>
                    </div>

                    {/* کمپیوٹرائزڈ نکاح نامہ تصویر اپلوڈ */}
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                      <label className="btn btn-secondary" style={{ fontSize: '0.84rem', cursor: 'pointer' }}>
                        <Camera size={15} />
                        <span>کمپیوٹرائزڈ نکاح نامے کی تصویر محفوظ کریں</span>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleVaultDocUpload('computerizedNikkahImg', e.target.files?.[0])} />
                      </label>
                      {formData.vaultDocuments?.computerizedNikkahImg && (
                        <span style={{ color: '#059669', fontSize: '0.84rem', marginRight: '10px' }}>
                          ✓ کمپیوٹرائزڈ نکاح نامہ کی تصویر محفوظ ہے
                        </span>
                      )}
                    </div>
                  </div>

                  {/* فیس اکاؤنٹنگ */}
                  <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">طے شدہ فیس (روپوں میں)</label>
                      <input 
                        type="number" 
                        className="form-control font-num" 
                        placeholder="5000" 
                        value={formData.fee.agreedAmount}
                        onChange={(e) => updateNested('fee', 'agreedAmount', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">وصول شدہ فیس (روپوں میں)</label>
                      <input 
                        type="number" 
                        className="form-control font-num" 
                        placeholder="3000" 
                        value={formData.fee.receivedAmount}
                        onChange={(e) => updateNested('fee', 'receivedAmount', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* وصولی و ترسیل */}
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '0 0 10px', color: 'var(--primary-800)' }}>نکاح نامہ وصولی و حوالگی کی کیفیت:</h4>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.delivery.isDelivered}
                        onChange={(e) => updateNested('delivery', 'isDelivered', e.target.checked)}
                      />
                      <strong>متعلقہ شخص نے اپنا نکاح نامہ وصول کر لیا ہے (حوالے کر دیا گیا)</strong>
                    </label>

                    {formData.delivery.isDelivered && (
                      <div className="form-grid-3" style={{ marginTop: '10px' }}>
                        <div>
                          <label className="form-label">وصول کنندہ کا نام</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="محمد عثمان (دولہا خود)" 
                            value={formData.delivery.deliveredTo}
                            onChange={(e) => updateNested('delivery', 'deliveredTo', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label">تاریخِ وصولی</label>
                          <input 
                            type="date" 
                            className="form-control font-num" 
                            value={formData.delivery.deliveryDate || new Date().toISOString().slice(0, 10)}
                            onChange={(e) => updateNested('delivery', 'deliveryDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label">وصول کنندہ کا فون</label>
                          <input 
                            type="text" 
                            className="form-control font-num" 
                            placeholder="0300-xxxxxxx" 
                            value={formData.delivery.recipientPhone}
                            onChange={(e) => updateNested('delivery', 'recipientPhone', formatPhone(e.target.value))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* کالم ۲۵: دستخط، انگوٹھا جات و مہر */}
              {currentBox === 25 && (
                <div>
                  <h3 style={{ color: 'var(--primary-800)', marginBottom: '8px' }}>
                    خانہ نمبر ۲۵: دستخط، انگوٹھا جات فریقین، گواہان و مہر نکاح رجسٹرار
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                    نوٹ: اگر آپ دستخطوں کی تصویر موبائل کیمرے سے لگانا چاہیں تو لگا سکتے ہیں، یا اس خانے کو خالی چھوڑ دیں تاکہ پرنٹ کے بعد ہاتھ سے دستخط لیے جا سکیں۔
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    {/* دولہا دستخط */}
                    <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', background: 'var(--bg-card-subtle)' }}>
                      <strong style={{ fontSize: '0.88rem' }}>دستخط دولہا / وکیل</strong>
                      <div style={{ marginTop: '8px' }}>
                        <label className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 8px', width: '100%', cursor: 'pointer' }}>
                          <Camera size={14} />
                          <span>تصویر لگائیں</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleAttachColumnImage('groomSignatureImg', e.target.files?.[0])} />
                        </label>
                      </div>
                      {formData.columnSignatures?.groomSignatureImg && (
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                          <img src={formData.columnSignatures.groomSignatureImg} alt="Groom Sign" style={{ maxHeight: '50px', maxWidth: '100%', objectFit: 'contain' }} />
                        </div>
                      )}
                    </div>

                    {/* دلہن دستخط */}
                    <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', background: 'var(--bg-card-subtle)' }}>
                      <strong style={{ fontSize: '0.88rem' }}>دستخط دلہن / وکیل</strong>
                      <div style={{ marginTop: '8px' }}>
                        <label className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 8px', width: '100%', cursor: 'pointer' }}>
                          <Camera size={14} />
                          <span>تصویر لگائیں</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleAttachColumnImage('brideSignatureImg', e.target.files?.[0])} />
                        </label>
                      </div>
                      {formData.columnSignatures?.brideSignatureImg && (
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                          <img src={formData.columnSignatures.brideSignatureImg} alt="Bride Sign" style={{ maxHeight: '50px', maxWidth: '100%', objectFit: 'contain' }} />
                        </div>
                      )}
                    </div>

                    {/* گواہان دستخط */}
                    <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', background: 'var(--bg-card-subtle)' }}>
                      <strong style={{ fontSize: '0.88rem' }}>دستخط شرعی گواہان</strong>
                      <div style={{ marginTop: '8px' }}>
                        <label className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 8px', width: '100%', cursor: 'pointer' }}>
                          <Camera size={14} />
                          <span>تصویر لگائیں</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleAttachColumnImage('witnessesSignatureImg', e.target.files?.[0])} />
                        </label>
                      </div>
                      {formData.columnSignatures?.witnessesSignatureImg && (
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                          <img src={formData.columnSignatures.witnessesSignatureImg} alt="Witnesses Sign" style={{ maxHeight: '50px', maxWidth: '100%', objectFit: 'contain' }} />
                        </div>
                      )}
                    </div>

                    {/* نکاح خواں دستخط و مہر */}
                    <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', background: 'var(--bg-card-subtle)' }}>
                      <strong style={{ fontSize: '0.88rem' }}>مہر و دستخط رجسٹرار</strong>
                      <div style={{ marginTop: '8px' }}>
                        <label className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 8px', width: '100%', cursor: 'pointer' }}>
                          <Camera size={14} />
                          <span>مہر / دستخط تصویر</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleAttachColumnImage('registrarSealImg', e.target.files?.[0])} />
                        </label>
                      </div>
                      {formData.columnSignatures?.registrarSealImg && (
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                          <img src={formData.columnSignatures.registrarSealImg} alt="Seal Sign" style={{ maxHeight: '50px', maxWidth: '100%', objectFit: 'contain' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* باکس بائی باکس کنٹرول بٹنز (اگلا / پچھلا / مکمل کریں) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={currentBox === 1}
                onClick={() => setCurrentBox((prev) => Math.max(1, prev - 1))}
              >
                <ChevronRight size={18} />
                <span>پچھلا خانہ</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                  <Save size={18} />
                  <span>محفوظ کریں (Save)</span>
                </button>

                {currentBox < 25 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentBox((prev) => Math.min(25, prev + 1))}
                  >
                    <span>اگلا خانہ</span>
                    <ChevronLeft size={18} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" style={{ background: 'var(--gold-600)' }}>
                    <CheckCircle2 size={18} />
                    <span>تمام خانے مکمل اور محفوظ کریں</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* مکمل فارم موڈ (تمام خانے ایک ساتھ دیکھنے اور ایڈٹ کرنے کے لیے)           */
          /* ========================================================================= */
          <div>
            <div style={{ background: 'var(--primary-50)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--primary-300)' }}>
              <strong>مکمل فارم جائزہ موڈ:</strong> آپ تمام ۲۵ کالمز کا ڈیٹا ایک ہی صفحے پر دیکھ رہے ہیں۔
            </div>

            {/* سیکشن ۱: رجسٹریشن اور مقام */}
            <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>۱. رجسٹریشن اور مقامِ نکاح</h3>
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">فارم نمبر *</label>
                  <input type="text" className="form-control font-num" value={formData.serialNo} onChange={(e) => updateField('serialNo', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">تاریخ نکاح</label>
                  <input type="date" className="form-control font-num" value={formData.nikkahDate} onChange={(e) => updateField('nikkahDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">مقامِ انعقاد</label>
                  <input type="text" className="form-control" value={formData.location} onChange={(e) => updateField('location', e.target.value)} />
                </div>
              </div>
            </div>

            {/* سیکشن ۲: دولہا اور دلہن */}
            <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>۲. کوائف فریقین (دولہا اور دلہن)</h3>
              <div className="form-grid-2">
                <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '8px' }}>
                  <h4 style={{ color: 'var(--primary-700)', marginBottom: '10px' }}>کوائف دولہا</h4>
                  <div className="form-group">
                    <label className="form-label">نام دولہا *</label>
                    <input type="text" className="form-control" value={formData.groom.name} onChange={(e) => updateNested('groom', 'name', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label className="form-label">ولدیت دولہا *</label>
                    <input type="text" className="form-control" value={formData.groom.fatherName} onChange={(e) => updateNested('groom', 'fatherName', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label className="form-label">شناختی کارڈ</label>
                    <input type="text" className="form-control font-num" value={formData.groom.cnic} onChange={(e) => updateNested('groom', 'cnic', formatCNIC(e.target.value))} />
                  </div>
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label className="form-label">عمر سالوں میں</label>
                    <input type="number" className="form-control font-num" value={formData.groom.age} onChange={(e) => updateNested('groom', 'age', e.target.value)} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '8px' }}>
                  <h4 style={{ color: 'var(--gold-700)', marginBottom: '10px' }}>کوائف دلہن</h4>
                  <div className="form-group">
                    <label className="form-label">نام دلہن *</label>
                    <input type="text" className="form-control" value={formData.bride.name} onChange={(e) => updateNested('bride', 'name', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label className="form-label">ولدیت دلہن *</label>
                    <input type="text" className="form-control" value={formData.bride.fatherName} onChange={(e) => updateNested('bride', 'fatherName', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label className="form-label">شناختی کارڈ</label>
                    <input type="text" className="form-control font-num" value={formData.bride.cnic} onChange={(e) => updateNested('bride', 'cnic', formatCNIC(e.target.value))} />
                  </div>
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label className="form-label">عمر سالوں میں</label>
                    <input type="number" className="form-control font-num" value={formData.bride.age} onChange={(e) => updateNested('bride', 'age', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* سیکشن ۳: حق مہر، فیس اور ترسیل */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--primary-800)', marginBottom: '12px' }}>۳. مہر، فیس، وصولی و نکاح خواں</h3>
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">کل رقم حق مہر (روپے)</label>
                  <input type="number" className="form-control font-num" value={formData.mehr.totalAmount} onChange={(e) => updateNested('mehr', 'totalAmount', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">طے شدہ فیس</label>
                  <input type="number" className="form-control font-num" value={formData.fee.agreedAmount} onChange={(e) => updateNested('fee', 'agreedAmount', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">وصول شدہ فیس</label>
                  <input type="number" className="form-control font-num" value={formData.fee.receivedAmount} onChange={(e) => updateNested('fee', 'receivedAmount', e.target.value)} />
                </div>
              </div>
            </div>

            {/* محفوظ کرنے کا بٹن */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={onCancel}>منسوخ کریں</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 24px' }}>
                <Save size={18} />
                <span>ریکارڈ محفوظ کریں</span>
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
