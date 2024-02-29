import React, { useRef } from 'react';
import axios from 'axios';
import './Button.css';

interface FileUploadButtonProps {
    onFileUploadStatus: (status: string, fileRef: string) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({onFileUploadStatus }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const formData = new FormData();
            formData.append('file', files[0]);
            
            const endpoint="/api/API_ENDPOINT_HERE"

            axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log('File uploaded successfully', response.data);
                const fileRef = response.data.fileRef; // Here i assume that the microservice gives back a ID or token for the file
                onFileUploadStatus("SUBMITTED", fileRef);
                // Handle successful upload here
            })
            .catch(error => {
                console.error('Error uploading file', error);
                onFileUploadStatus("ERROR", "");
                // Handle error here
            });
        }
    };

    return (
        <div>
            <input 
                type="file" 
                style={{ display: 'none' }} 
                ref={fileInputRef} 
                onChange={handleFileChange} 
            />
            <button className="btn" onClick={handleButtonClick}>Upload</button>
        </div>
    );
};

export default FileUploadButton;
