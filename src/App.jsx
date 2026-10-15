import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import NewNikkahForm from './components/NewNikkahForm';
import RecordsList from './components/RecordsList';
import PrintCertificateModal from './components/PrintCertificateModal';
import RecordDetailsModal from './components/RecordDetailsModal';
import SettingsModal from './components/SettingsModal';
import { storageService } from './utils/storageService';
import { LayoutDashboard, FilePlus2, BookOpen, Settings } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState([]);
  const [profile, setProfile] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard', 'new_form', 'records'
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecordForView, setSelectedRecordForView] = useState(null);
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('nikkah_theme') === 'dark';
  });

  // تھیم کی تبدیلی
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('nikkah_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('nikkah_theme', 'light');
    }
  }, [darkMode]);

  // ابتدائی ڈیٹا لوڈ کرنا
  useEffect(() => {
    const loadedRecords = storageService.getRecords();
    const loadedProfile = storageService.getProfile();
    setRecords(loadedRecords);
    setProfile(loadedProfile);
  }, []);

  // نیا یا ترمیم شدہ ریکارڈ محفوظ کرنا
  const handleSaveRecord = (recordData) => {
    if (editingRecord) {
      const updated = storageService.updateRecord(editingRecord.id, recordData);
      if (updated) {
        setRecords(storageService.getRecords());
        setEditingRecord(null);
        setCurrentTab('records');
      }
    } else {
      const created = storageService.addRecord(recordData);
      setRecords(storageService.getRecords());
      setCurrentTab('records');
      // فورا پرنٹ کا آپشن دکھائیں
      setSelectedRecordForPrint(created);
    }
  };

  // ریکارڈ ڈیلیٹ کرنا
  const handleDeleteRecord = (id) => {
    storageService.deleteRecord(id);
    setRecords(storageService.getRecords());
  };

  // ایڈٹ موڈ میں کھولنا
  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setSelectedRecordForView(null);
    setCurrentTab('new_form');
  };

  // پروفائل محفوظ کرنا
  const handleSaveProfile = (newProfile) => {
    storageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  return (
    <div className="app-container">
      {/* ہیڈر بار */}
      <Header 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenNewForm={() => {
          setEditingRecord(null);
          setCurrentTab('new_form');
        }}
        profile={profile}
      />

      {/* نیویگیشن ٹیبز بار */}
      <nav className="nav-tabs-bar no-print">
        <button 
          className={`nav-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            setEditingRecord(null);
            setCurrentTab('dashboard');
          }}
        >
          <LayoutDashboard size={18} />
          <span>مرکزی ڈیش بورڈ</span>
        </button>

        <button 
          className={`nav-tab-btn ${currentTab === 'new_form' ? 'active' : ''}`}
          onClick={() => {
            setEditingRecord(null);
            setCurrentTab('new_form');
          }}
        >
          <FilePlus2 size={18} />
          <span>{editingRecord ? 'ریکارڈ میں ترمیم' : 'نیا نکاح اندراج'}</span>
        </button>

        <button 
          className={`nav-tab-btn ${currentTab === 'records' ? 'active' : ''}`}
          onClick={() => {
            setEditingRecord(null);
            setCurrentTab('records');
          }}
        >
          <BookOpen size={18} />
          <span>تمام رجسٹرڈ ریکارڈز ({records.length})</span>
        </button>
      </nav>

      {/* مرکزی مواد */}
      <main>
        {currentTab === 'dashboard' && (
          <Dashboard 
            records={records}
            onNewEntry={() => {
              setEditingRecord(null);
              setCurrentTab('new_form');
            }}
            onViewRecord={(r) => setSelectedRecordForView(r)}
            onPrintRecord={(r) => setSelectedRecordForPrint(r)}
            onViewAllRecords={() => setCurrentTab('records')}
          />
        )}

        {currentTab === 'new_form' && (
          <NewNikkahForm 
            onSave={handleSaveRecord}
            onCancel={() => {
              setEditingRecord(null);
              setCurrentTab(records.length > 0 ? 'records' : 'dashboard');
            }}
            initialData={editingRecord}
            profile={profile}
          />
        )}

        {currentTab === 'records' && (
          <RecordsList 
            records={records}
            onNewEntry={() => {
              setEditingRecord(null);
              setCurrentTab('new_form');
            }}
            onViewRecord={(r) => setSelectedRecordForView(r)}
            onEditRecord={handleEditRecord}
            onPrintRecord={(r) => setSelectedRecordForPrint(r)}
            onDeleteRecord={handleDeleteRecord}
          />
        )}
      </main>

      {/* موڈلز (Popups) */}
      {selectedRecordForPrint && (
        <PrintCertificateModal 
          record={selectedRecordForPrint}
          onClose={() => setSelectedRecordForPrint(null)}
          profile={profile}
        />
      )}

      {selectedRecordForView && (
        <RecordDetailsModal 
          record={selectedRecordForView}
          onClose={() => setSelectedRecordForView(null)}
          onEdit={handleEditRecord}
          onPrint={(r) => {
            setSelectedRecordForView(null);
            setSelectedRecordForPrint(r);
          }}
          onRecordUpdated={(updated) => {
            setRecords(storageService.getRecords());
            setSelectedRecordForView(updated);
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal 
          profile={profile}
          onSaveProfile={handleSaveProfile}
          onClose={() => setShowSettingsModal(false)}
          recordsCount={records.length}
        />
      )}
    </div>
  );
}
