import React, { useRef} from "react";
import "./Button.css";

interface FileUploadButtonProps {
  onFileUploadStatus: (fileToSubmit: File) => void;
  disabled?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileUploadStatus, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      onFileUploadStatus(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <button className="btn" onClick={handleButtonClick} disabled={disabled}>
        {"Upload"}
      </button>
    </div>
  );
};

export default FileUploadButton;
