import React, { useState } from 'react'; 
import './assignmentCell.css';
import AssignmentStatus from '../AssignmentStatus/AssignmentStatus';
import FileUploadButton from '../Button/FileUploadButton';
import SubmitButton from '../Button/SubmitButton';
import fileIcon from '../../assets/icons8-file.svg'

interface AssignmentCellProps {
    AssignmentName?: string | null; 
    dueDate?: string | null;
    isPast?: boolean; // Optional prop to indicate if the assignment is in the past
}

const AssignmentCell: React.FC<AssignmentCellProps> = ({ AssignmentName, dueDate, isPast}) => {

    const effectiveAssignmentName = AssignmentName || "Default assignment name";

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('NOT SUBMITTED'); 
    const [evaluationStatus, setEvaluationStatus] = useState<null | 'SUCCESS' | 'ERROR'>(null);
  
    const handleDataSubmit = (result: 'SUCCESS' | 'ERROR') => {
      setEvaluationStatus(result);
      if (result === 'SUCCESS') {
        setStatus('SUBMITTED');
      } else {
        setStatus('ERROR');
      }
    };
  
    const handleFileUpload = (newStatus: string, uploadedFile: File) => {
      setStatus(newStatus);
      setFile(uploadedFile);
    };

    const handleFileRemove = () => {
      setFile(null);
      setStatus('NOT SUBMITTED');
      setEvaluationStatus(null);
    };

    return (
      <div className='cell'>
          <h2>{effectiveAssignmentName}</h2>
          <div className='left-align'>
            <AssignmentStatus status={status} evaluationStatus={evaluationStatus} />
            <p>Due date: {dueDate || 'No due date'}</p>
          </div>
          <div className ='file-info'> 
            {file ? (
              <>
                <img src={fileIcon} alt="file type" className="file-icon" />
                <p>{file.name}</p>
                <div className='remove-file' onClick={handleFileRemove}>&times;</div>
              </>
            ) : null}
          </div>
        <div className='buttons-container'>
          <FileUploadButton 
            onFileUploadStatus={handleFileUpload}
            disabled={isPast}
             />
          <SubmitButton
            fileReference={file ? file.name : ""}  // Ensure a string is always passed
            onDataSubmit={handleDataSubmit}
            disabled={!file || isPast}
            testMode={true}
          />
        </div>
      </div>
  );
}

export default AssignmentCell;
