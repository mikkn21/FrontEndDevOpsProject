import React from 'react';
import './AssignmentStatus.css'; 

interface AssignmentStatusProps {
    // Submitted or not-submitted or UPLOADED
    status: string; 
    evaluationStatus?: 'SUCCESS' | 'ERROR' | null;
}

const AssignmentStatus: React.FC<AssignmentStatusProps> = ({ status, evaluationStatus }) => {
    const className = status.replace(/\s+/g, '-').toLowerCase();

    return (
        <div className="assignment-status">
            <span>Submission status: </span>
            <span className={className}>{status}</span>
            {evaluationStatus === 'SUCCESS' && <span className="status-icon success">&#10003;</span>} {/* Green checkmark */}
            {evaluationStatus === 'ERROR' && <span className="status-icon error">&#10007;</span>} {/* Red X */}
        </div>
    );
};

export default AssignmentStatus;