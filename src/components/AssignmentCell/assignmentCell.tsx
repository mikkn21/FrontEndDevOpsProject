import React, { useState } from 'react'; 
import './assignmentCell.css';
import AssignmentStatus from '../AssignmentStatus/AssignmentStatus';
import FileUploadButton from '../Button/FileUploadButton';
import SubmitButton from '../Button/SubmitButton';


interface AssignmentCellProps {
    AssignmentName: string; 
}

const AssignmentCell: React.FC<AssignmentCellProps> = ({AssignmentName = "Default assignment name"}) => {
    const [fileReference, setFileReference] = useState<string | null>(null);
    const [status, setStatus] = useState('NOT SUBMITTED'); 
    const [evaluationStatus, setEvaluationStatus] = useState<null | 'SUCCESS' | 'ERROR'>(null);
  
    const handleDataSubmit = (result: 'SUCCESS' | 'ERROR') => {
      setEvaluationStatus(result);
    };
  
    const handleFileUpload = (newStatus: string, fileRef: string) => {
      setStatus(newStatus);
      setFileReference(fileRef); // store file ID or token given from the Microservice to send to the Submit button
    };



    return (
        <div className='cell'>
        <h3>{AssignmentName}</h3>
        <AssignmentStatus status={status} evaluationStatus={evaluationStatus} />
        <div>
          {fileReference ? <p>File uploaded: {fileReference}</p> : <p>No file uploaded</p>}
        </div>
        <FileUploadButton onFileUploadStatus={handleFileUpload} />
        {fileReference && <SubmitButton
          fileReference={fileReference}
          onDataSubmit={handleDataSubmit}
        />}
      </div>
    );
}

export default AssignmentCell; 