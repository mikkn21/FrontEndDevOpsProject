import React, {useEffect, useState} from 'react';
import './SubmissionsModal.css';
import Modal from 'react-modal';
import { Submission } from '../../utils/types';
import { AiOutlineRedo, AiOutlineStop, AiOutlineFileZip, AiOutlineFileText } from "react-icons/ai";
import axios from 'axios';
import { convertToCSV, downloadCSV  } from '../../utils/cvsUtils';
import { downloadLogsZip } from '../../utils/logsUtills';
import { config } from '../../config';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch' as const, // Ensuring strict typing
        borderRadius: '4px',
        outline: 'none',
        padding: '20px'
    }
};

interface SubmissionsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    submissions: Submission[];
}

const SubmissionsModal: React.FC<SubmissionsModalProps> = ({ isOpen, onRequestClose, submissions : initialSubmissions }) => {
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
    const [openSubmissionsIds, setOpenSubmissionsIds] = useState<Set<number>>(new Set());
    const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
    const [error, setError] = useState<{ message: string } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const submissionsPerPage = 1;

    const endpoint = `${config.VITE_BACKEND_URL}`;


    useEffect(() => {
        setError(null);   
        setSubmissions(initialSubmissions);
    }, [initialSubmissions]);

    const toggleDetails = (id: number) => {
        setOpenSubmissionsIds(prevOpenIds => {
            const newOpenIds = new Set(prevOpenIds); 
            if (newOpenIds.has(id)) {
                newOpenIds.delete(id); // If the ID is already open, remove it (close the details)
            } else {
                newOpenIds.add(id); // Otherwise, add the ID (open the details)
            }
            return newOpenIds;
        });
    };

    // Extract the metadata of a single submission
    const extractMetadata = (submission: Submission) => {
        const submissionsArray = [submission];
        const csvString = convertToCSV(submissionsArray);
        const filename = `metadata_${submission.studentName}_${submission.id}.csv`;
        downloadCSV(csvString, filename);
    };

    // Extract the metadata of all submissions
    const extractAllMetadata = () => {
        const csvString = convertToCSV(submissions);
        const filename = 'all_submissions_metadata.csv';
        downloadCSV(csvString, filename);
    };

    // Function to download logs for a single submission
    const downloadIndividualLog = (submission: Submission) => {
        downloadLogsZip([submission], `log_${submission.studentId}.zip`);
    };

    // Function to download logs for all submissions
    const downloadAllLogs = () => {
        downloadLogsZip(submissions, "all_submission_logs.zip");
    };

    const reevaluateSubmission = async (id: number) => {
        setError(null); 
        setLoadingIds(prev => new Set(prev.add(id)));
        try {
            // Simulate a delay of 2000 milliseconds (2 seconds)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const reEndpoint = `${endpoint}/solution/evaluateSolution/${id}`; 
            const response = await axios.get(reEndpoint);
            const updatedSubmission = response.data; // Assuming the response is a new submission object
            
            const updatedSubmissions: Submission[] = submissions.map(sub => {
                if (sub.id === id) {
                    return { ...sub, ...updatedSubmission }; 
                }
                return sub;
            });

            setSubmissions(updatedSubmissions);
        } catch (error) {
            console.error('Failed to reevaluate submission:', error);
            setError({ message: "Failed to reevaluate the submission. Please try again." });
        } finally {
            setLoadingIds(prev => {
                const newLoadingIds = new Set(prev);
                newLoadingIds.delete(id);
                return newLoadingIds;
            }); 
        }
    };

    
    const stopEvaluation = async (id: number) => {
        setError(null);
        try {
            const stopEndpoint = `${endpoint}/stop/${id}`; // not implemented yet
            const response = await axios.post(stopEndpoint); // assuming a new submission object is returned
            const updatedSubmission = response.data;
            
            const updatedSubmissions: Submission[] = submissions.map(sub => {
                if (sub.id === id) {
                    return { ...sub, ...updatedSubmission }; 
                }
                return sub;
            });

            setSubmissions(updatedSubmissions);
        } catch (error) {
            console.error('Failed to stop submission:', error);
            setError({ message: "Failed to stop the evaluation. Please try again." });
        } 
    };

    const stopAllEvaluations = async () => {
        setError(null);
        try {
            await Promise.all(submissions.map(async (submission) => {
                await stopEvaluation(submission.id);
            }));
        } catch (error) {
            console.error('Failed to stop all submissions:', error);
            setError({ message: "Failed to stop all evaluations. Please try again." });
        }
    };


    // Pagination logic
    const indexOfLastSubmission = currentPage * submissionsPerPage;
    const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
    const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

    const nextPage = () => {
        if (currentPage < Math.ceil(submissions.length / submissionsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };



    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Submissions Modal"
        >
            <h2 className='headline'>Submissions</h2>
            {error && <p className="error">{error.message}</p>}
            <div>
                {currentSubmissions.map(submission => (
                    <div key={submission.id} className="submission-item">
                        <div className="submission-header" onClick={() => toggleDetails(submission.id)}>
                            <div className="submission-info">  
                                <span className="submission-toggle-icon">
                                    {openSubmissionsIds.has(submission.id) ? '▼' : '▶'}
                                </span>
                                {submission.studentName || 'Unnamed Student'}
                            </div>
                            <div className="btn-group">
                                <button 
                                    title="Trigger the re-evaluation of a submission"
                                    onClick={(e) => { e.stopPropagation(); reevaluateSubmission(submission.id); }}>
                                    {loadingIds.has(submission.id) ? <AiOutlineRedo className="spinner" /> : <AiOutlineRedo />}
                                </button>
                                <button 
                                    title="Stop the evaluation of a submission"
                                    onClick={(e) => { e.stopPropagation(); stopEvaluation(submission.id);}}>
                                    <AiOutlineStop />
                                </button>
                                <button 
                                    title="Extract in bulk all the student’s submissions logs in a zip file"
                                    onClick={(e) => { e.stopPropagation(); downloadIndividualLog(submission) }}>
                                    <AiOutlineFileZip />
                                </button>
                                <button 
                                    title="Extract in bulk all the student’s submission metadata in a CSV file"
                                    onClick={(e) => { e.stopPropagation(); extractMetadata(submission) }}>
                                    <AiOutlineFileText />
                                </button>
                            </div>
                        </div>
                        {openSubmissionsIds.has(submission.id) && (
                            <div className="submission-details">
                                <p>Id: {submission.id}</p>
                                <p>Evaluation Status: {submission.evaluationStatus}</p>
                                <p>Result: {submission.result}</p>
                            </div>
                        )}
                    </div> 
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} of {Math.ceil(submissions.length / submissionsPerPage)}</span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(submissions.length / submissionsPerPage)}>Next</button>
            </div>
            <div className="footer">
                <button className="close-button" onClick={onRequestClose}>Close</button>
                <button title="stop the evaluation of a submission" className="stop-button"  onClick={stopAllEvaluations}>Stop</button>
                <button title="extract in bulk all the students’ submissions logs in a zip file" className="Extract-button" onClick={downloadAllLogs}>Logs</button>
                <button title=" extract in bulk all the students’ submission metadata in a CSV file"className="Extract-button" onClick={extractAllMetadata}>Metadata</button>
            </div>
        </Modal>
    );
};

export default SubmissionsModal;
