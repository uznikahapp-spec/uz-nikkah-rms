/**
 * اسلامی ہجری اور شمسی تاریخوں کے یوٹیلیٹیز
 */

// اسلامی مہینوں کے نام
export const ISLAMIC_MONTHS = [
  'محرم الحرام',
  'صفر المظفر',
  'ربیع الاول',
  'ربیع الثانی',
  'جمادی الاول',
  'جمادی الثانی',
  'رجب المرجب',
  'شعبان المعظم',
  'رمضان المبارک',
  'شوال المکرم',
  'ذی القعدہ',
  'ذی الحجہ'
];

/**
 * گریگورین تاریخ سے تخمینی ہجری تاریخ حاصل کریں
 */
export function getHijriDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  try {
    // براؤزر کا انٹرنیشنلائزیشن اسلامک کلینڈر API
    const formatter = new Intl.DateTimeFormat('ur-PK-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(date);
  } catch {
    // سادہ متبادل اگر براؤزر سپورٹ نہ کرے
    return 'مطابق اسلامی سن';
  }
}

/**
 * پاکستانی معیاری فارمیٹ dd-mm-yyyy
 */
export function formatPKDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * وقت کو 12 گھنٹے فارمیٹ میں تبدیل کرنا
 */
export function format12HourTime(timeString) {
  if (!timeString) return '';
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'شام / رات' : 'صبح / دوپہر';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 ہو تو 12

  return `${hours}:${minutes} ${ampm}`;
}

/**
 * شناختی کارڈ نمبر کی خودکار فارمیٹنگ (35202-1234567-1)
 */
export function formatCNIC(val) {
  if (!val) return '';
  // صرف ہندسے رکھیں
  const digits = val.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
}

/**
 * موبائل نمبر کی خودکار فارمیٹنگ (0300-1234567)
 */
export function formatPhone(val) {
  if (!val) return '';
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}
