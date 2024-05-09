import React, {useState} from 'react';
import axios from 'axios';
import Button from './Button';
import { Submission } from '../../utils/types';
import SubmissionsModal from '../SubmissionModal/SubmissionsModal';

interface ViewSubmissionsButtonProps {
  AssignmentId: number
  disabled?: boolean
  testMode?: boolean
}

const ViewSubmissionsButton: React.FC<ViewSubmissionsButtonProps> = ({ AssignmentId, disabled, testMode=false }) => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalIsOpen, setIsOpen] = useState(false); 
    

    const handleEvaluation = async () => { 
        if (disabled) {
            return;
        }

        setLoading(true);
        setError(null);

        if (testMode) {
            // Dummy data for testing
            setSubmissions([
                { id: 1, studentId: '1', studentName: 'John Doe', file: undefined, status: 'SUBMITTED', evaluationStatus: 'SUCCESS', log: 'Hello, World!', result: 'PASS'},
                { id: 2, studentId: '2', studentName: 'Jane Doe', file: undefined, status: 'SUBMITTED', evaluationStatus: 'ERROR', log: 'Hello, World!', result: 'FAIL'}
            ]);
            setLoading(false);
            setIsOpen(true); 
        } else {
            try {   
                // TODO: have an api endpoint that fetches all submissions for a given assignment
                const endpoint = `/api/EVALUATION_SERVICE_ENDPOINT/${AssignmentId}`;
                const response = await axios.get<Submission[]>(endpoint);
                setSubmissions(response.data); 
                setLoading(false);
                setIsOpen(true); 
            } catch (err: any) {
                setError(err.message || "Failed to fetch submissions");
                setLoading(false);
            }
        }
    };


    return (
        <>
            <Button onClick={handleEvaluation} disabled={disabled || loading}>
                {loading ? 'Loading...' : 'View Submissions'}
            </Button>
            {error && <p>Error: {error}</p>}
            <SubmissionsModal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                submissions={submissions}
            />
        </>
    );
};

export default ViewSubmissionsButton;