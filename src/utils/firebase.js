import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence 
} from 'firebase/firestore';

// آفیشل لائیو فائر بیس کنفیگریشن
export const firebaseConfig = {
  apiKey: "AIzaSyCkPG51sz-RSvjc-cYTK_ClSc64uPw-ZB8",
  authDomain: "nikkah-rms.firebaseapp.com",
  projectId: "nikkah-rms",
  storageBucket: "nikkah-rms.firebasestorage.app",
  messagingSenderId: "23448841757",
  appId: "1:23448841757:web:217360c23b631b86b560f4",
  measurementId: "G-YSL5FDNFG9"
};

// فائر بیس شروع کرنا
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// آف لائن سپورٹ فعال کرنا (تاکہ نیٹ نہ ہو تب بھی موبائل پر ڈیٹا محفوظ رہے)
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistence is not supported in this browser');
    }
  });
} catch (e) {
  // پہلے سے فعال ہے
}
