/**
 * گوگل فائر بیس کلاؤڈ ڈیٹا بیس سروس
 * تمام موبائلز اور کمپیوٹرز پر ریئل ٹائم ڈیٹا سنک، لائیو اپڈیٹس اور کلاؤڈ اسٹوریج
 */
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_RECORDS = 'nikkah_records';
const COLLECTION_SETTINGS = 'nikkah_settings';

export const firebaseService = {
  // ۱. ریئل ٹائم لائیو ریکارڈز لسنر (ہر موبائل اور پی سی پر خودکار اپڈیٹ)
  subscribeToRecords(onRecordsChanged, onError) {
    try {
      const q = query(collection(db, COLLECTION_RECORDS), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const records = [];
        snapshot.forEach((docSnap) => {
          records.push(docSnap.data());
        });
        onRecordsChanged(records);
      }, (err) => {
        console.error('Firebase snapshot error:', err);
        if (onError) onError(err);
      });
    } catch (e) {
      console.error('Error subscribing to Firebase:', e);
      return () => {};
    }
  },

  // ۲. ایک ریکارڈ کلاؤڈ پر محفوظ کریں (Add or Update)
  async saveRecord(record) {
    try {
      const docRef = doc(db, COLLECTION_RECORDS, record.id);
      await setDoc(docRef, {
        ...record,
        syncedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (e) {
      console.error('Error saving record to Firebase:', e);
      return false;
    }
  },

  // ۳. ریکارڈ کلاؤڈ سے ڈیلیٹ کریں
  async deleteRecord(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_RECORDS, id));
      return true;
    } catch (e) {
      console.error('Error deleting record from Firebase:', e);
      return false;
    }
  },

  // ۴. تمام لوکل ریکارڈز کو کلاؤڈ پر منتقل کریں (One-time Sync)
  async syncAllLocalToCloud(localRecords) {
    try {
      const promises = localRecords.map((r) => this.saveRecord(r));
      await Promise.all(promises);
      return true;
    } catch (e) {
      console.error('Error bulk syncing to Firebase:', e);
      return false;
    }
  },

  // ۵. کلاؤڈ سے ایک بار تمام ریکارڈز لائیں
  async fetchAllRecords() {
    try {
      const q = query(collection(db, COLLECTION_RECORDS), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const records = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data());
      });
      return records;
    } catch (e) {
      console.error('Error fetching from Firebase:', e);
      return [];
    }
  },

  // ۶. نکاح خواں پروفائل کلاؤڈ پر محفوظ کریں
  async saveProfile(profile) {
    try {
      await setDoc(doc(db, COLLECTION_SETTINGS, 'registrar_profile'), profile, { merge: true });
      return true;
    } catch (e) {
      console.error('Error saving profile to Firebase:', e);
      return false;
    }
  }
};
