'use client';

import { Dialog } from 'primereact/dialog';
import { ReactNode, useEffect, useState } from 'react';

interface ChildModalWrapperProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  width?: string;
  dismissableMask?: boolean;
}

const ChildModalWrapper: React.FC<ChildModalWrapperProps> = ({
  title = 'Modal',
  open,
  onClose,
  children,
  className = '',
  width = '50%',
  dismissableMask = true,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () =>
      setIsDarkMode(document.documentElement.classList.contains('dark'));

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Dialog
      header={title}
      visible={open}
      onHide={onClose}
      className={`rounded-xl shadow-lg ${className}`}
      style={{
        width: '90%',
        maxWidth: '768px',
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827',
      }}
      modal
      closable
      dismissableMask={dismissableMask}
      contentClassName="custom-dialog-content"
    >
      {children}

      <style jsx global>{`
        .p-dialog-header {
          background-color: ${isDarkMode ? '#1f2937' : '#f9fafb'} !important;
          color: ${isDarkMode ? '#f3f4f6' : '#111827'} !important;
          border-bottom: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
        }

        .p-dialog-content {
          background-color: ${isDarkMode ? '#111827' : '#ffffff'} !important;
          color: ${isDarkMode ? '#f3f4f6' : '#111827'} !important;
        }

        .p-dialog-footer {
          background-color: ${isDarkMode ? '#1f2937' : '#f9fafb'} !important;
          border-top: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
        }
      `}</style>
    </Dialog>
  );
};

export default ChildModalWrapper;
