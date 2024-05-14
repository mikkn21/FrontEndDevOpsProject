import React, { useEffect, useRef, useState } from 'react'; 
import './assignmentCell.css';
import FileUploadButton from '../Button/FileUploadButton';
import SubmitButton from '../Button/SubmitButton';
import fileIcon from '../../assets/icons8-file.svg';
import { AiOutlinePlayCircle, AiOutlinePauseCircle, AiOutlineDelete, AiOutlineSetting } from "react-icons/ai";
import { Assignment, Submission } from '../../utils/types';
import { getCookieRole, getCookieUsername } from '../../utils/cookieUtils';
import ViewSubmissionsButton from '../Button/ViewSubmissionsButton';
import axios from 'axios';

interface AssignmentCellProps {
    assignment: Assignment;
    isPast?: boolean; 
    onPause?: () => void;
    onDelete?: (id: number) => void;
    onConfigure?: (id: number) => void;
    studentId: string | undefined;
}

const AssignmentCell: React.FC<AssignmentCellProps> = ({ assignment, isPast, onPause, onDelete, onConfigure, studentId }) => {

    const effectiveAssignmentName = assignment.name || "Default assignment name";
    
    const initialSubmissions = assignment.StudentSubmissions.filter(sub => sub.studentId === studentId);
    const [files, setFiles] = useState<Submission[]>(initialSubmissions);

    const [canUploadMore, setCanUploadMore] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const filesRef = useRef<Submission[]>(files);
    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const role = getCookieRole();
    const studentName = getCookieUsername();
    const baseEndpoint = `/api/ENDPOINT`; // Adjust URL to your actual API endpoint
    let testMode = true;

    const handleSubmissionSubmit = async () => {
      if (files.length === 0) {
        console.error("No file to submit.");
        return;
      }
      
      const fileToSubmit = files[files.length - 1]; // Get the last file

      if (fileToSubmit.evaluationStatus !== null) {
        console.error("File is already submitted or in progress.");
        return;
      }

      setLoading(true); 

      // Set initial loading status for the file to be submitted
      setFiles(prevFiles => prevFiles.map(f => 
        f === fileToSubmit ? {...f, evaluationStatus: 'LOADING'} : f
      ));

      if (testMode) {
        setTimeout(() => {
          const currentFiles = filesRef.current;
          if (!currentFiles.some(f => f.file === fileToSubmit.file)) {
              return; 
          }
          setFiles(prevFiles => prevFiles.map(f => 
              f.file === fileToSubmit.file ? { ...f, evaluationStatus: 'SUCCESS' as const } : f
          ));
          setCanUploadMore(true);
          setLoading(false);
          setSubmitted(true);
      }, 2500);
      } else {
        const formData = new FormData();
        formData.append("file", fileToSubmit.file);

        // Optional: Append additional data if needed
        formData.append("assignmentId", String(assignment.id));
        if (studentId) {
          formData.append("studentId", studentId);
        }
    
        try {
            setLoading(true); 
            const response = await axios.post(`${baseEndpoint}/submit/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const currentFiles = filesRef.current;
            if (!currentFiles.some(f => f.file === fileToSubmit.file)) {
                
                return; // Submission has been cancelled , do not update state
            }

            setFiles(prevFiles => prevFiles.map(f => f.file === fileToSubmit.file ? { ...f, evaluationStatus: 'SUCCESS' } : f));
            setCanUploadMore(true);
            setSubmitted(true);
        } catch (error) {
          console.error('Error uploading file:', error);
          setFiles(prevFiles => prevFiles.map(f => f.file === fileToSubmit.file ? {...f, evaluationStatus: 'ERROR'} : f));
        } finally {
            setLoading(false); 
        }
      }
    };
  
    const handleSubmissionUpload = (newFile: File) => {
      if (files.length >= assignment.maxSubmissions) {
          return;
      }

      const newSubmission: Submission = { 
          id: 0,
          studentId: studentId || '', 
          studentName: studentName || '', 
          file: newFile, 
          evaluationStatus: null,
          log: undefined,
          result: undefined,
      };
      setFiles((prevFiles) => [...prevFiles, newSubmission]);
      setCanUploadMore(false); 
      setSubmitted(false);
  };

    const handleFileRemove = async (index: number) => {
      const submissionToRemove = files[index];

      if (!submissionToRemove) {
          console.error("Submission not found");
          return;
      }

      if (submissionToRemove.evaluationStatus !== 'LOADING' && submissionToRemove.evaluationStatus !== null) {
        console.error("Cannot remove a submission that is already evaluated.");
        return;
    }

      if (submissionToRemove.evaluationStatus === 'LOADING') {
          handleCancelSubmission(submissionToRemove);
          return;
      }

      setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
      setCanUploadMore(true);
      setSubmitted(false);
      setLoading(false);
    };

    const handleCancelSubmission = async (submission: Submission) => {
        try {
            setLoading(true);
            await axios.post(`${baseEndpoint}/${assignment.id}/submissions/${submission.id}/cancel`);
            setFiles(prevFiles => prevFiles.filter(f => f !== submission));
            setCanUploadMore(true);
            setSubmitted(false);
        } catch (error) {
            submission.evaluationStatus = 'ERROR';
            console.error('Error cancelling submission:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string | null) => {
      switch (status) {
          case 'ERROR':
          case 'STOPPED':
              return {color: 'red'};
          case 'LOADING':
              return { color: 'orange' }; 
          case 'SUCCESS':
              return {color: 'green'};
          case 'PAUSED':
              return {color:'gray'};
          default:
              return {color:'black'};
      }
    };

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
            <p>Due date: {assignment.dueDate ? assignment.dueDate.toISOString().split('T')[0] : 'No due date'}</p>
          </div>
          {role === 'student' && (
            <div className ='file-info'> 
                {files.map((submission, index) => (
                  <div key={index} className="file-entry">
                  <span className='status-file'>
                    Status: <span style={getStatusColor(submission.evaluationStatus)}>
                      {submission.evaluationStatus || 'ready to submit'}
                    </span>
                  </span>
                    <div className="file-details">
                        <img src={fileIcon} alt="file type" className="file-icon" />
                        <p>{submission.file.name}</p>
                    </div>
                    {!submitted && (submission.evaluationStatus === "LOADING" || submission.evaluationStatus === null) && (
                                <div className='remove-file' onClick={() => handleFileRemove(index)}>&times;</div>
                    )}
                  </div>
                ))}
            </div>
          )}
        <div className='buttons-container'>
          {role === 'student' ? (
            <>
                <FileUploadButton 
                    onFileUploadStatus={handleSubmissionUpload} 
                    disabled={isPast || assignment.isPaused || (assignment.maxSubmissions === files.length) || !canUploadMore} 
                />
                <SubmitButton 
                    onClick={handleSubmissionSubmit}
                    disabled={submitted || isPast || assignment.isPaused}
                    loading={loading} 
                />
            </>
          ) : (
              <ViewSubmissionsButton AssignmentId={assignment.id} testMode={true} />
          )}
        </div>
      </div>
  );
}

export default AssignmentCell;
