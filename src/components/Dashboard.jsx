import React from 'react';
import { 
  FileText, 
  CalendarCheck, 
  Coins, 
  Users, 
  PlusCircle, 
  Printer, 
  Eye, 
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FolderArchive,
  UserCheck,
  Send,
  Building
} from 'lucide-react';
import { formatPKDate } from '../utils/dateUtils';

export default function Dashboard({ 
  records, 
  onNewEntry, 
  onViewRecord, 
  onPrintRecord, 
  onViewAllRecords 
}) {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7); // yyyy-mm

  // شماریات کا حساب
  const totalCount = records.length;
  const thisMonthCount = records.filter(r => (r.nikkahDate || '').startsWith(currentMonth)).length;
  const computerizedCount = records.filter(r => r.registrationType === 'computerized').length;
  const guestOfficiantCount = records.filter(r => r.officiantType === 'guest').length;
  const undeliveredCount = records.filter(r => !r.delivery?.isDelivered).length;

  // فیس شماریات
  const totalReceivedFee = records.reduce((acc, curr) => {
    const r = parseInt(curr?.fee?.receivedAmount || '0', 10);
    return acc + (isNaN(r) ? 0 : r);
  }, 0);

  const totalRemainingFee = records.reduce((acc, curr) => {
    const a = parseInt(curr?.fee?.agreedAmount || '0', 10);
    const r = parseInt(curr?.fee?.receivedAmount || '0', 10);
    const rem = (isNaN(a) ? 0 : a) - (isNaN(r) ? 0 : r);
    return acc + (rem > 0 ? rem : 0);
  }, 0);

  const recentRecords = records.slice(0, 5);

  return (
    <div className="dashboard-view">
      {/* استقبالیہ بینر */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(6,78,59,0.08) 0%, rgba(245,158,11,0.08) 100%)',
          border: '1.5px solid rgba(6,78,59,0.2)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-600)', fontWeight: 700, marginBottom: '4px' }}>
            <Sparkles size={18} />
            <span>خوش آمدید!</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-800)', margin: 0, fontWeight: 700 }}>
            نکاح ڈیجیٹل مینجمنٹ سسٹم و دستاویزات والٹ
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            سرکاری ۲۵ کالمز باکس موڈ، چاروں پرتوں کا پرنٹ، دستاویزات والٹ اور مہمان نکاح خواں کا مکمل انتظام
          </p>
        </div>

        <button className="btn btn-primary" onClick={onNewEntry} style={{ padding: '12px 24px', fontSize: '1.05rem' }}>
          <PlusCircle size={20} />
          <span>نیا نکاح رجسٹر کریں</span>
        </button>
      </div>

      {/* شماریاتی کارڈز (Stats Grid) */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        
        {/* کل رجسٹرڈ نکاح */}
        <div className="stat-card stat-card-green">
          <div className="stat-card-info">
            <h4>کل محفوظ فولڈرز</h4>
            <div className="stat-value font-num">{totalCount}</div>
          </div>
          <div className="stat-card-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary-800)' }}>
            <FolderArchive size={24} />
          </div>
        </div>

        {/* کمپیوٹرائزڈ نکاح نامے */}
        <div className="stat-card stat-card-gold">
          <div className="stat-card-info">
            <h4>کمپیوٹرائزڈ نکاح نامے</h4>
            <div className="stat-value font-num">{computerizedCount}</div>
          </div>
          <div className="stat-card-icon" style={{ background: 'var(--gold-100)', color: 'var(--gold-700)' }}>
            <CalendarCheck size={24} />
          </div>
        </div>

        {/* مہمان نکاح خواں کے نکاح */}
        <div className="stat-card stat-card-gold">
          <div className="stat-card-info">
            <h4>مہمان نکاح خواں کے</h4>
            <div className="stat-value font-num">{guestOfficiantCount}</div>
          </div>
          <div className="stat-card-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#2563eb' }}>
            <UserCheck size={24} />
          </div>
        </div>

        {/* غیر وصول شدہ نکاح نامے */}
        <div className="stat-card stat-card-green">
          <div className="stat-card-info">
            <h4>دفتر میں موجود (غیر وصول شدہ)</h4>
            <div className="stat-value font-num" style={{ color: undeliveredCount > 0 ? '#b45309' : '#059669' }}>
              {undeliveredCount}
            </div>
          </div>
          <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#b45309' }}>
            <Clock size={24} />
          </div>
        </div>

        {/* وصول شدہ فیس */}
        <div className="stat-card stat-card-green">
          <div className="stat-card-info">
            <h4>کل وصول شدہ فیس</h4>
            <div className="stat-value font-num" style={{ fontSize: '1.4rem' }}>
              {totalReceivedFee.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>روپے</span>
            </div>
          </div>
          <div className="stat-card-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary-800)' }}>
            <Coins size={24} />
          </div>
        </div>

        {/* بقایا واجب الوصول فیس */}
        <div className="stat-card" style={{ borderRight: '4px solid #ef4444' }}>
          <div className="stat-card-info">
            <h4>کل بقایا واجب الوصول فیس</h4>
            <div className="stat-value font-num" style={{ color: totalRemainingFee > 0 ? '#dc2626' : '#059669', fontSize: '1.4rem' }}>
              {totalRemainingFee.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>روپے</span>
            </div>
          </div>
          <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
            <AlertCircle size={24} />
          </div>
        </div>

      </div>

      {/* حالیہ محفوظ شدہ ریکارڈز */}
      <div className="card">
        <div className="card-header-styled">
          <div className="card-title-with-icon">
            <Clock size={20} color="var(--primary-700)" />
            <span>حالیہ نکاح نامے اور فولڈرز</span>
          </div>

          <button className="btn btn-secondary" onClick={onViewAllRecords}>
            <span>تمام ریکارڈز دیکھیں</span>
            <ArrowLeft size={16} />
          </button>
        </div>

        {recentRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            ابھی تک کوئی ریکارڈ موجود نہیں ہے۔
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>فارم نمبر</th>
                  <th>فولڈر ٹائٹل / دولہا و دلہن</th>
                  <th>تاریخِ نکاح</th>
                  <th>نکاح خواں</th>
                  <th>قسم</th>
                  <th>وصولی کیفیت</th>
                  <th style={{ textAlign: 'center' }}>اقدامات</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((r) => {
                  return (
                    <tr key={r.id}>
                      <td className="font-num" style={{ fontWeight: 800, color: 'var(--primary-800)' }}>
                        {r.serialNo}
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                          {r.folderTitle || `${r.groom?.name} و ${r.bride?.name}`}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {r.location || r.unionCouncil || 'لاہور'}
                        </div>
                      </td>

                      <td>
                        <div className="font-num" style={{ fontWeight: 600 }}>{formatPKDate(r.nikkahDate)}</div>
                      </td>

                      <td>
                        {r.officiantType === 'guest' && r.guestOfficiant?.name ? (
                          <span className="badge badge-gold" style={{ fontSize: '0.76rem' }}>
                            مہمان: {r.guestOfficiant.name}
                          </span>
                        ) : (
                          <span className="badge badge-green" style={{ fontSize: '0.76rem' }}>
                            ذاتی (رجسٹرار)
                          </span>
                        )}
                      </td>

                      <td>
                        <span className={`badge ${r.registrationType === 'computerized' ? 'badge-blue' : 'badge-gold'}`} style={{ fontSize: '0.74rem' }}>
                          {r.registrationType === 'computerized' ? 'کمپیوٹرائزڈ' : 'دستی'}
                        </span>
                      </td>

                      <td>
                        {r.delivery?.isDelivered ? (
                          <span className="badge badge-green" style={{ fontSize: '0.74rem' }}>✓ وصول شدہ</span>
                        ) : (
                          <span className="badge badge-yellow" style={{ fontSize: '0.74rem' }}>⏳ دفتر میں موجود</span>
                        )}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button 
                            className="btn-icon" 
                            title="فولڈر اور دستاویزات والٹ دیکھیں"
                            onClick={() => onViewRecord(r)}
                          >
                            <Eye size={16} color="var(--primary-700)" />
                          </button>
                          <button 
                            className="btn-icon" 
                            title="۴ پرت پرنٹ نکالیں"
                            onClick={() => onPrintRecord(r)}
                          >
                            <Printer size={16} color="var(--gold-700)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
