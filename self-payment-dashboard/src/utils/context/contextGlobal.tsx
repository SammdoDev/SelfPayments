'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ToastContainer, toast, ToastOptions, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProgressBar } from 'primereact/progressbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '@/styles/confirm-dark.css';
import dayjs from "./dateUtils";

interface GlobalContextProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  showConfirm: (message: string, onAccept: () => void, onReject?: () => void) => void;
  setLoading: (value: boolean) => void;
  loading: boolean;
  dayjs: typeof dayjs;
}

const GlobalContext = createContext<GlobalContextProps>({
  showToast: () => {},
  showConfirm: () => {},
  setLoading: () => {},
  loading: false,
  dayjs,
});

export const useLayoutContext = () => useContext(GlobalContext);

interface ProviderProps {
  children: ReactNode;
}

export const ContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const options: ToastOptions = {
      position: 'top-right',
      autoClose: 3000,
      theme: isDarkMode ? 'dark' : 'light',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      transition: Slide,
      type,
    };
    toast(message, options);
  };

  const showConfirm = (message: string, onAccept: () => void, onReject?: () => void) => {
    confirmDialog({
      message,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Tidak',
      acceptClassName: 'p-button-danger',
      defaultFocus: 'reject',
      dismissableMask: true,
      accept: onAccept,
      reject: onReject,
    });
  };

  return (
    <GlobalContext.Provider value={{ showToast, showConfirm, setLoading, loading, dayjs }}>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 9999,
          }}
        >
          <ProgressBar
            mode="indeterminate"
            style={{
              height: '4px',
              backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb',
            }}
          />
        </div>
      )}

      <ConfirmDialog className={isDarkMode ? 'confirm-dark' : ''} />

      <ToastContainer theme={isDarkMode ? 'dark' : 'light'} />
      {children}
    </GlobalContext.Provider>
  );
};
