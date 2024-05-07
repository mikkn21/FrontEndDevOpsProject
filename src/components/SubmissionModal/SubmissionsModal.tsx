// SubmissionsModal.jsx
import React, {useState} from 'react';
import './SubmissionsModal.css';
import Modal from 'react-modal';
import { Submission } from '../../utils/types';

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

const SubmissionsModal: React.FC<SubmissionsModalProps> = ({ isOpen, onRequestClose, submissions }) => {
    const [openSubmissionsIds, setOpenSubmissionsIds] = useState<Set<number>>(new Set());

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


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Submissions Modal"
        >
            <h2 className='headline'>Submissions</h2>
            <div>
                {submissions.map(submission => (
                    <div key={submission.id} className="submission-item">
                        <div className="submission-header" onClick={() => toggleDetails(submission.id)}>
                            <span className="submission-toggle-icon">
                                {openSubmissionsIds.has(submission.id) ? '▼' : '▶'}
                            </span>
                            {submission.studentName || 'Unnamed Student'}
                        </div>
                        {openSubmissionsIds.has(submission.id) && (
                            <div className="submission-details">
                                <p>Status: {submission.status}</p>
                                <p>Result: {submission.result}</p>
                                <p>Output: {submission.output}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button className="close-button" onClick={onRequestClose}>Close</button>
        </Modal>
    );
};

export default SubmissionsModal;
