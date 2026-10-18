import React, { useState } from 'react';
import { Printer, X, Download, ShieldCheck, Heart, Layers, Check } from 'lucide-react';
import { formatPKDate, getHijriDate } from '../utils/dateUtils';

// چاروں سرکاری پرتوں کی تفصیلات
const COPIES = [
  { id: 'copy1', title: 'اصل', sub: 'برائے یونین کونسل / دلہن ریکارڈ' },
  { id: 'copy2', title: 'دوسرا پرت', sub: 'برائے دولہا' },
  { id: 'copy3', title: 'تیسرا پرت', sub: 'برائے دلہن' },
  { id: 'copy4', title: 'چوتھا پرت', sub: 'برائے نکاح رجسٹرار ریکارڈ' }
];

export default function PrintCertificateModal({ record, onClose, profile }) {
  if (!record) return null;

  // منتخب پرت: 'all' (چاروں پرت ایک ساتھ) یا 'copy1', 'copy2', 'copy3', 'copy4'
  const [selectedCopy, setSelectedCopy] = useState('all');

  const handlePrint = () => {
    window.print();
  };

  const hijriStr = record.hijriDate || getHijriDate(record.nikkahDate);

  // محفوظ طریقے سے رقم یا اردو ٹیکسٹ فارمیٹ کرنے کا فنکشن
  const formatMoneyOrText = (val) => {
    if (val === undefined || val === null || val === '') return '-';
    const str = String(val).trim();
    if (/^\d+$/.test(str)) {
      return `${Number(str).toLocaleString()} روپے`;
    }
    return str;
  };

  // نکاح خواں کی معلومات
  const officiantName = record.officiantType === 'guest' && record.guestOfficiant?.name
    ? record.guestOfficiant.name
    : (profile?.name || 'مولانا قاری محمد اسماعیل صدیقی');

  const officiantDetails = record.officiantType === 'guest' && record.guestOfficiant?.name
    ? `${record.guestOfficiant.name} ولد ${record.guestOfficiant.fatherName || '-'} (${record.guestOfficiant.masjidOrArea || '-'}) فون: ${record.guestOfficiant.phone || '-'}`
    : `${profile?.name || 'مولانا قاری محمد اسماعیل صدیقی'} (لائسنس: ${profile?.licenseNo || 'NK-LHR-2024/89'}) - ${profile?.officeAddress || 'لاہور'}`;

  // نکاح رجسٹرار کی معلومات
  const registrarDetails = `${record.registrar?.name || profile?.name || 'مولانا قاری محمد اسماعیل صدیقی'} ولد ${record.registrar?.fatherName || profile?.fatherName || '-'} (لائسنس: ${record.registrar?.licenseNo || profile?.licenseNo || 'NK-LHR-2024/89'}, وارڈ/UC: ${record.registrar?.wardOrUc || profile?.wardOrUc || '-'})`;

  // سنگل پرت کارڈ بنانے کا فنکشن
  const renderSingleCopy = (copyItem, index) => {
    const signs = record.columnSignatures || {};

    return (
      <div 
        key={copyItem.id} 
        className="printable-certificate" 
        style={{ 
          marginBottom: selectedCopy === 'all' && index < 3 ? '40px' : '0',
          pageBreakAfter: selectedCopy === 'all' && index < 3 ? 'always' : 'auto'
        }}
      >
        <div className="certificate-inner-border">
          
          {/* ============================================================ */}
          {/* سب سے اوپر بالکل درمیان میں جلی سنہری عنوان (اصل / دوسرا پرت وغیرہ) */}
          {/* ============================================================ */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span 
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #064e3b, #047857)',
                color: '#ffffff',
                padding: '6px 36px',
                borderRadius: '24px',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '1px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                border: '2px solid #fbbf24'
              }}
            >
              {copyItem.title}
            </span>
            <div style={{ fontSize: '0.78rem', color: '#4b5563', marginTop: '3px' }}>
              ({copyItem.sub})
            </div>
          </div>

          {/* اسلامی خطاطی اور ہیڈر */}
          <div className="certificate-header-islamic">
            <div className="bismillah-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <div style={{ fontSize: '0.88rem', color: '#064e3b', marginBottom: '4px', fontStyle: 'italic' }}>
              "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
            </div>
            <div className="cert-main-title" style={{ fontSize: '1.35rem', margin: '4px 0' }}>
              نکاح نامہ (فارم دوم)
            </div>
            <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>
              (زیر دفعہ ۵ مسلم فیملی لاز آرڈیننس ۱۹۶۱ء و قواعد ۸، ۹ مسلم فیملی لاز مجریہ ۱۹۶۱ء)
            </div>
          </div>

          {/* رجسٹریشن تفصیلات بار */}
          <div className="cert-meta-row" style={{ padding: '8px 12px', margin: '8px 0 12px', fontSize: '0.88rem' }}>
            <div>
              رجسٹریشن نمبر: <strong className="font-num" style={{ color: '#064e3b', fontSize: '1rem' }}>{record.serialNo}</strong>
            </div>
            <div>
              تاریخِ نکاح (شمسی): <span className="font-num">{formatPKDate(record.nikkahDate)}</span>
            </div>
            <div>
              قمری تاریخ: <span>{hijriStr}</span>
            </div>
            {record.nikkahTime && (
              <div>
                وقت: <span className="font-num">{record.nikkahTime}</span>
              </div>
            )}
            <div>
              ضلع و تحصیل: <span>{record.district || 'لاہور'}</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* سرکاری ۲۵ کالمز کا باقاعدہ روایتی گرڈ لے آؤٹ                    */}
          {/* ============================================================ */}
          <div className="official-nikkah-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
            
            {/* کالم ۱ و ۲ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۔ مقامِ نکاح و علاقہ:
              </strong>
              <div>{record.location || record.wardVillage || record.unionCouncil || 'دفتر نکاح رجسٹرار'}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>یونین کونسل: {record.unionCouncil || '-'}</div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۲۔ دولہا اور والد کا نام معہ سکونت:
              </strong>
              <div>
                <strong>{record.groom?.name}</strong> ولد <span>{record.groom?.fatherName}</span>
              </div>
              <div style={{ fontSize: '0.8rem' }}>شناختی کارڈ: <span className="font-num">{record.groom?.cnic || '-'}</span> | فون: <span className="font-num">{record.groom?.phone || '-'}</span></div>
              <div style={{ fontSize: '0.78rem', color: '#4b5563' }}>سکونت: {record.groom?.address || '-'}</div>
            </div>

            {/* کالم ۳ و ۴ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۳۔ دولہا کی عمر:
              </strong>
              <div>
                <span className="font-num" style={{ fontWeight: 700 }}>{record.groom?.age || '-'}</span> سال
                {record.groom?.dob && <span style={{ marginRight: '6px', fontSize: '0.78rem', color: '#64748b' }}>(تاریخ پیدائش: {record.groom.dob})</span>}
              </div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#b45309', display: 'block', marginBottom: '3px' }}>
                ۴۔ دلہن اور والد کا نام معہ سکونت:
              </strong>
              <div>
                <strong>{record.bride?.name}</strong> بنت <span>{record.bride?.fatherName}</span>
              </div>
              <div style={{ fontSize: '0.8rem' }}>شناختی کارڈ: <span className="font-num">{record.bride?.cnic || '-'}</span> | فون: <span className="font-num">{record.bride?.phone || '-'}</span></div>
              <div style={{ fontSize: '0.78rem', color: '#4b5563' }}>سکونت: {record.bride?.address || '-'}</div>
            </div>

            {/* کالم ۵ و ۶ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۵۔ دلہن کنواری ہے یا بیوہ یا مطلقہ:
              </strong>
              <div><strong>{record.bride?.maritalStatus || 'کنواری'}</strong></div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۶۔ دلہن کی عمر:
              </strong>
              <div>
                <span className="font-num" style={{ fontWeight: 700 }}>{record.bride?.age || '-'}</span> سال
                {record.bride?.dob && <span style={{ marginRight: '6px', fontSize: '0.78rem', color: '#64748b' }}>(تاریخ پیدائش: {record.bride.dob})</span>}
              </div>
            </div>

            {/* کالم ۷ و ۸ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۷۔ وکیلِ دلہن معہ ولدیت و سکونت:
              </strong>
              {record.bride?.hasVakil !== false && record.bride?.vakilName ? (
                <div>
                  <strong>{record.bride.vakilName}</strong> ولد {record.bride.vakilFatherName || '-'} (شناختی کارڈ: <span className="font-num">{record.bride.vakilCnic || '-'}</span>)
                  <div style={{ fontSize: '0.78rem', color: '#4b5563' }}>سکونت: {record.bride.vakilAddress || '-'}</div>
                </div>
              ) : (
                <div style={{ color: '#15803d', fontWeight: 600 }}>دلہن خود بنفسِ نفیس مجلس میں حاضر تھی اور خود ایجاب و قبول کیا۔</div>
              )}
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۸۔ گواہانِ تقرری وکیلِ دلہن:
              </strong>
              {record.bride?.hasVakil !== false && record.bride?.vakilName ? (
                <div style={{ fontSize: '0.8rem' }}>{record.bride?.vakilWitnesses || '-'}</div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>دلہن کی بنفسِ نفیس موجودگی کے باعث وکیل کی حاجت نہ تھی۔</div>
              )}
            </div>

            {/* کالم ۹ و ۱۰ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۹۔ وکیلِ دولہا معہ ولدیت و سکونت:
              </strong>
              {record.groom?.hasVakil !== false && record.groom?.vakilName ? (
                <div>
                  <strong>{record.groom.vakilName}</strong> ولد {record.groom.vakilFatherName || '-'} (شناختی کارڈ: <span className="font-num">{record.groom.vakilCnic || '-'}</span>)
                  <div style={{ fontSize: '0.78rem', color: '#4b5563' }}>سکونت: {record.groom.vakilAddress || '-'}</div>
                </div>
              ) : (
                <div style={{ color: '#15803d', fontWeight: 600 }}>دولہا خود بنفسِ نفیس مجلس میں حاضر تھا اور خود ایجاب و قبول کیا۔</div>
              )}
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۰۔ گواہان تقرری وکیلِ دولہا:
              </strong>
              {record.groom?.hasVakil !== false && record.groom?.vakilName ? (
                <div style={{ fontSize: '0.8rem' }}>{record.groom?.vakilWitnesses || '-'}</div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>دولہا خود حاضر تھا، وکیل و گواہان کی ضرورت نہ تھی۔</div>
              )}
            </div>

            {/* کالم ۱۱: شرعی گواہان (فل چوڑائی) */}
            <div className="cert-column-box" style={{ gridColumn: 'span 2', border: '1.5px solid #064e3b', padding: '8px 12px', borderRadius: '6px', background: '#f8fafc' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '4px' }}>
                ۱۱۔ نکاح کے شرعی گواہان معہ ولدیت، شناختی کارڈ و سکونت:
              </strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <strong>گواہ ۱:</strong> {record.witnessGroom1?.name || '-'} ولد {record.witnessGroom1?.fatherName || '-'}
                  <div style={{ fontSize: '0.8rem' }}>شناختی کارڈ: <span className="font-num">{record.witnessGroom1?.cnic || '-'}</span> | فون: <span className="font-num">{record.witnessGroom1?.phone || '-'}</span></div>
                  <div style={{ fontSize: '0.78rem', color: '#4b5563' }}>سکونت: {record.witnessGroom1?.address || '-'}</div>
                </div>
                <div>
                  <strong>گواہ ۲:</strong> {record.witnessBride1?.name || record.witnessGroom2?.name || '-'} ولد {record.witnessBride1?.fatherName || record.witnessGroom2?.fatherName || '-'}
                  <div style={{ fontSize: '0.8rem' }}>شناختی کارڈ: <span className="font-num">{record.witnessBride1?.cnic || record.witnessGroom2?.cnic || '-'}</span> | فون: <span className="font-num">{record.witnessBride1?.phone || record.witnessGroom2?.phone || '-'}</span></div>
                  <div style={{ fontSize: '0.78rem', color: '#4b5563' }}>سکونت: {record.witnessBride1?.address || record.witnessGroom2?.address || '-'}</div>
                </div>
              </div>
            </div>

            {/* کالم ۱۲، ۱۳، ۱۴، ۱۵ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۲۔ تاریخ انعقادِ نکاح:
              </strong>
              <div>{formatPKDate(record.nikkahDate)} مطابق {hijriStr}</div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۳۔ کل رقم حق مہر:
              </strong>
              <div>
                <strong className="font-num" style={{ color: '#064e3b' }}>{formatMoneyOrText(record.mehr?.totalAmount)}</strong>
                {record.mehr?.totalAmountWords && <span style={{ marginRight: '6px', fontSize: '0.8rem' }}>({record.mehr.totalAmountWords})</span>}
              </div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۴۔ مہر معجل و مؤجل:
              </strong>
              <div>
                معجل (نقد): <span className="font-num" style={{ fontWeight: 600 }}>{formatMoneyOrText(record.mehr?.muajjal)}</span> | مؤجل: <span className="font-num" style={{ fontWeight: 600 }}>{formatMoneyOrText(record.mehr?.muwajjal)}</span>
              </div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۵۔ موقع پر ادا شدہ مہر:
              </strong>
              <div>{record.mehr?.paidAtNikkah || (record.mehr?.muajjal ? `${formatMoneyOrText(record.mehr.muajjal)} ادا شدہ` : 'موقع پر ادا شدہ')}</div>
            </div>

            {/* کالم ۱۶، ۱۷، ۱۸، ۱۹ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۶۔ مہر جائیداد / طلائی زیورات:
              </strong>
              <div>{record.mehr?.goldWeight || 'کوئی جائیداد نہیں'}</div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۷۔ خصوصی شرائطِ نکاح:
              </strong>
              <div>{record.mehr?.specialConditions || 'شرعی و قانونی تقاضے پورے ہوئے۔'}</div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۸۔ تفویضِ طلاق:
              </strong>
              <div>{record.mehr?.delegatedDivorce || 'نہیں'}</div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۱۹۔ شوہر کے حقِ طلاق پر پابندی:
              </strong>
              <div>{record.mehr?.husbandRestrictions || 'کوئی نہیں'}</div>
            </div>

            {/* کالم ۲۰، ۲۱، ۲۲ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۲۰۔ دستاویزات بابت مہر و نان نفقہ:
              </strong>
              <div>{record.mehr?.dowerDocs || 'رسید مہر الگ سے تیار کی گئی۔'}</div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۲۱ و ۲۲۔ سابقہ بیوی اور ثالثی کونسل اجازت:
              </strong>
              <div>
                پہلی بیوی: {record.mehr?.existingWives || 'نہیں'} {record.mehr?.permissionLetter ? `(اجازت نمبر: ${record.mehr.permissionLetter})` : ''}
              </div>
            </div>

            {/* کالم ۲۳ و ۲۴ */}
            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۲۳۔ کوائف نکاح خواں و نکاح رجسٹرار:
              </strong>
              <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                <strong style={{ color: '#064e3b' }}>نکاح خواں:</strong> {officiantDetails}
              </div>
              <div style={{ fontSize: '0.8rem', borderTop: '1px dashed #cbd5e1', paddingTop: '4px' }}>
                <strong style={{ color: '#b45309' }}>نکاح رجسٹرار:</strong> {registrarDetails}
              </div>
            </div>

            <div className="cert-column-box" style={{ border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px', background: '#ffffff' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '3px' }}>
                ۲۴۔ فیس رجسٹریشن و قسم نکاح نامہ:
              </strong>
              <div>
                فیس: <span className="font-num" style={{ fontWeight: 700, color: '#064e3b' }}>{formatMoneyOrText(record.fee?.agreedAmount || record.fee?.receivedAmount || 'حسب معمول')}</span>
                <span className="badge badge-green" style={{ marginRight: '8px', fontSize: '0.72rem' }}>
                  {record.registrationType === 'computerized' ? 'کمپیوٹرائزڈ' : 'دستی'}
                </span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* کالم ۲۵: دستخط، انگوٹھا جات و مہر رجسٹرار (۱۰ الگ الگ خانے)       */}
            {/* ============================================================ */}
            <div className="cert-column-box" style={{ gridColumn: 'span 2', border: '1.5px solid #064e3b', padding: '10px 12px', borderRadius: '6px', background: '#f8fafc', marginTop: '4px' }}>
              <strong style={{ color: '#064e3b', display: 'block', marginBottom: '8px', textAlign: 'center', fontSize: '0.95rem' }}>
                ۲۵۔ دستخط و انگوٹھا جات فریقین، وکلاء، گواہان و مہر نکاح رجسٹرار
              </strong>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                
                {/* ۱۔ دستخط دولہا */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 700 }}>دستخط دولہا</div>
                  {signs.groomSignatureImg ? (
                    <img src={signs.groomSignatureImg} alt="Groom Sign" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>({record.groom?.name})</div>
                </div>

                {/* ۲۔ دستخط وکیل دولہا */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 700 }}>دستخط وکیل دولہا</div>
                  {signs.groomVakilSignatureImg ? (
                    <img src={signs.groomVakilSignatureImg} alt="Groom Vakil Sign" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>({record.groom?.vakilName || 'وکیل دولہا'})</div>
                </div>

                {/* ۳۔ دستخط دلہن */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: 700 }}>دستخط دلہن</div>
                  {signs.brideSignatureImg ? (
                    <img src={signs.brideSignatureImg} alt="Bride Sign" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>({record.bride?.name})</div>
                </div>

                {/* ۴۔ دستخط وکیل دلہن */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: 700 }}>دستخط وکیل دلہن</div>
                  {signs.brideVakilSignatureImg ? (
                    <img src={signs.brideVakilSignatureImg} alt="Bride Vakil Sign" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>({record.bride?.vakilName || 'وکیل دلہن'})</div>
                </div>

                {/* ۵۔ دستخط شرعی گواہ اول */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 700 }}>دستخط شرعی گواہ ۱</div>
                  {signs.shariWitness1SignatureImg || signs.witnessesSignatureImg ? (
                    <img src={signs.shariWitness1SignatureImg || signs.witnessesSignatureImg} alt="Shari Witness 1" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>({record.witnessGroom1?.name || 'گواہ اول'})</div>
                </div>

                {/* ۶۔ دستخط شرعی گواہ دوم */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 700 }}>دستخط شرعی گواہ ۲</div>
                  {signs.shariWitness2SignatureImg ? (
                    <img src={signs.shariWitness2SignatureImg} alt="Shari Witness 2" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>({record.witnessBride1?.name || record.witnessGroom2?.name || 'گواہ دوم'})</div>
                </div>

                {/* ۷۔ دستخط گواہ شادی اول */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 700 }}>دستخط گواہ شادی ۱</div>
                  {signs.marriageWitness1SignatureImg ? (
                    <img src={signs.marriageWitness1SignatureImg} alt="Marriage Witness 1" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>(گواہ شادی ۱)</div>
                </div>

                {/* ۸۔ دستخط گواہ شادی دوم */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 700 }}>دستخط گواہ شادی ۲</div>
                  {signs.marriageWitness2SignatureImg ? (
                    <img src={signs.marriageWitness2SignatureImg} alt="Marriage Witness 2" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>(گواہ شادی ۲)</div>
                </div>

                {/* ۹۔ دستخط نکاح خواں */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 700 }}>دستخط نکاح خواں</div>
                  {signs.nikkahKhawanSignatureImg ? (
                    <img src={signs.nikkahKhawanSignatureImg} alt="Nikkah Khawan Sign" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>({officiantName})</div>
                </div>

                {/* ۱۰۔ مہر و دستخط رجسٹرار */}
                <div style={{ border: '1px dashed #94a3b8', padding: '6px 3px', borderRadius: '4px', background: '#ffffff', minHeight: '62px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.74rem', color: '#064e3b', fontWeight: 700 }}>مہر و دستخط رجسٹرار</div>
                  {signs.registrarSealImg ? (
                    <img src={signs.registrarSealImg} alt="Seal Sign" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <div style={{ height: '30px' }} />
                  )}
                  <div style={{ borderTop: '1px solid #cbd5e1', fontSize: '0.68rem', color: '#64748b' }}>({record.registrar?.name || profile?.name || 'رجسٹرار'})</div>
                </div>

              </div>
            </div>

          </div>

          {/* سرٹیفکیٹ کا فوٹر */}
          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
            <span>دفتر مجاز نکاح رجسٹرار زیر دفعہ ۵ مسلم فیملی لاز آرڈیننس ۱۹۶۱ء</span>
            <span>تصدیق شدہ باضابطہ نقل - جاری کردہ کمپیوٹرائزڈ پورٹل</span>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '960px', background: '#f8fafc' }}>
        
        {/* ٹول بار (پرنٹ کے دوران خودکار طور پر غائب ہوگی) */}
        <div 
          className="no-print" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '14px 20px', 
            background: 'var(--bg-card)',
            borderBottom: '2px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-800)' }}>
              پیش نظارہ برائے طباعت و پرنٹ
            </span>
            <span className="badge badge-gold font-num">فارم: {record.serialNo}</span>
          </div>

          {/* پرت سلیکٹر (چاروں پرت یا کوئی ایک مخصوص پرت) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card-subtle)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Layers size={16} color="var(--primary-700)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>پرنٹ کا انتخاب:</span>
            <select
              className="form-control"
              style={{ padding: '4px 8px', fontSize: '0.84rem', minWidth: '170px' }}
              value={selectedCopy}
              onChange={(e) => setSelectedCopy(e.target.value)}
            >
              <option value="all">چاروں پرت پرنٹ کریں (All 4 Copies)</option>
              <option value="copy1">صرف پرت ۱ (اصل)</option>
              <option value="copy2">صرف پرت ۲ (دوسرا پرت - دولہا)</option>
              <option value="copy3">صرف پرت ۳ (تیسرا پرت - دلہن)</option>
              <option value="copy4">صرف پرت ۴ (چوتھا پرت - رجسٹرار)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={18} />
              <span>پرنٹ نکالیں / PDF محفوظ کریں</span>
            </button>

            <button className="btn-icon" onClick={onClose} title="بند کریں">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* پرنٹ ایبل ایریا: تمام منتخب شدہ پرتیں رینڈر ہوں گی               */}
        {/* ============================================================ */}
        <div style={{ padding: '20px' }}>
          {selectedCopy === 'all' ? (
            COPIES.map((copyItem, index) => renderSingleCopy(copyItem, index))
          ) : (
            renderSingleCopy(COPIES.find((c) => c.id === selectedCopy) || COPIES[0], 0)
          )}
        </div>

      </div>
    </div>
  );
}
