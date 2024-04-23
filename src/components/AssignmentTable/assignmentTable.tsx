import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assignmentTable.css';
import AssignmentCell from '../AssignmentCell/assignmentCell';
import { getCookie } from '../../utils/cookieUtils';
import Button from '../Button/Button';


interface Assignment {
    id: number;
    name: string;
    dueDate: string;
    // other properties...
}

interface AssignmentTableProps {
    testMode?: boolean;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ testMode = false }) => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{message: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 2; // Number of assignments per page



    useEffect(() => {
        if (testMode) {
            // In test mode, use dummy data instead of fetching from the API
            const testAssignments: Assignment[] = [
                { id: 1, name: 'Test Assignment 1', dueDate: '2024-05-01' },
                { id: 2, name: 'Test Assignment 2', dueDate: '2024-05-02' },
                { id: 3, name: 'Test Assignment 3', dueDate: '2024-05-03' },
                { id: 4, name: 'Test Assignment 4', dueDate: '2024-05-04' },
                { id: 5, name: 'Test Assignment 5', dueDate: '2024-05-05' },
                { id: 6, name: 'Test Assignment 6', dueDate: '2023-05-05' },
            ];
            setAssignments(testAssignments);
            setLoading(false);
        } else {
            const userId = getCookie('userId');
            if (!userId) {
                setError({ message: 'No user ID found in cookie' });
                setLoading(false);
                return;
            }
            const AssignmentEndpoint = `/api/EVALUATION_SERVICE_ENDPOINT/user/${userId}`;

            axios.get(AssignmentEndpoint)
                .then(response => {
                    setAssignments(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching assignments', error);
                    setError({ message: error.message || 'Error fetching assignments' });
                    setLoading(false);
                });
        }
    }, [testMode]); // Depend on testMode to re-run the effect when it changes



    useEffect(() => {
        // After fetching, apply filter initially to show current assignments
        const now = new Date();
        const currentAssignments = assignments.filter(a => new Date(a.dueDate) >= now);
        setFilteredAssignments(currentAssignments);
        // Reset to first page after filtering
        setCurrentPage(0);
    }, [assignments]);


    // Add methods to filter assignments
    const showCurrent = () => {
        const now = new Date();
        setFilteredAssignments(assignments.filter(a => new Date(a.dueDate) >= now));
        setCurrentPage(0);
    };

    const showPast = () => {
        const now = new Date();
        const pastAssignments = assignments.filter(a => new Date(a.dueDate) < now);
        setFilteredAssignments(pastAssignments);
        setCurrentPage(0);
    };

    // Add methods to handle pagination
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const previousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    // Slice the assignments to only show the ones for the current page
    const pagedAssignments = filteredAssignments.slice(currentPage * pageSize, (currentPage + 1) * pageSize);



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className='table'>
                <div className='table-header assignment-table-header'>
                    <h1>Assignments</h1>
                    <div>
                        <Button onClick={showCurrent}>Current</Button>
                        <Button onClick={showPast}>Past</Button>
                    </div>
                </div>
                <div >
                    {pagedAssignments.map(assignment => (
                        <AssignmentCell 
                            key={assignment.id} 
                            AssignmentName={assignment.name} 
                            dueDate={assignment.dueDate}
                            isPast={new Date(assignment.dueDate) < new Date()} 
                         />
                    ))}
                </div>
            </div>
            <div className='pagination'>
                <button onClick={previousPage} disabled={currentPage <= 0}>Previous</button>
                <span>Page {currentPage + 1}</span>
                <button onClick={nextPage} disabled={(currentPage + 1) * pageSize >= filteredAssignments.length}>Next</button>
            </div>
        </div>
    );
}

export default AssignmentTable;
