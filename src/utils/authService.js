/**
 * نکاح رجسٹریشن سسٹم - اتھینٹیکیشن و آتھرائزیشن سروس (Authentication & Role-Based Access Control)
 * رجسٹرار (Admin) اور اسسٹنٹ (Staff) کے کردار، پاسورڈ سیکیورٹی اور اجازتوں کا انتظام
 */

import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const STORAGE_KEY_AUTH = 'nikkah_current_session';
const STORAGE_KEY_USERS = 'nikkah_users_list';
const FIREBASE_COLLECTION_USERS = 'nikkah_users';

// ابتدائی ڈیفالٹ صارفین
const DEFAULT_USERS = [
  {
    id: 'user-admin-01',
    username: 'admin',
    name: 'چیف نکاح رجسٹرار',
    role: 'admin', // 'admin' (مکمل اختیارات)
    password: 'admin786', // ڈیفالٹ پاسورڈ (سیٹنگز سے تبدیل ہو سکتا ہے)
    phone: '0300-7654321',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-staff-01',
    username: 'assistant',
    name: 'نائب نکاح خواں / کاتب',
    role: 'staff', // 'staff' (صرف اندراج اور پرنٹ، ڈیلیٹ ممنوع)
    password: 'staff123',
    phone: '0300-1122334',
    createdAt: new Date().toISOString()
  }
];

export const authService = {
  // ۱. تمام صارفین کی لسٹ حاصل کریں
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_USERS;
    }
  },

  // ۲. صارفین محفوظ کریں
  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      // کلاؤڈ پر بھی سنک کریں
      users.forEach(async (u) => {
        try {
          await setDoc(doc(db, FIREBASE_COLLECTION_USERS, u.id), u, { merge: true });
        } catch (e) {
          console.warn('Firebase user sync skipped offline');
        }
      });
      return true;
    } catch (e) {
      console.error('Error saving users:', e);
      return false;
    }
  },

  // ۳. لاگ ان لاجک (Authentication)
  login(usernameOrPhone, password, rememberMe = true) {
    const users = this.getUsers();
    const cleanInput = (usernameOrPhone || '').trim().toLowerCase();
    
    const user = users.find(
      (u) => (u.username.toLowerCase() === cleanInput || (u.phone && u.phone.replace(/\D/g, '') === cleanInput.replace(/\D/g, ''))) &&
             u.password === password
    );

    if (user) {
      const session = {
        userId: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        loggedInAt: new Date().toISOString()
      };

      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
      } else {
        sessionStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
      }

      return { success: true, user: session };
    }

    return { 
      success: false, 
      message: 'درج کردہ یوزر نیم یا پاسورڈ درست نہیں ہے۔ برائے مہربانی دوبارہ کوشش کریں۔' 
    };
  },

  // ۴. موجودہ فعال صارف (Current Session)
  getCurrentUser() {
    try {
      const sessionData = localStorage.getItem(STORAGE_KEY_AUTH) || sessionStorage.getItem(STORAGE_KEY_AUTH);
      if (!sessionData) return null;
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  },

  // ۵. لاگ آؤٹ
  logout() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  },

  // ۶. اختیارات کی تصدیق (Role-Based Authorization)
  can(action) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // ایڈمن کے پاس تمام اختیارات ہیں
    if (currentUser.role === 'admin') return true;

    // اگر سٹاف / کاتب ہو تو اس کے اختیارات کی تفریق
    switch (action) {
      case 'view_records':
      case 'create_record':
      case 'edit_record':
      case 'print_certificate':
      case 'mark_delivery':
        return true; // سٹاف اندراج اور پرنٹ کر سکتا ہے
      case 'delete_record':
      case 'manage_users':
      case 'change_registrar_profile':
      case 'export_backup':
        return false; // سٹاف پرانا ریکارڈ ڈیلیٹ یا پروفائل تبدیل نہیں کر سکتا
      default:
        return false;
    }
  },

  // ۷. پاسورڈ تبدیل کرنا
  changePassword(userId, oldPassword, newPassword) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    
    if (index === -1) {
      return { success: false, message: 'صارف نہیں ملا۔' };
    }

    if (users[index].password !== oldPassword) {
      return { success: false, message: 'موجودہ پرانا پاسورڈ درست نہیں ہے۔' };
    }

    users[index].password = newPassword;
    users[index].updatedAt = new Date().toISOString();
    this.saveUsers(users);

    return { success: true, message: 'پاسورڈ کامیابی سے تبدیل ہو گیا ہے۔' };
  },

  // ۸. نیا صارف / اسسٹنٹ شامل کرنا (صرف ایڈمن کر سکتا ہے)
  addUser(newUserData) {
    const users = this.getUsers();
    
    // یوزر نیم کی انفرادیت چیک کریں
    if (users.some((u) => u.username.toLowerCase() === newUserData.username.toLowerCase())) {
      return { success: false, message: 'یہ یوزر نیم پہلے سے موجود ہے۔ کوئی دوسرا نام منتخب کریں۔' };
    }

    const newUser = {
      ...newUserData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, user: newUser };
  },

  // ۹. صارف کو ڈیلیٹ کرنا
  deleteUser(userId) {
    const users = this.getUsers();
    // چیف ایڈمن کو ڈیلیٹ نہیں کیا جا سکتا
    if (users.length <= 1) {
      return { success: false, message: 'کم از کم ایک چیف رجسٹرار اکاؤنٹ کا ہونا لازمی ہے۔' };
    }

    const filtered = users.filter((u) => u.id !== userId);
    this.saveUsers(filtered);
    return { success: true };
  }
};
