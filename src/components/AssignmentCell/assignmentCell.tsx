import React, { useState } from 'react'; 
import './assignmentCell.css';
import AssignmentStatus from '../AssignmentStatus/AssignmentStatus';
import FileUploadButton from '../Button/FileUploadButton';
import SubmitButton from '../Button/SubmitButton';
import fileIcon from '../../assets/icons8-file.svg'
import { AiOutlinePlayCircle, AiOutlinePauseCircle, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";



interface AssignmentCellProps {
    assignmentId: number;
    assignmentName?: string | null;
    dueDate?: string | null;
    isPast?: boolean; 
    isPaused?: boolean;
    onPause?: () => void;
    onDelete?: (id: number) => void;
}

const AssignmentCell: React.FC<AssignmentCellProps> = ({ assignmentId, assignmentName, dueDate, isPast, isPaused, onPause, onDelete }) => {

    const effectiveAssignmentName = assignmentName || "Default assignment name";

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
        <div className='teacherStuff'>
          {onDelete && (
                  <button className="delete-button" onClick={() => onDelete(assignmentId)}>
                      <AiOutlineDelete />
                  </button>
              )}
            {onPause && (
              <button className="pause-button" onClick={onPause}>
                    {isPaused ? <AiOutlinePlayCircle /> : <AiOutlinePauseCircle />}
              </button>
            )}
          </div>
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
            disabled={isPast || isPaused}
             />
          <SubmitButton
            fileReference={file ? file.name : ""}  // Ensure a string is always passed
            onDataSubmit={handleDataSubmit}
            disabled={!file || isPast || isPaused}
            testMode={true}
          />
        </div>
      </div>
  );
}

export default AssignmentCell;
