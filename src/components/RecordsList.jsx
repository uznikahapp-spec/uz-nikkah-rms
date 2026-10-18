import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Printer, 
  Eye, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  FileText,
  Calendar,
  X,
  CheckCircle,
  Clock,
  Coins,
  Send,
  FolderArchive,
  UserCheck,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { formatPKDate } from '../utils/dateUtils';
import { storageService } from '../utils/storageService';
import { authService } from '../utils/authService';

export default function RecordsList({ 
  records, 
  onNewEntry, 
  onViewRecord, 
  onEditRecord, 
  onPrintRecord, 
  onDeleteRecord 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'guest_only', 'self_only', 'undelivered', 'delivered', 'unpaid', 'computerized', 'manual_only'
  const [selectedGuestOfficiant, setSelectedGuestOfficiant] = useState('');

  // مہمان نکاح خواں کی لسٹ
  const guestOfficiants = storageService.getGuestOfficiantsList();

  // فلٹرنگ لاجک
  const filteredRecords = records.filter((r) => {
    const term = searchTerm.trim().toLowerCase();
    const folderTitle = (r.folderTitle || '').toLowerCase();
    const guestName = (r.guestOfficiant?.name || '').toLowerCase();
    
    const matchSearch = 
      !term ||
      folderTitle.includes(term) ||
      guestName.includes(term) ||
      (r.serialNo || '').toLowerCase().includes(term) ||
      (r.groom?.name || '').toLowerCase().includes(term) ||
      (r.groom?.cnic || '').includes(term) ||
      (r.groom?.phone || '').includes(term) ||
      (r.bride?.name || '').toLowerCase().includes(term) ||
      (r.bride?.cnic || '').includes(term) ||
      (r.location || '').toLowerCase().includes(term);

    const matchMonth = !selectedMonth || (r.nikkahDate || '').startsWith(selectedMonth);

    // فلٹر ٹائپ
    let matchFilter = true;
    const isNumAgreed = /^\d+$/.test(String(r.fee?.agreedAmount || '').trim());
    const agreed = isNumAgreed ? parseInt(r.fee.agreedAmount, 10) : 0;
    const isNumRecv = /^\d+$/.test(String(r.fee?.receivedAmount || '').trim());
    const received = isNumRecv ? parseInt(r.fee.receivedAmount, 10) : 0;
    const remaining = Math.max(0, agreed - received);

    if (filterType === 'unpaid') {
      matchFilter = remaining > 0;
    } else if (filterType === 'undelivered') {
      matchFilter = !r.delivery?.isDelivered;
    } else if (filterType === 'delivered') {
      matchFilter = !!r.delivery?.isDelivered;
    } else if (filterType === 'guest_only') {
      matchFilter = r.officiantType === 'guest';
    } else if (filterType === 'self_only') {
      matchFilter = r.officiantType !== 'guest';
    } else if (filterType === 'computerized') {
      matchFilter = r.registrationType === 'computerized';
    } else if (filterType === 'manual_only') {
      matchFilter = r.registrationType === 'manual_only';
    }

    // مخصوص مہمان نکاح خواں کا انتخاب
    let matchGuest = true;
    if (selectedGuestOfficiant) {
      matchGuest = r.officiantType === 'guest' && r.guestOfficiant?.name?.trim() === selectedGuestOfficiant.trim();
    }

    return matchSearch && matchMonth && matchFilter && matchGuest;
  });

  return (
    <div className="card">
      <div className="card-header-styled">
        <div className="card-title-with-icon">
          <FolderArchive size={26} color="var(--primary-700)" />
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>تمام رجسٹرڈ نکاح ریکارڈز فولڈرز ({filteredRecords.length})</span>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ہر نکاح ایک الگ فولڈر، شناختی کارڈز اور ۴ پرتوں کے ساتھ محفوظ ہے</div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onNewEntry}>
          <PlusCircle size={18} />
          <span>نیا نکاح نامہ اندراج</span>
        </button>
      </div>

      {/* اسٹیٹس فوری ٹیبز بار */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <button 
          className={`btn ${filterType === 'all' && !selectedGuestOfficiant ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 12px', fontSize: '0.84rem' }}
          onClick={() => { setFilterType('all'); setSelectedGuestOfficiant(''); }}
        >
          تمام نکاح نامے ({records.length})
        </button>

        <button 
          className={`btn ${filterType === 'guest_only' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 12px', fontSize: '0.84rem' }}
          onClick={() => { setFilterType('guest_only'); }}
        >
          <UserCheck size={14} />
          <span>مہمان نکاح خواں کے ({records.filter(r => r.officiantType === 'guest').length})</span>
        </button>

        <button 
          className={`btn ${filterType === 'undelivered' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 12px', fontSize: '0.84rem' }}
          onClick={() => { setFilterType('undelivered'); }}
        >
          <Clock size={14} />
          <span>غیر وصول شدہ / دفتر میں موجود ({records.filter(r => !r.delivery?.isDelivered).length})</span>
        </button>

        <button 
          className={`btn ${filterType === 'unpaid' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 12px', fontSize: '0.84rem' }}
          onClick={() => { setFilterType('unpaid'); }}
        >
          <Coins size={14} />
          <span>بقایا فیس والے ({records.filter(r => {
            const isNum = /^\d+$/.test(String(r.fee?.agreedAmount || '').trim());
            const a = isNum ? parseInt(r.fee.agreedAmount, 10) : 0;
            const rec = parseInt(r.fee?.receivedAmount || '0', 10) || 0;
            return (a - rec) > 0;
          }).length})</span>
        </button>

        <button 
          className={`btn ${filterType === 'computerized' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 12px', fontSize: '0.84rem' }}
          onClick={() => { setFilterType('computerized'); }}
        >
          کمپیوٹرائزڈ سرٹیفکیٹ والے ({records.filter(r => r.registrationType === 'computerized').length})
        </button>
      </div>

      {/* سرچ بار اور مخصوص نکاح خواں ڈراپ ڈاؤن */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px', background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        {/* سرچ ان پٹ */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', top: '10px', right: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            style={{ paddingRight: '36px', fontSize: '0.88rem' }}
            placeholder="فولڈر ٹائٹل، دولہا، دلہن، شناختی کارڈ یا فارم نمبر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* مہمان نکاح خواں فلٹر ڈراپ ڈاؤن */}
        {guestOfficiants.length > 0 && (
          <div>
            <select
              className="form-control"
              style={{ fontSize: '0.88rem' }}
              value={selectedGuestOfficiant}
              onChange={(e) => setSelectedGuestOfficiant(e.target.value)}
            >
              <option value="">تمام نکاح خواں (ذاتی و مہمان)</option>
              {guestOfficiants.map((g) => (
                <option key={g.name} value={g.name}>
                  نکاح خواں: {g.name} ({g.count} نکاح)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* مہینہ فلٹر */}
        <div>
          <input 
            type="month" 
            className="form-control font-num"
            style={{ fontSize: '0.88rem' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* ریکارڈز لسٹ (ٹیبل برائے پی سی، کارڈز برائے موبائل)             */}
      {/* ============================================================ */}
      {filteredRecords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <FolderArchive size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>کوئی نکاح نامہ ریکارڈ نہیں ملا</div>
          <p style={{ fontSize: '0.88rem', margin: '4px 0 0' }}>برائے مہربانی فلٹر یا تلاش کا لفظ تبدیل کر کے دیکھیں۔</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>فارم نمبر</th>
                <th>محفوظ فولڈر ٹائٹل / دولہا و دلہن</th>
                <th>تاریخِ نکاح</th>
                <th>نکاح خواں</th>
                <th>قسم نکاح نامہ</th>
                <th>فیس کی کیفیت</th>
                <th>وصولی / ترسیل</th>
                <th style={{ textAlign: 'center' }}>اقدامات</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const isNumAgreed = /^\d+$/.test(String(r.fee?.agreedAmount || '').trim());
                const agreed = isNumAgreed ? parseInt(r.fee.agreedAmount, 10) : 0;
                const isNumRecv = /^\d+$/.test(String(r.fee?.receivedAmount || '').trim());
                const received = isNumRecv ? parseInt(r.fee.receivedAmount, 10) : 0;
                const remaining = Math.max(0, agreed - received);

                return (
                  <tr key={r.id} className="group">
                    {/* فارم نمبر */}
                    <td className="font-num" style={{ fontWeight: 800, color: 'var(--primary-800)' }}>
                      {r.serialNo}
                    </td>

                    {/* فولڈر ٹائٹل */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-main)' }}>
                        {r.folderTitle || `${r.groom?.name} و ${r.bride?.name}`}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        دولہا شناختی کارڈ: <span className="font-num">{r.groom?.cnic || '-'}</span> | دلہن: <span className="font-num">{r.bride?.cnic || '-'}</span>
                      </div>
                    </td>

                    {/* تاریخ */}
                    <td>
                      <div className="font-num" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{formatPKDate(r.nikkahDate)}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{r.nikkahTime || '-'}</div>
                    </td>

                    {/* نکاح خواں */}
                    <td>
                      {r.officiantType === 'guest' && r.guestOfficiant?.name ? (
                        <div>
                          <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>مہمان نکاح خواں</span>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '2px' }}>{r.guestOfficiant.name}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>ذاتی (رجسٹرار)</span>
                        </div>
                      )}
                    </td>

                    {/* قسم نکاح نامہ */}
                    <td>
                      <span className={`badge ${r.registrationType === 'computerized' ? 'badge-blue' : 'badge-gold'}`} style={{ fontSize: '0.75rem' }}>
                        {r.registrationType === 'computerized' ? 'کمپیوٹرائزڈ' : 'صرف دستی'}
                      </span>
                    </td>

                    {/* فیس */}
                    <td>
                      {isNumAgreed ? (
                        <>
                          <div className="font-num" style={{ fontSize: '0.84rem' }}>
                            طے: {agreed.toLocaleString()} | وصول: <span style={{ color: '#059669', fontWeight: 700 }}>{received ? received.toLocaleString() : '0'}</span>
                          </div>
                          <div>
                            {remaining > 0 ? (
                              <span className="badge badge-red font-num" style={{ fontSize: '0.72rem' }}>
                                بقایا: {remaining.toLocaleString()} روپے
                              </span>
                            ) : (
                              <span className="badge badge-green font-num" style={{ fontSize: '0.72rem' }}>
                                ✓ مکمل ادا
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                            {r.fee?.agreedAmount || 'حسب معمول'}
                          </div>
                          <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                            ✓ باقاعدہ فیس
                          </span>
                        </>
                      )}
                    </td>

                    {/* ترسیل و وصولی */}
                    <td>
                      {r.delivery?.isDelivered ? (
                        <div>
                          <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>✓ وصول شدہ</span>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>حوالے کر دیا گیا</div>
                        </div>
                      ) : (
                        <div>
                          <span className="badge badge-yellow" style={{ fontSize: '0.75rem' }}>⏳ دفتر میں موجود</span>
                          <div style={{ fontSize: '0.76rem', color: '#b45309' }}>غیر وصول شدہ</div>
                        </div>
                      )}
                    </td>

                    {/* ۴ اقدامات بٹنز (View, Edit, Print 4 Copies, Delete) */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {/* 1. مکمل کوائف و والٹ دیکھنا */}
                        <button 
                          className="btn-icon" 
                          title="فولڈر اور دستاویزات والٹ دیکھیں"
                          onClick={() => onViewRecord(r)}
                        >
                          <Eye size={17} color="var(--primary-700)" />
                        </button>

                        {/* 2. ترمیم */}
                        <button 
                          className="btn-icon" 
                          title="ترمیم کریں"
                          onClick={() => onEditRecord(r)}
                        >
                          <Edit3 size={17} color="var(--primary-700)" />
                        </button>

                        {/* 3. چاروں پرتوں کا پرنٹ */}
                        <button 
                          className="btn-icon" 
                          title="۴ پرت پرنٹ نکالیں"
                          onClick={() => onPrintRecord(r)}
                        >
                          <Printer size={17} color="var(--gold-700)" />
                        </button>

                        {/* 4. ڈیلیٹ (صرف چیف رجسٹرار ایڈمن کو نظر آئے گا) */}
                        {authService.can('delete_record') && (
                          <button 
                            className="btn-icon" 
                            title="ڈیلیٹ کریں (صرف ایڈمن)"
                            onClick={() => {
                              if (window.confirm(`کیا آپ واقعی نکاح نامہ "${r.folderTitle || r.serialNo}" کو ڈیلیٹ کرنا چاہتے ہیں؟`)) {
                                onDeleteRecord(r.id);
                              }
                            }}
                          >
                            <Trash2 size={17} color="#dc2626" />
                          </button>
                        )}
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
  );
}
