/**
 * ڈیٹا بیس اور لوکل / کلاؤڈ اسٹوریج سروس
 * نکاح کے ریکارڈز، ۲۵ سرکاری کالمز، والٹ دستاویزات، ترسیل، فیس اور بیرونی نکاح خواں کا مکمل انتظام
 */

const STORAGE_KEY_RECORDS = 'nikkah_records_db';
const STORAGE_KEY_PROFILE = 'nikkah_registrar_profile';
const STORAGE_KEY_FIREBASE = 'nikkah_firebase_config';

// نمونہ ریکارڈز
const INITIAL_RECORDS = [
  {
    id: 'nikkah-2026-001',
    serialNo: '142/26',
    folderTitle: '142/26 - محمد عثمان علی و فاطمہ زہرا (لاہور)',
    registrationType: 'computerized', // 'computerized' یا 'manual_only'
    officiantType: 'self', // 'self' (ذاتی) یا 'guest' (دیگر نکاح خواں)
    guestOfficiant: {
      name: '',
      fatherName: '',
      masjidOrArea: '',
      phone: ''
    },
    nikkahDate: '2026-10-08',
    hijriDate: '25 ربیع الثانی، 1448 ہجری',
    nikkahTime: '20:30',
    location: 'قصرِ نور بینکوئٹ ہال، گلبرگ ۳، لاہور',
    unionCouncil: 'یونین کونسل نمبر ۱۰۴',
    wardVillage: 'وارڈ نمبر ۵، گلبرگ ۳، لاہور',
    district: 'لاہور',
    
    // دولہا کی تفصیلات
    groom: {
      name: 'محمد عثمان علی',
      fatherName: 'چوہدری لیاقت علی',
      cnic: '35202-7654321-3',
      age: '28',
      maritalStatus: 'کنوارا',
      phone: '0300-4567891',
      address: 'مکان نمبر 45، بلاک بی، سبزہ زار سکیم، ملتان روڈ، لاہور',
      vakilName: 'طارق محمود',
      vakilFatherName: 'عبدالرشید',
      vakilCnic: '35201-1122334-5',
      vakilPhone: '0301-7654321',
      vakilAddress: 'سبزہ زار، لاہور',
      vakilWitnesses: 'محمد بلال ولد رشید احمد، کاشف علی ولد انور علی'
    },

    // دلہن کی تفصیلات
    bride: {
      name: 'فاطمہ زہرا',
      fatherName: 'میاں خادم حسین',
      cnic: '35201-9876543-2',
      age: '25',
      maritalStatus: 'کنواری',
      phone: '0321-9876543',
      address: 'گلی نمبر 2، محلہ اسلام پورہ، نزد جامع مسجد، لاہور',
      vakilName: 'محمد ارشد',
      vakilFatherName: 'میاں خادم حسین',
      vakilCnic: '35201-5544332-1',
      vakilPhone: '0322-8765432',
      vakilAddress: 'اسلام پورہ، لاہور',
      vakilWitnesses: 'سید زوار شاہ، کامران یوسف'
    },

    // گواہان
    witnessGroom1: {
      name: 'عبدالرحمٰن بٹ',
      fatherName: 'محمد اسلم بٹ',
      cnic: '35202-3344556-7',
      phone: '0302-1234567',
      address: 'ماڈل ٹاؤن بلاک سی، لاہور'
    },
    witnessGroom2: {
      name: 'بلال احمد خان',
      fatherName: 'شیر خان',
      cnic: '35201-7788990-1',
      phone: '0333-7654321',
      address: 'سمن آباد، لاہور'
    },
    witnessBride1: {
      name: 'سید زوار شاہ',
      fatherName: 'سید علی شاہ',
      cnic: '35202-9988776-5',
      phone: '0345-9876543',
      address: 'مسلم ٹاؤن، لاہور'
    },
    witnessBride2: {
      name: 'کامران یوسف',
      fatherName: 'محمد یوسف',
      cnic: '35201-2233445-9',
      phone: '0312-3456789',
      address: 'علامہ اقبال ٹاؤن، لاہور'
    },

    // مہر اور شرائط
    mehr: {
      totalAmount: '500000',
      totalAmountWords: 'پانچ لاکھ روپے نقد مع پانچ تولہ سونا',
      muajjal: '200000',
      muwajjal: '300000',
      paidAtNikkah: '200000',
      goldWeight: 'پانچ تولہ طلائی زیورات',
      specialConditions: 'نان و نفقہ ماہانہ 50,000 روپے اور علیحدہ رہائش کا بندوبست۔',
      delegatedDivorce: 'نہیں',
      husbandRestrictions: 'کوئی نہیں',
      dowerDocs: 'مہر کی رسید الگ سے تیار کر کے دلہن کے حوالے کی گئی ہے۔',
      existingWives: 'نہیں',
      permissionLetter: ''
    },

    // فیس
    fee: {
      agreedAmount: '5000',
      receivedAmount: '3000',
      remainingAmount: 2000
    },

    // ترسیل و وصولی
    delivery: {
      isDelivered: false,
      deliveredTo: '',
      deliveryDate: '',
      recipientPhone: '',
      deliveryNotes: 'دفتر میں موجود ہے، دولہا کا بھائی لینے آئے گا'
    },

    tracking: {
      isRegistered: true,
      isComputerizedReceived: false,
      isDelivered: false
    },

    // ۲۵ کالمز کا اسٹیٹس اور سکپ لسٹ
    skippedColumns: [],
    
    // کالمز کی تصاویر اور دستخط
    columnSignatures: {
      groomSignatureImg: null,
      brideSignatureImg: null,
      witnessGroom1SignatureImg: null,
      witnessGroom2SignatureImg: null,
      officiantSignatureImg: null,
      registrarSealImg: null
    },

    // دستاویزات والٹ (شناختی کارڈز اور کمپیوٹرائزڈ نکاح نامہ)
    vaultDocuments: {
      groomCnicFront: null,
      groomCnicBack: null,
      brideCnicFront: null,
      brideCnicBack: null,
      computerizedNikkahImg: null,
      manualNikkahImgs: []
    },

    notes: 'نکاح بحسن و خوبی شرعی و قانونی تقاضوں کے مطابق پڑھایا گیا۔',
    createdAt: '2026-10-08T21:00:00.000Z',
    updatedAt: '2026-10-08T21:00:00.000Z'
  },
  {
    id: 'nikkah-2026-002',
    serialNo: '143/26',
    folderTitle: '143/26 - حمزہ شفیق و مریم نور (مہمان نکاح خواں)',
    registrationType: 'manual_only',
    officiantType: 'guest',
    guestOfficiant: {
      name: 'مولانا مفتی عبدالحئی قاسمی',
      fatherName: 'قاری نور محمد',
      masjidOrArea: 'جامع مسجد بیت المکرم، فیصل ٹاؤن، لاہور',
      phone: '0321-4455667'
    },
    nikkahDate: '2026-10-10',
    hijriDate: '27 ربیع الثانی، 1448 ہجری',
    nikkahTime: '17:00',
    location: 'جامع مسجد بیت المکرم، فیصل ٹاؤن، لاہور',
    unionCouncil: 'یونین کونسل نمبر ۱۱۵',
    wardVillage: 'وارڈ ۴، فیصل ٹاؤن، لاہور',
    district: 'لاہور',
    
    groom: {
      name: 'حمزہ شفیق',
      fatherName: 'محمد شفیق الرحمٰن',
      cnic: '35202-1234567-9',
      age: '30',
      maritalStatus: 'کنوارا',
      phone: '0333-1122334',
      address: 'مکان 12، سٹریٹ 4، جوہر ٹاؤن، لاہور',
      vakilName: 'شفیق الرحمٰن',
      vakilFatherName: 'عبدالستار',
      vakilCnic: '35202-6677889-1',
      vakilPhone: '0300-9988776',
      vakilAddress: 'جوہر ٹاؤن، لاہور',
      vakilWitnesses: ''
    },

    bride: {
      name: 'مریم نور',
      fatherName: 'سردار نذیر احمد',
      cnic: '35202-5432167-8',
      age: '26',
      maritalStatus: 'کنواری',
      phone: '0301-4455667',
      address: 'کوٹ لکھپت، نزد ریلوے پھاٹک، لاہور',
      vakilName: 'سردار نذیر احمد',
      vakilFatherName: 'محمد دین',
      vakilCnic: '35202-8877665-3',
      vakilPhone: '0321-4433221',
      vakilAddress: 'کوٹ لکھپت، لاہور',
      vakilWitnesses: ''
    },

    witnessGroom1: {
      name: 'نوید اختر',
      fatherName: 'محمد اختر',
      cnic: '35202-4455661-2',
      phone: '0333-8877665',
      address: 'جوہر ٹاؤن، لاہور'
    },
    witnessGroom2: {
      name: 'سہیل انجم',
      fatherName: 'محمد انجم',
      cnic: '35201-9988112-4',
      phone: '0300-3344556',
      address: 'فیصل ٹاؤن، لاہور'
    },
    witnessBride1: {
      name: 'عاصم نذیر',
      fatherName: 'سردار نذیر احمد',
      cnic: '35202-3322119-7',
      phone: '0322-1122334',
      address: 'کوٹ لکھپت، لاہور'
    },
    witnessBride2: {
      name: 'وقاص علی',
      fatherName: 'محمد اسحاق',
      cnic: '35201-6655443-8',
      phone: '0346-7788990',
      address: 'پیکو روڈ، لاہور'
    },

    mehr: {
      totalAmount: '750000',
      totalAmountWords: 'سات لاکھ پچاس ہزار روپے فقط',
      muajjal: '750000',
      muwajjal: '0',
      paidAtNikkah: '750000',
      goldWeight: 'تین تولہ زیور طلائی',
      specialConditions: 'مہر کی تمام رقم عند النکاح مجلس میں ادا کر دی گئی۔',
      delegatedDivorce: 'نہیں',
      husbandRestrictions: '',
      dowerDocs: '',
      existingWives: 'نہیں',
      permissionLetter: ''
    },

    fee: {
      agreedAmount: '6000',
      receivedAmount: '6000',
      remainingAmount: 0
    },

    delivery: {
      isDelivered: true,
      deliveredTo: 'حمزہ شفیق (دولہا خود)',
      deliveryDate: '2026-10-12',
      recipientPhone: '0333-1122334',
      deliveryNotes: 'چاروں پرتوں پر دستخط کے بعد دولہا کو دوسرا پرت حوالے کر دیا گیا ہے۔'
    },

    tracking: {
      isRegistered: true,
      isComputerizedReceived: true,
      isDelivered: true
    },

    skippedColumns: [],
    columnSignatures: {},
    vaultDocuments: {
      groomCnicFront: null,
      groomCnicBack: null,
      brideCnicFront: null,
      brideCnicBack: null,
      computerizedNikkahImg: null,
      manualNikkahImgs: []
    },

    notes: 'مہمان نکاح خواں نے نکاح پڑھوایا، تمام اندراج باضابطہ تصدیق شدہ ہے۔',
    createdAt: '2026-10-10T18:00:00.000Z',
    updatedAt: '2026-10-10T18:00:00.000Z'
  }
];

// رجسٹرار کا پروفائل
const DEFAULT_REGISTRAR_PROFILE = {
  name: 'مولانا قاری محمد اسماعیل صدیقی',
  fatherName: 'مولانا حافظ عبدالحمید صدیقی',
  phone: '0300-7654321',
  cnic: '35202-1122334-1',
  licenseNo: 'NK-LHR-2024/89',
  unionCouncil: 'یونین کونسل نمبر ۱۰۴ و ۱۰۵',
  district: 'ضلع و تحصیل لاہور',
  officeAddress: 'مرکزی جامع مسجد و دفتر نکاح رجسٹرار، ملتان روڈ، لاہور',
  stampText: 'مہر و دستخط نکاح خواں و رجسٹرار',
  feeDefault: '5000'
};

export const storageService = {
  // تمام ریکارڈز حاصل کریں
  getRecords() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (!data) {
        this.saveRecords(INITIAL_RECORDS);
        return INITIAL_RECORDS;
      }
      const parsed = JSON.parse(data);
      // تسلی کریں کہ پرانے ریکارڈز میں نئے فیلڈز موجود ہوں
      return parsed.map((r) => this.normalizeRecord(r));
    } catch (e) {
      console.error('Error reading records:', e);
      return INITIAL_RECORDS;
    }
  },

  // ریکارڈ کو نارملائز کرنا تاکہ کوئی فیلڈ خالی نہ رہے اور تمام دستاویزات محفوظ رہیں
  normalizeRecord(r) {
    if (!r) return null;
    const isNumAgreed = /^\d+$/.test(String(r.fee?.agreedAmount || '').trim());
    const agreed = isNumAgreed ? parseInt(r.fee.agreedAmount, 10) : 0;
    const isNumRecv = /^\d+$/.test(String(r.fee?.receivedAmount || '').trim());
    const received = isNumRecv ? parseInt(r.fee.receivedAmount, 10) : 0;
    const remaining = Math.max(0, agreed - received);

    const vaultDocs = {
      groomCnicFront: r.vaultDocuments?.groomCnicFront || r.groom?.cnicImageFront || null,
      groomCnicBack: r.vaultDocuments?.groomCnicBack || r.groom?.cnicImageBack || null,
      brideCnicFront: r.vaultDocuments?.brideCnicFront || r.bride?.cnicImageFront || null,
      brideCnicBack: r.vaultDocuments?.brideCnicBack || r.bride?.cnicImageBack || null,
      computerizedNikkahImg: r.vaultDocuments?.computerizedNikkahImg || null,
      manualNikkahImgs: Array.isArray(r.vaultDocuments?.manualNikkahImgs) ? r.vaultDocuments.manualNikkahImgs : []
    };

    return {
      ...r,
      folderTitle: r.folderTitle || `${r.serialNo || '00'} - ${r.groom?.name || 'دولہا'} و ${r.bride?.name || 'دلہن'}${r.officiantType === 'guest' ? ' (مہمان نکاح خواں)' : ''}`,
      registrationType: r.registrationType || (r.tracking?.isComputerizedReceived ? 'computerized' : 'manual_only'),
      officiantType: r.officiantType || 'self',
      guestOfficiant: r.guestOfficiant || { name: '', fatherName: '', masjidOrArea: '', phone: '' },
      skippedColumns: Array.isArray(r.skippedColumns) ? r.skippedColumns : [],
      columnSignatures: r.columnSignatures || {},
      vaultDocuments: vaultDocs,
      groom: {
        ...r.groom,
        dob: r.groom?.dob || '',
        hasVakil: r.groom?.hasVakil ?? (r.groom?.vakilName ? true : false),
        cnicImageFront: vaultDocs.groomCnicFront,
        cnicImageBack: vaultDocs.groomCnicBack
      },
      bride: {
        ...r.bride,
        dob: r.bride?.dob || '',
        hasVakil: r.bride?.hasVakil ?? (r.bride?.vakilName ? true : false),
        cnicImageFront: vaultDocs.brideCnicFront,
        cnicImageBack: vaultDocs.brideCnicBack
      },
      delivery: {
        isDelivered: r.delivery?.isDelivered ?? r.tracking?.isDelivered ?? false,
        deliveredTo: r.delivery?.deliveredTo || '',
        deliveryDate: r.delivery?.deliveryDate || '',
        recipientPhone: r.delivery?.recipientPhone || '',
        deliveryNotes: r.delivery?.deliveryNotes || ''
      },
      fee: {
        agreedAmount: r.fee?.agreedAmount !== undefined && r.fee?.agreedAmount !== '' ? String(r.fee.agreedAmount) : 'حسب معمول',
        receivedAmount: r.fee?.receivedAmount !== undefined ? String(r.fee.receivedAmount) : '',
        remainingAmount: remaining
      }
    };
  },

  // تمام ریکارڈز محفوظ کریں
  saveRecords(records) {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
      return true;
    } catch (e) {
      console.error('Error saving records:', e);
      // کوٹہ کی صورت میں الرٹ دیں
      alert('اسٹوریج کی گنجائش بھر گئی ہے، براہ کرم سیٹنگز سے بیک اپ ڈاؤن لوڈ کر کے پرانی تصاویر کو چھوٹا کریں۔');
      return false;
    }
  },

  // نیا ریکارڈ شامل کریں
  addRecord(record) {
    const records = this.getRecords();
    const folderTitle = record.folderTitle || 
      `${record.serialNo || 'نئے'} - ${record.groom?.name || 'دولہا'} و ${record.bride?.name || 'دلہن'}${record.officiantType === 'guest' ? ' (مہمان نکاح خواں)' : ''}`;

    const newRecord = this.normalizeRecord({
      ...record,
      id: record.id || `nikkah-${Date.now()}`,
      folderTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    records.unshift(newRecord);
    this.saveRecords(records);
    return newRecord;
  },

  // ریکارڈ اپڈیٹ کریں
  updateRecord(id, updatedData) {
    const records = this.getRecords();
    const index = records.findIndex((r) => r.id === id);
    if (index !== -1) {
      const folderTitle = updatedData.folderTitle || 
        `${updatedData.serialNo || records[index].serialNo} - ${updatedData.groom?.name || records[index].groom?.name} و ${updatedData.bride?.name || records[index].bride?.name}${updatedData.officiantType === 'guest' ? ' (مہمان نکاح خواں)' : ''}`;

      records[index] = this.normalizeRecord({
        ...records[index],
        ...updatedData,
        folderTitle,
        updatedAt: new Date().toISOString()
      });

      this.saveRecords(records);
      return records[index];
    }
    return null;
  },

  // ریکارڈ ڈیلیٹ کریں
  deleteRecord(id) {
    const records = this.getRecords();
    const filtered = records.filter((r) => r.id !== id);
    this.saveRecords(filtered);
    return true;
  },

  // آئی ڈی سے ایک ریکارڈ لائیں
  getRecordById(id) {
    const records = this.getRecords();
    return records.find((r) => r.id === id) || null;
  },

  // ترسیل کی حالت فوری بدلیں (Quick Delivery Toggle)
  markDelivered(id, deliveredTo, recipientPhone, deliveryNotes) {
    const record = this.getRecordById(id);
    if (!record) return null;

    const delivery = {
      isDelivered: true,
      deliveredTo: deliveredTo || record.groom?.name || 'فریقین',
      deliveryDate: new Date().toISOString().slice(0, 10),
      recipientPhone: recipientPhone || record.groom?.phone || '',
      deliveryNotes: deliveryNotes || 'نکاح نامہ حوالے کر دیا گیا ہے۔'
    };

    return this.updateRecord(id, {
      delivery,
      tracking: {
        ...record.tracking,
        isDelivered: true
      }
    });
  },

  // نکاح خواں پروفائل لائیں
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(DEFAULT_REGISTRAR_PROFILE));
        return DEFAULT_REGISTRAR_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_REGISTRAR_PROFILE;
    }
  },

  // نکاح خواں پروفائل اپڈیٹ کریں
  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error('Error saving profile:', e);
      return false;
    }
  },

  // فائر بیس کی کنفیگریشن حاصل کریں
  getFirebaseConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FIREBASE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // فائر بیس کی کنفیگریشن محفوظ کریں
  saveFirebaseConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(config));
      return true;
    } catch {
      return false;
    }
  },

  // تمام بیرونی / مہمان نکاح خواں کی فہرست نکالیں
  getGuestOfficiantsList() {
    const records = this.getRecords();
    const guestMap = new Map();

    records.forEach((r) => {
      if (r.officiantType === 'guest' && r.guestOfficiant?.name) {
        const key = r.guestOfficiant.name.trim();
        if (!guestMap.has(key)) {
          guestMap.set(key, {
            name: r.guestOfficiant.name,
            fatherName: r.guestOfficiant.fatherName || '',
            masjidOrArea: r.guestOfficiant.masjidOrArea || '',
            phone: r.guestOfficiant.phone || '',
            count: 1
          });
        } else {
          guestMap.get(key).count += 1;
        }
      }
    });

    return Array.from(guestMap.values());
  },

  // مکمل ڈیٹا کا JSON بیک اپ ڈاؤن لوڈ کریں
  exportBackup() {
    const records = this.getRecords();
    const profile = this.getProfile();
    const exportData = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      registrar: profile,
      totalRecords: records.length,
      records: records
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nikkah_Records_Vault_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // بیک اپ فائل سے ڈیٹا بحال کریں (Import)
  importBackup(jsonData) {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (Array.isArray(parsed.records)) {
        const normalized = parsed.records.map((r) => this.normalizeRecord(r));
        this.saveRecords(normalized);
        if (parsed.registrar) {
          this.saveProfile(parsed.registrar);
        }
        return { success: true, count: normalized.length };
      }
      return { success: false, message: 'غلط فائل فارمیٹ' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
};
