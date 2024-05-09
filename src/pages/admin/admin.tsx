import React, { useState, useEffect } from 'react';
import Navbar from '../../components/NavBar/navBar';
import axios from 'axios';
import { Person, Role } from '../../utils/types';
import './admin.css';
import Button from '../../components/Button/Button';
import { AiOutlineDelete, AiOutlinePauseCircle  } from "react-icons/ai";
import AddTeacherModal from '../../components/AddTeacherModal/AddTeacherModal';

type AdminProps = {
    testMode?: boolean;
};


const Admin: React.FC<AdminProps> = ({testMode = false}) => {
    const [students, setStudents] = useState<Person[]>([]); 
    const [teachers, setTeachers] = useState<Person[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<'all' | 'students' | 'teachers'>('all'); // filter types
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const itemsPerPage = 2;

    const baseEndpoint = `/api/ENDPOINT`; // Adjust URL to your actual API endpoint

    const addError = (newError: string) => {
        setErrors([newError]); 
    };

    useEffect(() => {
        setLoading(true); // Start loading
        if (testMode) {
            setStudents([
                { id: '1', name: 'Alice', role: Role.STUDENT },
                { id: '2', name: 'Bob', role: Role.STUDENT },
                { id: '3', name: 'Charlie', role: Role.STUDENT },
            ]);
            setTeachers([
                { id: '4', name: 'David', role: Role.TEACHER },
                { id: '5', name: 'Eve', role: Role.TEACHER },
            ]);
            setLoading(false); // End loading
        } else {
            console.log('Fetching students and teachers');
            const fetchStudents = async () => {
                try {
                    const studentEndpoint = `${baseEndpoint}/AAAstudents`;
                    const response = await axios.get<Person[]>(studentEndpoint);
                    setStudents(response.data);
                } catch (err) { 
                    console.error(err);
                    addError('Failed to fetch students');
                }
            };

            const fetchTeachers = async () => {
                try {
                    const teacherEndpoint = `${baseEndpoint}/AAAteacher`; 
                    const response = await axios.get<Person[]>(teacherEndpoint);
                    setTeachers(response.data);
                } catch (err) {
                    console.error(err);
                    addError('Failed to fetch teachers');
                }
            };

            Promise.all([fetchStudents(), fetchTeachers()]).finally(() => setLoading(false));
        }
    }, [testMode, baseEndpoint]);



    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    const handleDelete = async (id: string) => {
        try {
            const deleteEndpoint = `${baseEndpoint}/${id}`;
            await axios.delete(deleteEndpoint);  
            setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
            setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.id !== id));
        } catch (err) {
            console.error(err);  
            addError('Failed to delete');  
        }
    };
    
    const handlePause = (id: string) => {
        console.log("Pause", id);
    };


    // Combined list based on filter
    const combinedList = () => {
        if (filter === 'students') {
            return [...students];
        } else if (filter === 'teachers') {
            return [...teachers];
        }
        return [...teachers, ...students];
    };
   
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = combinedList().slice(indexOfFirstItem, indexOfLastItem);
    const totalItems = combinedList().length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <Navbar />
            {isLoading && <p>Loading...</p>}
            <div className='tableAdmin'>
                <div className='borderAdmin'>
                    <div className="table-headerAdmin">
                        <h1>Staff</h1>
                    </div>
                    <div className='table-content'>
                        <div className="control-rowAdmin">
                            <div>
                                <Button onClick={() => { setFilter('all'); setCurrentPage(1); }}>All</Button>
                                <Button onClick={() => { setFilter('students'); setCurrentPage(1); }}>Students</Button>
                                <Button onClick={() => { setFilter('teachers'); setCurrentPage(1); }}>Teachers</Button>
                            </div>
                            <Button onClick={openModal}>Add Teacher</Button>
                        </div>
                        <div>
                            {errors.map((error, index) => (
                                <p className='error' key={index}>Error: {error}</p>
                            ))}
                        </div>
                        <ul>
                            {currentItems.map((person, index) => (
                                <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {person.name}
                                    <div className='btn-stuff'>
                                        {person.role === Role.TEACHER && (
                                            <button title='pause teacher' onClick={() => handlePause(person.id)}>
                                                <AiOutlinePauseCircle />
                                            </button>
                                        )}
                                        <button title='delete person' onClick={() => handleDelete(person.id)}>
                                            <AiOutlineDelete />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='page-controlAdmin'>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>{currentPage} of {totalPages}</span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
            <AddTeacherModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>
    );
}

export default Admin;