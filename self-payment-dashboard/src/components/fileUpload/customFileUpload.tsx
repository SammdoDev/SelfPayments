'use client';

import React from 'react';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import '@/styles/custom-file-upload.css'; // ⬅️ Import CSS dark/light style

interface CustomFileUploadProps {
  label?: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  className?: string;
  maxFileSize?: number;
  mode?: 'basic' | 'advanced';
}

const CustomFileUpload: React.FC<CustomFileUploadProps> = ({
  label = 'Upload File',
  onFileSelect,
  accept = 'image/*',
  className = '',
  maxFileSize = 5 * 1024 * 1024, // 5MB
  mode = 'advanced',
}) => {
  const handleSelect = (event: FileUploadSelectEvent) => {
    const file = event.files?.[0] || null;
    onFileSelect(file);
  };

  const handleClear = () => {
    onFileSelect(null);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <FileUpload
        name="file"
        accept={accept}
        customUpload
        mode={mode}
        chooseLabel="Browse"
        maxFileSize={maxFileSize}
        emptyTemplate={<p className="m-0">Drag and drop file here to upload.</p>}
        onSelect={handleSelect}
        onClear={handleClear}
        className="custom-file-upload w-full"
      />
    </div>
  );
};

export default CustomFileUpload;
