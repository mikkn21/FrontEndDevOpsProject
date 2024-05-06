import React, { useState } from 'react'; 
import './assignmentCell.css';
import AssignmentStatus from '../AssignmentStatus/AssignmentStatus';
import FileUploadButton from '../Button/FileUploadButton';
import SubmitButton from '../Button/SubmitButton';
import fileIcon from '../../assets/icons8-file.svg'
import { AiOutlinePlayCircle, AiOutlinePauseCircle, AiOutlineDelete, AiOutlineSetting } from "react-icons/ai";
import { Assignment } from '../../utils/types';
import { getCookieRole } from '../../utils/cookieUtils';

interface AssignmentCellProps {
    assignment : Assignment;
    isPast?: boolean; 
    onPause?: () => void;
    onDelete?: (id: number) => void;
    onConfigure?: (id: number) => void;
}

const AssignmentCell: React.FC<AssignmentCellProps> = ({assignment, isPast, onPause, onDelete, onConfigure }) => {

    const effectiveAssignmentName = assignment.name || "Default assignment name";

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState('NOT SUBMITTED'); 
    const [evaluationStatus, setEvaluationStatus] = useState<null | 'SUCCESS' | 'ERROR'>(null);

    const role = getCookieRole();

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

    // Make assignemnt with visible false dimmed for teachers
    const isTeacherAndHidden = role === 'teacher' && !assignment.visible;

    return (
      <div className={`cell ${isTeacherAndHidden ? 'dimmed' : ''}`}>
        <div className='teacherStuff'>
          {onDelete && (
                  <button className="delete-button" onClick={() => onDelete(assignment.id)}>
                      <AiOutlineDelete />
                  </button>
              )}
            {onPause && (
              <button className="pause-button" onClick={onPause}>
                    {assignment.isPaused ? <AiOutlinePlayCircle /> : <AiOutlinePauseCircle />}
              </button>
            )}
            {onConfigure && (
              <button className="configure-button" onClick={() => onConfigure(assignment.id)}>
                  <AiOutlineSetting />
              </button>
            
            )}
          </div>
          <h2>{effectiveAssignmentName}</h2>
          <div className='left-align'>
            <AssignmentStatus status={status} evaluationStatus={evaluationStatus} />
            <p>Due date: {assignment.dueDate || 'No due date'}</p>
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
            disabled={isPast || assignment.isPaused}
             />
          <SubmitButton
            fileReference={file ? file.name : ""}  // Ensure a string is always passed
            onDataSubmit={handleDataSubmit}
            disabled={!file || isPast || assignment.isPaused}
            testMode={true}
          />
        </div>
      </div>
  );
}

export default AssignmentCell;
