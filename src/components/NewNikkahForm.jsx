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
  Image as ImageIcon, 
  Layers, 
  ListOrdered, 
  Eye, 
  Building, 
  UserCheck,
  ShieldCheck,
  FolderArchive
} from 'lucide-react';
import { compressAndMakeTransparent, compressImage } from '../utils/imageCompressor';
import { formatCNIC, formatPhone, getHijriDate } from '../utils/dateUtils';

// پانچ منطقی، یکساں اور جامع مراحل (Uniform 5-Step Process)
const FORM_STEPS = [
  { id: 1, title: 'مقام و رجسٹریشن', sub: 'کوائفِ اندراج و نکاح خواں' },
  { id: 2, title: 'دولہا کے کوائف', sub: 'نام، ولدیت، عمر و وکیل' },
  { id: 3, title: 'دلہن کے کوائف', sub: 'نام، ولدیت، عمر و وکیل' },
  { id: 4, title: 'نکاح، گواہان و حق مہر', sub: 'شرعی گواہان، مہر و شرائط' },
  { id: 5, title: 'سکیننگ، دستخط و مہر جات', sub: 'CNIC کارڈز و دستخط' }
];

export default function NewNikkahForm({ 
  onSave, 
  onCancel, 
  initialData = null,
  profile
}) {
  // بنیادی ابتدائی ڈیٹا
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        hijriDate: initialData.hijriDate || getHijriDate(initialData.nikkahDate),
        groom: {
          hasVakil: initialData.groom?.hasVakil ?? Boolean(initialData.groom?.vakilName),
          hasVakilWitnesses: initialData.groom?.hasVakilWitnesses ?? Boolean(initialData.groom?.vakilWitness1?.name || initialData.groom?.vakilWitnesses),
          vakilWitness1: initialData.groom?.vakilWitness1 || { name: '', fatherName: '', cnic: '', address: '' },
          vakilWitness2: initialData.groom?.vakilWitness2 || { name: '', fatherName: '', cnic: '', address: '' },
          dob: initialData.groom?.dob || '',
          ...initialData.groom
        },
        bride: {
          hasVakil: initialData.bride?.hasVakil ?? Boolean(initialData.bride?.vakilName),
          hasVakilWitnesses: initialData.bride?.hasVakilWitnesses ?? Boolean(initialData.bride?.vakilWitness1?.name || initialData.bride?.vakilWitnesses),
          vakilWitness1: initialData.bride?.vakilWitness1 || { name: '', fatherName: '', cnic: '', address: '' },
          vakilWitness2: initialData.bride?.vakilWitness2 || { name: '', fatherName: '', cnic: '', address: '' },
          dob: initialData.bride?.dob || '',
          ...initialData.bride
        },
        registrar: {
          name: profile?.name || 'مولانا قاری محمد اسماعیل صدیقی',
          fatherName: profile?.fatherName || '',
          licenseNo: profile?.licenseNo || 'NK-LHR-2024/89',
          unionCouncil: profile?.unionCouncil || '',
          district: profile?.district || 'لاہور',
          officeAddress: profile?.officeAddress || '',
          phone: profile?.phone || '',
          ...(initialData.registrar || {})
        },
        columnSignatures: initialData.columnSignatures || {},
        vaultDocuments: {
          groomCnicFront: initialData.vaultDocuments?.groomCnicFront || initialData.groom?.cnicImageFront || null,
          groomCnicBack: initialData.vaultDocuments?.groomCnicBack || initialData.groom?.cnicImageBack || null,
          brideCnicFront: initialData.vaultDocuments?.brideCnicFront || initialData.bride?.cnicImageFront || null,
          brideCnicBack: initialData.vaultDocuments?.brideCnicBack || initialData.bride?.cnicImageBack || null,
          computerizedNikkahImg: initialData.vaultDocuments?.computerizedNikkahImg || null,
          manualNikkahImgs: initialData.vaultDocuments?.manualNikkahImgs || [],
          ...(initialData.vaultDocuments || {})
        }
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

      // نکاح خواں
      officiantType: 'self',
      guestOfficiant: {
        name: '',
        fatherName: '',
        masjidOrArea: '',
        phone: ''
      },

      // نکاح رجسٹرار
      registrar: {
        name: profile?.name || 'مولانا قاری محمد اسماعیل صدیقی',
        fatherName: profile?.fatherName || '',
        licenseNo: profile?.licenseNo || 'NK-LHR-2024/89',
        unionCouncil: profile?.unionCouncil || '',
        district: profile?.district || 'لاہور',
        officeAddress: profile?.officeAddress || '',
        phone: profile?.phone || ''
      },

      // قسم نکاح نامہ
      registrationType: 'computerized',

      // دولہا کے کوائف
      groom: {
        name: '',
        fatherName: '',
        cnic: '',
        age: '',
        dob: '',
        maritalStatus: 'کنوارا',
        phone: '',
        address: '',
        hasVakil: false,
        vakilName: '',
        vakilFatherName: '',
        vakilCnic: '',
        vakilPhone: '',
        vakilAddress: '',
        hasVakilWitnesses: false,
        vakilWitness1: { name: '', fatherName: '', cnic: '', address: '' },
        vakilWitness2: { name: '', fatherName: '', cnic: '', address: '' },
        vakilWitnesses: ''
      },

      // دلہن کے کوائف
      bride: {
        name: '',
        fatherName: '',
        cnic: '',
        age: '',
        dob: '',
        maritalStatus: 'کنواری',
        phone: '',
        address: '',
        hasVakil: false,
        vakilName: '',
        vakilFatherName: '',
        vakilCnic: '',
        vakilPhone: '',
        vakilAddress: '',
        hasVakilWitnesses: false,
        vakilWitness1: { name: '', fatherName: '', cnic: '', address: '' },
        vakilWitness2: { name: '', fatherName: '', cnic: '', address: '' },
        vakilWitnesses: ''
      },

      // شرعی گواہان
      witnessGroom1: {
        name: '',
        fatherName: '',
        cnic: '',
        phone: '',
        address: ''
      },
      witnessGroom2: {
        name: '',
        fatherName: '',
        cnic: '',
        phone: '',
        address: ''
      },
      witnessBride1: {
        name: '',
        fatherName: '',
        cnic: '',
        phone: '',
        address: ''
      },
      witnessBride2: {
        name: '',
        fatherName: '',
        cnic: '',
        phone: '',
        address: ''
      },

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
        agreedAmount: 'حسب معمول',
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

      // والٹ دستاویزات
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

  const [activeStep, setActiveStep] = useState(1);
  const [viewMode, setViewMode] = useState('wizard'); // 'wizard' یا 'full_review'
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

  // فیلڈ اپڈیٹ
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // تاریخ پیدائش سے عمر سالوں میں حساب کرنے کا فنکشن
  const calculateAgeFromDob = (dobString) => {
    if (!dobString) return '';
    const birth = new Date(dobString);
    if (isNaN(birth.getTime())) return '';
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    return years >= 0 ? years.toString() : '';
  };

  // دستخط اور مہر اپلوڈ (وائٹ بیک گراؤنڈ ہٹا کر شفاف PNG بنانا)
  const handleSignatureUpload = async (key, file) => {
    if (!file) return;
    try {
      setCompressing(true);
      setCompressionInfo('دستخط شفاف (Transparent) ہو رہے ہیں...');
      // makeTransparent = true تاکہ الفاظ کے اوپر بھی صاف نظر آئے
      const transparentDataUrl = await compressAndMakeTransparent(file, true, 900);

      setFormData((prev) => ({
        ...prev,
        columnSignatures: {
          ...prev.columnSignatures,
          [key]: transparentDataUrl
        }
      }));
      setCompressionInfo('✓ دستخط کامیابی سے محفوظ ہو گئے!');
      setTimeout(() => setCompressionInfo(''), 2500);
    } catch (err) {
      console.error(err);
      alert('دستخط اپلوڈ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setCompressing(false);
    }
  };

  // شناختی کارڈز اپلوڈ
  const handleCnicUpload = async (docKey, file) => {
    if (!file) return;
    try {
      setCompressing(true);
      setCompressionInfo('شناختی کارڈ کمپریس ہو رہا ہے...');
      const compressed = await compressImage(file, 1200);

      setFormData((prev) => ({
        ...prev,
        vaultDocuments: {
          ...prev.vaultDocuments,
          [docKey]: compressed
        }
      }));
      setCompressionInfo('✓ شناختی کارڈ والٹ میں محفوظ ہو گیا!');
      setTimeout(() => setCompressionInfo(''), 2500);
    } catch (err) {
      console.error(err);
      alert('شناختی کارڈ اپلوڈ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setCompressing(false);
    }
  };

  // دستخط ڈیلیٹ کرنا
  const handleRemoveSignature = (key) => {
    setFormData((prev) => {
      const updated = { ...prev.columnSignatures };
      delete updated[key];
      return {
        ...prev,
        columnSignatures: updated
      };
    });
  };

  // شناختی کارڈ ڈیلیٹ کرنا
  const handleRemoveCnic = (key) => {
    setFormData((prev) => ({
      ...prev,
      vaultDocuments: {
        ...prev.vaultDocuments,
        [key]: null
      }
    }));
  };

  // تمام ۱۰ باضابطہ دستخط و مہر جات کے سلاٹس
  const SIGNATURE_SLOTS = [
    {
      key: 'groomSignatureImg',
      title: '۱۔ دستخط دولہا',
      subtitle: formData.groom?.name ? `(${formData.groom.name})` : '(دولہا خود)',
      badge: 'فریق اول'
    },
    {
      key: 'groomVakilSignatureImg',
      title: '۲۔ دستخط وکیلِ دولہا',
      subtitle: formData.groom?.hasVakil && formData.groom?.vakilName ? `(${formData.groom.vakilName})` : '(اگر مقرر ہو)',
      badge: 'وکیل دولہا'
    },
    {
      key: 'brideSignatureImg',
      title: '۳۔ دستخط دلہن',
      subtitle: formData.bride?.name ? `(${formData.bride.name})` : '(دلہن خود)',
      badge: 'فریق دوم'
    },
    {
      key: 'brideVakilSignatureImg',
      title: '۴۔ دستخط وکیلِ دلہن',
      subtitle: formData.bride?.hasVakil && formData.bride?.vakilName ? `(${formData.bride.vakilName})` : '(اگر مقرر ہو)',
      badge: 'وکیل دلہن'
    },
    {
      key: 'shariWitness1SignatureImg',
      title: '۵۔ دستخط شرعی گواہ اول',
      subtitle: formData.witnessGroom1?.name ? `(${formData.witnessGroom1.name})` : '(شرعی گواہ اول)',
      badge: 'گواہ ۱'
    },
    {
      key: 'shariWitness2SignatureImg',
      title: '۶۔ دستخط شرعی گواہ دوم',
      subtitle: formData.witnessBride1?.name || formData.witnessGroom2?.name ? `(${formData.witnessBride1?.name || formData.witnessGroom2?.name})` : '(شرعی گواہ دوم)',
      badge: 'گواہ ۲'
    },
    {
      key: 'marriageWitness1SignatureImg',
      title: '۷۔ دستخط گواہِ شادی اول',
      subtitle: '(شادی / مجلس عقد گواہ ۱)',
      badge: 'شادی گواہ ۱'
    },
    {
      key: 'marriageWitness2SignatureImg',
      title: '۸۔ دستخط گواہِ شادی دوم',
      subtitle: '(شادی / مجلس عقد گواہ ۲)',
      badge: 'شادی گواہ ۲'
    },
    {
      key: 'nikkahKhawanSignatureImg',
      title: '۹۔ دستخط نکاح خواں',
      subtitle: formData.officiantType === 'guest' && formData.guestOfficiant?.name ? `(${formData.guestOfficiant.name})` : `(${profile?.name || 'نکاح خواں'})`,
      badge: 'نکاح خواں'
    },
    {
      key: 'registrarSealImg',
      title: '۱۰۔ مہر و دستخط رجسٹرار',
      subtitle: formData.registrar?.name || profile?.name ? `(${formData.registrar?.name || profile?.name})` : '(نکاح رجسٹرار)',
      badge: 'مہر رجسٹرار'
    }
  ];

  // فارم سبمٹ ہینڈلر
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!formData.serialNo) {
      alert('برائے مہربانی رجسٹریشن یا فارم نمبر ضرور درج کریں۔');
      setActiveStep(1);
      return;
    }

    if (!formData.groom?.name || !formData.bride?.name) {
      alert('برائے مہربانی دولہا اور دلہن کا نام ضرور درج کریں۔');
      setActiveStep(2);
      return;
    }

    // فولڈر ٹائٹل خودکار سنواریں
    const folderTitle = `${formData.serialNo} - ${formData.groom.name} و ${formData.bride.name}${formData.officiantType === 'guest' ? ' (مہمان نکاح خواں)' : ''}`;

    const groomData = {
      ...formData.groom,
      cnicImageFront: formData.vaultDocuments?.groomCnicFront || formData.groom?.cnicImageFront || null,
      cnicImageBack: formData.vaultDocuments?.groomCnicBack || formData.groom?.cnicImageBack || null
    };

    const brideData = {
      ...formData.bride,
      cnicImageFront: formData.vaultDocuments?.brideCnicFront || formData.bride?.cnicImageFront || null,
      cnicImageBack: formData.vaultDocuments?.brideCnicBack || formData.bride?.cnicImageBack || null
    };

    onSave({
      ...formData,
      groom: groomData,
      bride: brideData,
      folderTitle
    });
  };

  return (
    <div className="card">
      {/* ============================================================ */}
      {/* ہیڈر بار بمع ٹائٹل اور موڈ سوئچر                                */}
      {/* ============================================================ */}
      <div className="card-header-styled">
        <div className="card-title-with-icon">
          <FolderArchive size={26} color="var(--primary-700)" />
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {initialData ? `ترمیم نکاح نامہ: ${formData.serialNo}` : 'نیا نکاح نامہ اندراج (سرکاری ۲۵ خانے)'}
            </span>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              منظم، یکساں اور فیلڈز کو قطاروں میں سمیٹ کر بنایا گیا جدید انٹرفیس
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* موڈ ٹوگل بٹن */}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            onClick={() => setViewMode(viewMode === 'wizard' ? 'full_review' : 'wizard')}
          >
            <Layers size={15} />
            <span>{viewMode === 'wizard' ? 'مکمل جائزہ موڈ' : 'مرحلہ وار موڈ'}</span>
          </button>

          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <Save size={16} />
            <span>محفوظ کریں و پرنٹ دیکھیں</span>
          </button>

          <button type="button" className="btn-icon" onClick={onCancel} title="منسوخ کریں">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* لوڈنگ و کمپریشن بینر */}
      {compressing && (
        <div style={{ background: '#ecfdf5', color: '#065f46', padding: '8px 16px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #a7f3d0' }}>
          <Sparkles size={16} className="animate-spin" />
          <span>{compressionInfo}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* پانچ مرحلہ وار اسٹیپ بار (یکساں نیویگیشن)                        */}
      {/* ============================================================ */}
      {viewMode === 'wizard' && (
        <div className="wizard-stepper" style={{ marginBottom: '20px' }}>
          {FORM_STEPS.map((step) => {
            const isActive = activeStep === step.id;
            const isPassed = activeStep > step.id;
            return (
              <div 
                key={step.id} 
                className={`step-item ${isActive ? 'active' : ''} ${isPassed ? 'completed' : ''}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div 
                  className="step-bubble"
                  style={{
                    background: isActive ? 'var(--primary-700)' : (isPassed ? '#059669' : 'var(--bg-card)'),
                    color: isActive || isPassed ? '#ffffff' : 'var(--text-muted)',
                    borderColor: isActive ? 'var(--primary-700)' : (isPassed ? '#059669' : 'var(--border-color)')
                  }}
                >
                  {isPassed ? '✓' : step.id}
                </div>
                <div>
                  <div style={{ fontWeight: isActive ? 800 : 600, fontSize: '0.88rem', color: isActive ? 'var(--primary-900)' : 'var(--text-main)' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{step.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* فارم کنٹینر: اینٹر دبانے پر فارم سبمٹ نہ ہو */}
      <form 
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}
      >
        {/* ============================================================ */}
        {/* مرحلہ ۱: مقام، تاریخ و رجسٹریشن                              */}
        {/* ============================================================ */}
        {(viewMode === 'full_review' || activeStep === 1) && (
          <div style={{ marginBottom: '24px', background: 'var(--bg-card)', border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--primary-800)', margin: 0, fontSize: '1.1rem' }}>
                ۱۔ مقامِ انعقاد، تاریخ و رجسٹریشن کے کوائف
              </h3>
              <span className="badge badge-green">مرحلہ ۱ / ۵</span>
            </div>

            {/* سطر ۱: رجسٹریشن نمبر، یونین کونسل، وارڈ، ضلع و تحصیل (4 کالمز) */}
            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label required">رجسٹریشن / فارم نمبر</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="مثال: 145/26" 
                  value={formData.serialNo}
                  onChange={(e) => updateField('serialNo', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">یونین کونسل نمبر / نام</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="یونین کونسل نمبر ۱۰۴" 
                  value={formData.unionCouncil}
                  onChange={(e) => updateField('unionCouncil', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">وارڈ / دیہہ / قصبہ</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="وارڈ نمبر ۵، سبزہ زار" 
                  value={formData.wardVillage || ''}
                  onChange={(e) => updateField('wardVillage', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">تحصیل و ضلع</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="ضلع و تحصیل لاہور" 
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                />
              </div>
            </div>

            {/* سطر ۲: مقام انعقاد، تاریخ شمسی، تاریخ قمری، وقت (4 کالمز) */}
            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label">مقامِ انعقادِ نکاح</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="قصرِ نور بینکوئٹ ہال، لاہور" 
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">تاریخِ نکاح (شمسی)</label>
                <input 
                  type="date" 
                  className="form-input font-num" 
                  value={formData.nikkahDate}
                  onChange={(e) => {
                    const dateStr = e.target.value;
                    updateField('nikkahDate', dateStr);
                    updateField('hijriDate', getHijriDate(dateStr));
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">قمری / ہجری تاریخ</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="25 ربیع الثانی، 1448 ہجری" 
                  value={formData.hijriDate}
                  onChange={(e) => updateField('hijriDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">وقتِ نکاح</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="08:30 PM" 
                  value={formData.nikkahTime}
                  onChange={(e) => updateField('nikkahTime', e.target.value)}
                />
              </div>
            </div>

            {/* سطر ۳: فیس رجسٹریشن (طے شدہ و موقع پر وصول شدہ) */}
            <div className="form-row-3" style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div className="form-group">
                <label className="form-label">طے شدہ رجسٹریشن فیس</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="حسب معمول یا رقم مع /۔" 
                  value={formData.fee?.agreedAmount || ''}
                  onChange={(e) => updateNested('fee', 'agreedAmount', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">موقع پر وصول شدہ رقم</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="وصول شدہ رقم (مثلاً 5000)" 
                  value={formData.fee?.receivedAmount || ''}
                  onChange={(e) => updateNested('fee', 'receivedAmount', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">فوری فیس شارٹ کٹس</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['حسب معمول', 'حسب ضابطہ', '5,000/-', '10,000/-'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                      onClick={() => updateNested('fee', 'agreedAmount', tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* سطر ۴: نکاح خواں اور رجسٹرار کوائف */}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">نکاح کس نے پڑھایا؟</label>
                  <select 
                    className="form-select"
                    value={formData.officiantType}
                    onChange={(e) => updateField('officiantType', e.target.value)}
                  >
                    <option value="self">ذاتی (رجسٹرار نے خود پڑھایا)</option>
                    <option value="guest">مہمان / دیگر نکاح خواں نے پڑھایا</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">نکاح رجسٹرار کا نام و لائسنس</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    disabled 
                    value={`${profile?.name || 'مولانا قاری محمد اسماعیل صدیقی'} (لائسنس: ${profile?.licenseNo || 'NK-LHR-2024/89'})`}
                  />
                </div>
              </div>

              {formData.officiantType === 'guest' && (
                <div className="form-row-4" style={{ marginTop: '10px', background: '#fffbeb', padding: '10px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                  <div className="form-group">
                    <label className="form-label required">نام مہمان نکاح خواں</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="مولانا مفتی محمد احمد" 
                      value={formData.guestOfficiant?.name || ''}
                      onChange={(e) => updateNested('guestOfficiant', 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ولدیت نکاح خواں</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="حافظ بشیر احمد" 
                      value={formData.guestOfficiant?.fatherName || ''}
                      onChange={(e) => updateNested('guestOfficiant', 'fatherName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">جامع مسجد / علاقہ</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="جامع مسجد مدینہ، گلبرگ" 
                      value={formData.guestOfficiant?.masjidOrArea || ''}
                      onChange={(e) => updateNested('guestOfficiant', 'masjidOrArea', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رابطہ فون نمبر</label>
                    <input 
                      type="text" 
                      className="form-input font-num" 
                      placeholder="0300-xxxxxxx" 
                      value={formData.guestOfficiant?.phone || ''}
                      onChange={(e) => updateNested('guestOfficiant', 'phone', formatPhone(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* مرحلہ ۲: دولہا کے کوائف (Groom Details)                      */}
        {/* ============================================================ */}
        {(viewMode === 'full_review' || activeStep === 2) && (
          <div style={{ marginBottom: '24px', background: 'var(--bg-card)', border: '1.5px solid var(--primary-400)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--primary-800)', margin: 0, fontSize: '1.1rem' }}>
                ۲۔ دولہا کے کوائف
              </h3>
              <span className="badge badge-green">مرحلہ ۲ / ۵</span>
            </div>

            {/* سطر ۱: دولہا بنیادی معلومات (4 کالمز میں سمٹی ہوئی) */}
            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label required">نام دولہا</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="محمد عثمان علی" 
                  value={formData.groom.name}
                  onChange={(e) => updateNested('groom', 'name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">ولدیت دولہا</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="چوہدری لیاقت علی" 
                  value={formData.groom.fatherName}
                  onChange={(e) => updateNested('groom', 'fatherName', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">شناختی کارڈ دولہا</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="35202-xxxxxxx-x" 
                  value={formData.groom.cnic}
                  onChange={(e) => updateNested('groom', 'cnic', formatCNIC(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">رابطہ فون نمبر دولہا</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="0300-xxxxxxx" 
                  value={formData.groom.phone}
                  onChange={(e) => updateNested('groom', 'phone', formatPhone(e.target.value))}
                />
              </div>
            </div>

            {/* سطر ۲: تاریخِ پیدائش، عمر سالوں میں، حیثیت، سکونت (4 کالمز) */}
            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={14} color="var(--primary-700)" />
                  <span>تاریخِ پیدائش (کلنڈر)</span>
                </label>
                <input 
                  type="date" 
                  className="form-input font-num" 
                  value={formData.groom.dob || ''}
                  onChange={(e) => {
                    const dob = e.target.value;
                    updateNested('groom', 'dob', dob);
                    const computed = calculateAgeFromDob(dob);
                    if (computed) updateNested('groom', 'age', computed);
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">عمر سالوں میں</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="مثال: 28" 
                  value={formData.groom.age}
                  onChange={(e) => updateNested('groom', 'age', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ازدواجی حیثیت</label>
                <select 
                  className="form-select"
                  value={formData.groom.maritalStatus}
                  onChange={(e) => updateNested('groom', 'maritalStatus', e.target.value)}
                >
                  <option value="کنوارا">کنوارا</option>
                  <option value="رانڈ / بیوہ">رانڈ / بیوہ</option>
                  <option value="طلاق یافتہ">طلاق یافتہ</option>
                  <option value="شادی شدہ (دوسری شادی)">شادی شدہ (دوسری شادی)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">رہائشی پتہ / سکونت</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="مکان 45، سبزہ زار، لاہور" 
                  value={formData.groom.address}
                  onChange={(e) => updateNested('groom', 'address', e.target.value)}
                />
              </div>
            </div>

            {/* وکیلِ دولہا کا بلاک */}
            <div style={{ marginTop: '14px', background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--primary-800)' }}>
                  وکیلِ دولہا و تقرری:
                </strong>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.84rem' }}>
                    <input 
                      type="radio" 
                      name="groomVakilToggle"
                      checked={!formData.groom?.hasVakil}
                      onChange={() => updateNested('groom', 'hasVakil', false)}
                    />
                    <span style={{ fontWeight: !formData.groom?.hasVakil ? 700 : 400, color: '#15803d' }}>
                      ✓ دولہا خود حاضر مجلس ہے (وکیل کی حاجت نہیں)
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.84rem' }}>
                    <input 
                      type="radio" 
                      name="groomVakilToggle"
                      checked={Boolean(formData.groom?.hasVakil)}
                      onChange={() => updateNested('groom', 'hasVakil', true)}
                    />
                    <span style={{ fontWeight: formData.groom?.hasVakil ? 700 : 400 }}>
                      وکیل کے ذریعے ایجاب و قبول
                    </span>
                  </label>
                </div>
              </div>

              {formData.groom?.hasVakil && (
                <>
                  <div className="form-row-4">
                    <div className="form-group">
                      <label className="form-label required">نام وکیلِ دولہا</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="طارق محمود" 
                        value={formData.groom?.vakilName || ''}
                        onChange={(e) => updateNested('groom', 'vakilName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ولدیت وکیل</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="عبدالرشید" 
                        value={formData.groom?.vakilFatherName || ''}
                        onChange={(e) => updateNested('groom', 'vakilFatherName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">شناختی کارڈ وکیل</label>
                      <input 
                        type="text" 
                        className="form-input font-num" 
                        placeholder="35201-xxxxxxx-x" 
                        value={formData.groom?.vakilCnic || ''}
                        onChange={(e) => updateNested('groom', 'vakilCnic', formatCNIC(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">رابطہ فون وکیل</label>
                      <input 
                        type="text" 
                        className="form-input font-num" 
                        placeholder="0301-xxxxxxx" 
                        value={formData.groom?.vakilPhone || ''}
                        onChange={(e) => updateNested('groom', 'vakilPhone', formatPhone(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="form-row-1">
                    <div className="form-group">
                      <label className="form-label">سکونت / پتہ وکیلِ دولہا</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="سبزہ زار، لاہور" 
                        value={formData.groom?.vakilAddress || ''}
                        onChange={(e) => updateNested('groom', 'vakilAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* وکیل مقرر کرنے کے گواہان (اختیاری سیکشن) */}
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                        <input 
                          type="checkbox"
                          checked={Boolean(formData.groom?.hasVakilWitnesses)}
                          onChange={(e) => updateNested('groom', 'hasVakilWitnesses', e.target.checked)}
                        />
                        <span>کیا وکیل مقرر کرنے کے گواہان درج کرنے ہیں؟ (اختیاری)</span>
                      </label>
                    </div>

                    {formData.groom?.hasVakilWitnesses && (
                      <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '6px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          دولہا کی جانب سے وکیل مقرر کیے جانے کے دو گواہان:
                        </div>
                        {/* گواہ ۱ برائے تقرر وکیل */}
                        <div className="form-row-4" style={{ marginBottom: '8px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>نام گواہ اول تقررِ وکیل</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="محمد بلال"
                              value={formData.groom?.vakilWitness1?.name || ''}
                              onChange={(e) => {
                                const w = { ...(formData.groom?.vakilWitness1 || {}), name: e.target.value };
                                updateNested('groom', 'vakilWitness1', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>ولدیت</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="رشید احمد"
                              value={formData.groom?.vakilWitness1?.fatherName || ''}
                              onChange={(e) => {
                                const w = { ...(formData.groom?.vakilWitness1 || {}), fatherName: e.target.value };
                                updateNested('groom', 'vakilWitness1', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>شناختی کارڈ</label>
                            <input 
                              type="text" 
                              className="form-input font-num" 
                              placeholder="35201-xxxxxxx-x"
                              value={formData.groom?.vakilWitness1?.cnic || ''}
                              onChange={(e) => {
                                const w = { ...(formData.groom?.vakilWitness1 || {}), cnic: formatCNIC(e.target.value) };
                                updateNested('groom', 'vakilWitness1', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>سکونت / پتہ</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="لاہور"
                              value={formData.groom?.vakilWitness1?.address || ''}
                              onChange={(e) => {
                                const w = { ...(formData.groom?.vakilWitness1 || {}), address: e.target.value };
                                updateNested('groom', 'vakilWitness1', w);
                              }}
                            />
                          </div>
                        </div>

                        {/* گواہ ۲ برائے تقرر وکیل */}
                        <div className="form-row-4">
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>نام گواہ دوم تقررِ وکیل</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="کاشف علی"
                              value={formData.groom?.vakilWitness2?.name || ''}
                              onChange={(e) => {
                                const w = { ...(formData.groom?.vakilWitness2 || {}), name: e.target.value };
                                updateNested('groom', 'vakilWitness2', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>ولدیت</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="انور علی"
                              value={formData.groom?.vakilWitness2?.fatherName || ''}
                              onChange={(e) => {
                                const w = { ...(formData.groom?.vakilWitness2 || {}), fatherName: e.target.value };
                                updateNested('groom', 'vakilWitness2', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>شناختی کارڈ</label>
                            <input 
                              type="text" 
                              className="form-input font-num" 
                              placeholder="35201-xxxxxxx-x"
                              value={formData.groom?.vakilWitness2?.cnic || ''}
                              onChange={(e) => {
                                const w = { ...(formData.groom?.vakilWitness2 || {}), cnic: formatCNIC(e.target.value) };
                                updateNested('groom', 'vakilWitness2', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>سکونت / پتہ</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="لاہور"
                              value={formData.groom?.vakilWitness2?.address || ''}
                              onChange={(e) => {
                                const w = { ...(formData.groom?.vakilWitness2 || {}), address: e.target.value };
                                updateNested('groom', 'vakilWitness2', w);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* مرحلہ ۳: دلہن کے کوائف (Bride Details)                       */}
        {/* ============================================================ */}
        {(viewMode === 'full_review' || activeStep === 3) && (
          <div style={{ marginBottom: '24px', background: 'var(--bg-card)', border: '1.5px solid var(--gold-400)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--gold-700)', margin: 0, fontSize: '1.1rem' }}>
                ۳۔ دلہن کے کوائف
              </h3>
              <span className="badge badge-gold">مرحلہ ۳ / ۵</span>
            </div>

            {/* سطر ۱: دلہن بنیادی معلومات (4 کالمز میں سمٹی ہوئی) */}
            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label required">نام دلہن</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="فاطمہ زہرا" 
                  value={formData.bride.name}
                  onChange={(e) => updateNested('bride', 'name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">ولدیت دلہن</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="میاں خادم حسین" 
                  value={formData.bride.fatherName}
                  onChange={(e) => updateNested('bride', 'fatherName', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">شناختی کارڈ دلہن</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="35201-xxxxxxx-x" 
                  value={formData.bride.cnic}
                  onChange={(e) => updateNested('bride', 'cnic', formatCNIC(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">رابطہ فون نمبر دلہن / سرپرست</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="0321-xxxxxxx" 
                  value={formData.bride.phone}
                  onChange={(e) => updateNested('bride', 'phone', formatPhone(e.target.value))}
                />
              </div>
            </div>

            {/* سطر ۲: تاریخِ پیدائش، عمر سالوں میں، حیثیت، سکونت (4 کالمز) */}
            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={14} color="var(--gold-700)" />
                  <span>تاریخِ پیدائش (کلنڈر)</span>
                </label>
                <input 
                  type="date" 
                  className="form-input font-num" 
                  value={formData.bride.dob || ''}
                  onChange={(e) => {
                    const dob = e.target.value;
                    updateNested('bride', 'dob', dob);
                    const computed = calculateAgeFromDob(dob);
                    if (computed) updateNested('bride', 'age', computed);
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">عمر سالوں میں</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="مثال: 25" 
                  value={formData.bride.age}
                  onChange={(e) => updateNested('bride', 'age', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">حیثیت دلہن (باکرہ / بیوہ / مطلقہ)</label>
                <select 
                  className="form-select"
                  value={formData.bride.maritalStatus}
                  onChange={(e) => updateNested('bride', 'maritalStatus', e.target.value)}
                >
                  <option value="کنواری">کنواری (باکرہ)</option>
                  <option value="بیوہ">بیوہ (ثیبہ)</option>
                  <option value="مطلقہ">مطلقہ (ثیبہ)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">رہائشی پتہ / سکونت</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="اسلام پورہ، لاہور" 
                  value={formData.bride.address}
                  onChange={(e) => updateNested('bride', 'address', e.target.value)}
                />
              </div>
            </div>

            {/* وکیلِ دلہن کا بلاک */}
            <div style={{ marginTop: '14px', background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--gold-700)' }}>
                  وکیلِ دلہن و تقرری:
                </strong>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.84rem' }}>
                    <input 
                      type="radio" 
                      name="brideVakilToggle"
                      checked={!formData.bride?.hasVakil}
                      onChange={() => updateNested('bride', 'hasVakil', false)}
                    />
                    <span style={{ fontWeight: !formData.bride?.hasVakil ? 700 : 400, color: '#15803d' }}>
                      ✓ دلہن خود حاضر مجلس ہے (وکیل کی حاجت نہیں)
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.84rem' }}>
                    <input 
                      type="radio" 
                      name="brideVakilToggle"
                      checked={Boolean(formData.bride?.hasVakil)}
                      onChange={() => updateNested('bride', 'hasVakil', true)}
                    />
                    <span style={{ fontWeight: formData.bride?.hasVakil ? 700 : 400 }}>
                      وکیل کے ذریعے ایجاب و قبول
                    </span>
                  </label>
                </div>
              </div>

              {formData.bride?.hasVakil && (
                <>
                  <div className="form-row-4">
                    <div className="form-group">
                      <label className="form-label required">نام وکیلِ دلہن</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="محمد ارشد" 
                        value={formData.bride?.vakilName || ''}
                        onChange={(e) => updateNested('bride', 'vakilName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ولدیت وکیل</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="میاں خادم حسین" 
                        value={formData.bride?.vakilFatherName || ''}
                        onChange={(e) => updateNested('bride', 'vakilFatherName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">شناختی کارڈ وکیل</label>
                      <input 
                        type="text" 
                        className="form-input font-num" 
                        placeholder="35201-xxxxxxx-x" 
                        value={formData.bride?.vakilCnic || ''}
                        onChange={(e) => updateNested('bride', 'vakilCnic', formatCNIC(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">رابطہ فون وکیل</label>
                      <input 
                        type="text" 
                        className="form-input font-num" 
                        placeholder="0322-xxxxxxx" 
                        value={formData.bride?.vakilPhone || ''}
                        onChange={(e) => updateNested('bride', 'vakilPhone', formatPhone(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="form-row-1">
                    <div className="form-group">
                      <label className="form-label">سکونت / پتہ وکیلِ دلہن</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="اسلام پورہ، لاہور" 
                        value={formData.bride?.vakilAddress || ''}
                        onChange={(e) => updateNested('bride', 'vakilAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* وکیل مقرر کرنے کے گواہان (اختیاری سیکشن) */}
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 700, color: 'var(--gold-700)' }}>
                        <input 
                          type="checkbox"
                          checked={Boolean(formData.bride?.hasVakilWitnesses)}
                          onChange={(e) => updateNested('bride', 'hasVakilWitnesses', e.target.checked)}
                        />
                        <span>کیا وکیل مقرر کرنے کے گواہان درج کرنے ہیں؟ (اختیاری)</span>
                      </label>
                    </div>

                    {formData.bride?.hasVakilWitnesses && (
                      <div style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '6px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          دلہن کی جانب سے وکیل مقرر کیے جانے کے دو گواہان:
                        </div>
                        {/* گواہ ۱ برائے تقرر وکیل */}
                        <div className="form-row-4" style={{ marginBottom: '8px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>نام گواہ اول تقررِ وکیل</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="سید زوار شاہ"
                              value={formData.bride?.vakilWitness1?.name || ''}
                              onChange={(e) => {
                                const w = { ...(formData.bride?.vakilWitness1 || {}), name: e.target.value };
                                updateNested('bride', 'vakilWitness1', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>ولدیت</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="سید علی شاہ"
                              value={formData.bride?.vakilWitness1?.fatherName || ''}
                              onChange={(e) => {
                                const w = { ...(formData.bride?.vakilWitness1 || {}), fatherName: e.target.value };
                                updateNested('bride', 'vakilWitness1', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>شناختی کارڈ</label>
                            <input 
                              type="text" 
                              className="form-input font-num" 
                              placeholder="35202-xxxxxxx-x"
                              value={formData.bride?.vakilWitness1?.cnic || ''}
                              onChange={(e) => {
                                const w = { ...(formData.bride?.vakilWitness1 || {}), cnic: formatCNIC(e.target.value) };
                                updateNested('bride', 'vakilWitness1', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>سکونت / پتہ</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="لاہور"
                              value={formData.bride?.vakilWitness1?.address || ''}
                              onChange={(e) => {
                                const w = { ...(formData.bride?.vakilWitness1 || {}), address: e.target.value };
                                updateNested('bride', 'vakilWitness1', w);
                              }}
                            />
                          </div>
                        </div>

                        {/* گواہ ۲ برائے تقرر وکیل */}
                        <div className="form-row-4">
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>نام گواہ دوم تقررِ وکیل</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="کامران یوسف"
                              value={formData.bride?.vakilWitness2?.name || ''}
                              onChange={(e) => {
                                const w = { ...(formData.bride?.vakilWitness2 || {}), name: e.target.value };
                                updateNested('bride', 'vakilWitness2', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>ولدیت</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="محمد یوسف"
                              value={formData.bride?.vakilWitness2?.fatherName || ''}
                              onChange={(e) => {
                                const w = { ...(formData.bride?.vakilWitness2 || {}), fatherName: e.target.value };
                                updateNested('bride', 'vakilWitness2', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>شناختی کارڈ</label>
                            <input 
                              type="text" 
                              className="form-input font-num" 
                              placeholder="35201-xxxxxxx-x"
                              value={formData.bride?.vakilWitness2?.cnic || ''}
                              onChange={(e) => {
                                const w = { ...(formData.bride?.vakilWitness2 || {}), cnic: formatCNIC(e.target.value) };
                                updateNested('bride', 'vakilWitness2', w);
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>سکونت / پتہ</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="لاہور"
                              value={formData.bride?.vakilWitness2?.address || ''}
                              onChange={(e) => {
                                const w = { ...(formData.bride?.vakilWitness2 || {}), address: e.target.value };
                                updateNested('bride', 'vakilWitness2', w);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* مرحلہ ۴: نکاح، شرعی گواہان، حق مہر و شرائط                    */}
        {/* ============================================================ */}
        {(viewMode === 'full_review' || activeStep === 4) && (
          <div style={{ marginBottom: '24px', background: 'var(--bg-card)', border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--primary-800)', margin: 0, fontSize: '1.1rem' }}>
                ۴۔ شرعی گواہان، حق مہر و شرائطِ نکاح
              </h3>
              <span className="badge badge-green">مرحلہ ۴ / ۵</span>
            </div>

            {/* بخش ۱: شرعی گواہانِ نکاح (۲ معتبر گواہ) */}
            <div style={{ marginBottom: '20px', background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '10px', border: '1.5px solid var(--primary-300)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary-900)', fontSize: '1.02rem', fontWeight: 800 }}>
                    شرعی گواہانِ نکاح (۲ معتبر گواہ):
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    عقدِ نکاح کے شرعی نفاذ کے لیے دو عاقل و بالغ گواہان (دولہا یا دلہن کی طرف سے مخصوص ہونا ضروری نہیں)
                  </div>
                </div>
                <span className="badge badge-green">۲ شرعی گواہ لازمی</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {/* شرعی گواہ اول */}
                <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-800)', marginBottom: '8px' }}>
                    ۱۔ شرعی گواہ اول:
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label required">نام گواہ اول</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="عبدالرحمٰن بٹ" 
                        value={formData.witnessGroom1?.name || ''}
                        onChange={(e) => updateNested('witnessGroom1', 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">ولدیت گواہ اول</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="محمد اسلم بٹ" 
                        value={formData.witnessGroom1?.fatherName || ''}
                        onChange={(e) => updateNested('witnessGroom1', 'fatherName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">شناختی کارڈ گواہ اول</label>
                      <input 
                        type="text" 
                        className="form-input font-num" 
                        placeholder="35202-xxxxxxx-x" 
                        value={formData.witnessGroom1?.cnic || ''}
                        onChange={(e) => updateNested('witnessGroom1', 'cnic', formatCNIC(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">رابطہ فون نمبر</label>
                      <input 
                        type="text" 
                        className="form-input font-num" 
                        placeholder="0300-xxxxxxx" 
                        value={formData.witnessGroom1?.phone || ''}
                        onChange={(e) => updateNested('witnessGroom1', 'phone', formatPhone(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">سکونت و پتہ گواہ اول</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="ماڈل ٹاؤن، لاہور" 
                      value={formData.witnessGroom1?.address || ''}
                      onChange={(e) => updateNested('witnessGroom1', 'address', e.target.value)}
                    />
                  </div>
                </div>

                {/* شرعی گواہ دوم */}
                <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-800)', marginBottom: '8px' }}>
                    ۲۔ شرعی گواہ دوم:
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label required">نام گواہ دوم</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="سید زوار شاہ" 
                        value={formData.witnessBride1?.name || ''}
                        onChange={(e) => updateNested('witnessBride1', 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">ولدیت گواہ دوم</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="سید علی شاہ" 
                        value={formData.witnessBride1?.fatherName || ''}
                        onChange={(e) => updateNested('witnessBride1', 'fatherName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">شناختی کارڈ گواہ دوم</label>
                      <input 
                        type="text" 
                        className="form-input font-num" 
                        placeholder="35202-xxxxxxx-x" 
                        value={formData.witnessBride1?.cnic || ''}
                        onChange={(e) => updateNested('witnessBride1', 'cnic', formatCNIC(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">رابطہ فون نمبر</label>
                      <input 
                        type="text" 
                        className="form-input font-num" 
                        placeholder="0300-xxxxxxx" 
                        value={formData.witnessBride1?.phone || ''}
                        onChange={(e) => updateNested('witnessBride1', 'phone', formatPhone(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">سکونت و پتہ گواہ دوم</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="مسلم ٹاؤن، لاہور" 
                      value={formData.witnessBride1?.address || ''}
                      onChange={(e) => updateNested('witnessBride1', 'address', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* بخش ۲: حق مہر، طلائی زیورات و شرائط */}
            <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--primary-900)', marginBottom: '10px' }}>
              حق مہر و شرائطِ عقد:
            </div>

            {/* سطر ۱: کل رقم مہر، لفظوں میں، سونا/جائیداد (3 کالمز) */}
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label required">کل رقم حق مہر</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="500,000/- یا تفصیل" 
                  value={formData.mehr?.totalAmount || ''}
                  onChange={(e) => updateNested('mehr', 'totalAmount', e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {['/-', 'تقریباً', 'پانچ لاکھ روپے', 'دس لاکھ روپے'].map(t => (
                    <button key={t} type="button" className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '2px 6px' }} onClick={() => updateNested('mehr', 'totalAmount', (formData.mehr?.totalAmount || '') + ' ' + t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">مہر کی رقم لفظوں میں</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="پانچ لاکھ روپے فقط" 
                  value={formData.mehr?.totalAmountWords || ''}
                  onChange={(e) => updateNested('mehr', 'totalAmountWords', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">طلائی زیورات / جائیداد و دیگر مہر</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="پانچ تولہ طلائی زیورات یا جائیداد" 
                  value={formData.mehr?.goldWeight || ''}
                  onChange={(e) => updateNested('mehr', 'goldWeight', e.target.value)}
                />
              </div>
            </div>

            {/* سطر ۲: مہر معجل، مہر مؤجل، موقع پر ادائیگی (3 کالمز) */}
            <div className="form-row-3" style={{ marginTop: '12px', background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div className="form-group">
                <label className="form-label">مہر معجل (نقد فوری ادا شدہ)</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="کل معجل یا 200,000/-" 
                  value={formData.mehr?.muajjal || ''}
                  onChange={(e) => updateNested('mehr', 'muajjal', e.target.value)}
                />
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {['کل معجل', 'نصف معجل', 'موقع پر ادا'].map(t => (
                    <button key={t} type="button" className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '2px 6px' }} onClick={() => updateNested('mehr', 'muajjal', t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">مہر مؤجل (واجب الادا عند الطلب)</label>
                <input 
                  type="text" 
                  className="form-input font-num" 
                  placeholder="کل غیر معجل یا 300,000/-" 
                  value={formData.mehr?.muwajjal || ''}
                  onChange={(e) => updateNested('mehr', 'muwajjal', e.target.value)}
                />
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {['کل غیر معجل', 'عند الطلب', 'صفر'].map(t => (
                    <button key={t} type="button" className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '2px 6px' }} onClick={() => updateNested('mehr', 'muwajjal', t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">موقع پر ادا شدہ مہر</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="موقع پر ادا شدہ" 
                  value={formData.mehr?.paidAtNikkah || ''}
                  onChange={(e) => updateNested('mehr', 'paidAtNikkah', e.target.value)}
                />
              </div>
            </div>

            {/* سطر ۳: خصوصی شرائط و دستاویزات (2 کالمز) */}
            <div className="form-row-2" style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">خصوصی شرائطِ نکاح</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="نان نفقہ اور رہائش کا بندوبست" 
                  value={formData.mehr?.specialConditions || ''}
                  onChange={(e) => updateNested('mehr', 'specialConditions', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">دستاویزات بابت مہر و نفقہ</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="رسید مہر الگ سے تیار کی گئی ہے۔" 
                  value={formData.mehr?.dowerDocs || ''}
                  onChange={(e) => updateNested('mehr', 'dowerDocs', e.target.value)}
                />
              </div>
            </div>

            {/* سطر ۴: طلاق تفویض، پابندی، سابقہ بیوی (3 کالمز) */}
            <div className="form-row-3" style={{ marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">تفویضِ طلاق (خاوند نے بیوی کو حق دیا؟)</label>
                <select 
                  className="form-select"
                  value={formData.mehr?.delegatedDivorce}
                  onChange={(e) => updateNested('mehr', 'delegatedDivorce', e.target.value)}
                >
                  <option value="نہیں">نہیں</option>
                  <option value="ہاں">ہاں (تفویض کیا گیا)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">شوہر کے حقِ طلاق پر کوئی شرائط؟</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="کوئی نہیں" 
                  value={formData.mehr?.husbandRestrictions || ''}
                  onChange={(e) => updateNested('mehr', 'husbandRestrictions', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">سابقہ بیوی / ثالثی کونسل کی اجازت</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="نہیں / اجازت نمبر" 
                  value={formData.mehr?.existingWives || ''}
                  onChange={(e) => updateNested('mehr', 'existingWives', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* مرحلہ ۵: سکیننگ، دستخط و دستاویزات ہب (یکجا شدہ سنٹرل مقام)      */}
        {/* ============================================================ */}
        {(viewMode === 'full_review' || activeStep === 5) && (
          <div style={{ marginBottom: '24px', background: 'var(--bg-card)', border: '2px solid var(--primary-600)', borderRadius: '12px', padding: '18px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'var(--primary-800)', margin: 0, fontSize: '1.15rem' }}>
                  ۵۔ سکیننگ، دستخط و مہر جات ہب (Signatures & Documents Vault)
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  💡 تمام دستخط شفاف (Transparent PNG) محفوظ ہوتے ہیں تاکہ پرنٹ پر الفاظ یا لکیروں کے اوپر بھی صاف نظر آئیں۔
                </div>
              </div>
              <span className="badge badge-green">مرحلہ ۵ / ۵ (حتمی)</span>
            </div>

            {/* بخش ۱: شناختی کارڈز سکیننگ (دولہا و دلہن) */}
            <div style={{ marginBottom: '20px', background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--primary-900)', marginBottom: '10px' }}>
                الف: شناختی کارڈز (CNIC Front & Back):
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {/* دولہا فرنٹ */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-card)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '6px' }}>
                    دولہا شناختی کارڈ (فرنٹ)
                  </div>
                  {formData.vaultDocuments?.groomCnicFront ? (
                    <div>
                      <img src={formData.vaultDocuments.groomCnicFront} alt="Groom CNIC Front" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} />
                      <button type="button" className="btn btn-danger" style={{ padding: '2px 8px', fontSize: '0.72rem' }} onClick={() => handleRemoveCnic('groomCnicFront')}>
                        <Trash2 size={12} /> ہٹائیں
                      </button>
                    </div>
                  ) : (
                    <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <Camera size={14} /> اپلوڈ فرنٹ
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCnicUpload('groomCnicFront', e.target.files?.[0])} />
                    </label>
                  )}
                </div>

                {/* دولہا بیک */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-card)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '6px' }}>
                    دولہا شناختی کارڈ (بیک)
                  </div>
                  {formData.vaultDocuments?.groomCnicBack ? (
                    <div>
                      <img src={formData.vaultDocuments.groomCnicBack} alt="Groom CNIC Back" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} />
                      <button type="button" className="btn btn-danger" style={{ padding: '2px 8px', fontSize: '0.72rem' }} onClick={() => handleRemoveCnic('groomCnicBack')}>
                        <Trash2 size={12} /> ہٹائیں
                      </button>
                    </div>
                  ) : (
                    <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <Camera size={14} /> اپلوڈ بیک
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCnicUpload('groomCnicBack', e.target.files?.[0])} />
                    </label>
                  )}
                </div>

                {/* دلہن فرنٹ */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-card)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-700)', marginBottom: '6px' }}>
                    دلہن شناختی کارڈ (فرنٹ)
                  </div>
                  {formData.vaultDocuments?.brideCnicFront ? (
                    <div>
                      <img src={formData.vaultDocuments.brideCnicFront} alt="Bride CNIC Front" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} />
                      <button type="button" className="btn btn-danger" style={{ padding: '2px 8px', fontSize: '0.72rem' }} onClick={() => handleRemoveCnic('brideCnicFront')}>
                        <Trash2 size={12} /> ہٹائیں
                      </button>
                    </div>
                  ) : (
                    <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <Camera size={14} /> اپلوڈ فرنٹ
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCnicUpload('brideCnicFront', e.target.files?.[0])} />
                    </label>
                  )}
                </div>

                {/* دلہن بیک */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-card)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-700)', marginBottom: '6px' }}>
                    دلہن شناختی کارڈ (بیک)
                  </div>
                  {formData.vaultDocuments?.brideCnicBack ? (
                    <div>
                      <img src={formData.vaultDocuments.brideCnicBack} alt="Bride CNIC Back" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} />
                      <button type="button" className="btn btn-danger" style={{ padding: '2px 8px', fontSize: '0.72rem' }} onClick={() => handleRemoveCnic('brideCnicBack')}>
                        <Trash2 size={12} /> ہٹائیں
                      </button>
                    </div>
                  ) : (
                    <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <Camera size={14} /> اپلوڈ بیک
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCnicUpload('brideCnicBack', e.target.files?.[0])} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* بخش ۲: تمام ۱۰ باضابطہ دستخط و مہر جات مع آٹو ٹرانسپیرنسی */}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--primary-900)', marginBottom: '10px' }}>
                ب: دستخط، انگوٹھا جات و مہر رجسٹرار (کل ۱۰ خانے):
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {SIGNATURE_SLOTS.map((slot) => {
                  const img = formData.columnSignatures?.[slot.key];
                  return (
                    <div 
                      key={slot.key}
                      style={{
                        border: '1.5px dashed var(--border-color)',
                        borderRadius: '10px',
                        padding: '12px',
                        background: 'var(--bg-card)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '135px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--primary-800)' }}>{slot.title}</strong>
                          <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>{slot.badge}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{slot.subtitle}</div>
                      </div>

                      {img ? (
                        <div style={{ margin: '8px 0', background: 'rgba(0,0,0,0.02)', padding: '6px', borderRadius: '6px' }}>
                          <img 
                            src={img} 
                            alt={slot.title} 
                            style={{ maxHeight: '45px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} 
                          />
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                            <button 
                              type="button" 
                              className="btn btn-danger" 
                              style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                              onClick={() => handleRemoveSignature(slot.key)}
                            >
                              <Trash2 size={12} /> ہٹائیں
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ margin: '10px 0' }}>
                          <label className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 10px', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Camera size={14} />
                            <span>اپلوڈ دستخط / مہر</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={(e) => handleSignatureUpload(slot.key, e.target.files?.[0])}
                            />
                          </label>
                        </div>
                      )}

                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {img ? '✓ شفاف پس منظر محفوظ' : '(خالی چھوڑنے پر پرنٹ بعد دستی دستخط)'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* نیچے نیویگیشن بٹنز (Previous, Next, Save)                     */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '14px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            {viewMode === 'wizard' && activeStep > 1 && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                <ArrowRight size={16} />
                <span>پچھلا مرحلہ ({FORM_STEPS[activeStep - 2]?.title})</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {viewMode === 'wizard' && activeStep < 5 && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setActiveStep(activeStep + 1)}
              >
                <span>اگلا مرحلہ ({FORM_STEPS[activeStep]?.title})</span>
                <ArrowLeft size={16} />
              </button>
            )}

            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>نکاح نامہ محفوظ کریں و ۴ پرت دیکھیں</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
