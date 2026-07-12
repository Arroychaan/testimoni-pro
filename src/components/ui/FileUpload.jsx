import { useRef, useState } from 'react';
import { Upload, X, Image, Film } from 'lucide-react';
import './FileUpload.css';

export default function FileUpload({
  accept = 'image/*',
  multiple = true,
  maxFiles = 3,
  files = [],
  onChange,
  label = 'Upload foto',
  icon: Icon = Image,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    const total = files.length + fileList.length;
    if (total > maxFiles) {
      alert(`Maksimal ${maxFiles} file`);
      return;
    }
    onChange([...files, ...fileList]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="file-upload-wrapper">
      <div
        className={`file-upload-dropzone ${isDragging ? 'file-upload-dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <Icon size={28} className="file-upload-icon" />
        <span className="file-upload-label">{label}</span>
        <span className="file-upload-hint">
          Tarik dan lepas file ke sini atau klik untuk memilih (maksimum {maxFiles})
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="file-upload-input"
          aria-label={label}
        />
      </div>

      {files.length > 0 && (
        <div className="file-upload-preview-list">
          {files.map((file, index) => (
            <div key={index} className="file-upload-preview-item">
              {file.type?.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="file-upload-preview-img"
                />
              ) : (
                <div className="file-upload-preview-file">
                  <Film size={20} />
                  <span>{file.name}</span>
                </div>
              )}
              <button
                type="button"
                className="file-upload-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                aria-label={`Hapus file ${index + 1}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
