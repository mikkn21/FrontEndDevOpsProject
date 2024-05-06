import React, { useState, useEffect } from 'react';
import Select, {MultiValue, ActionMeta} from 'react-select';
import '../AssignmentAddModal/inputModal.css';
import Button from '../Button/Button';
import axios from "axios";
import FileUploadButton from '../Button/FileUploadButton';
import fileIcon from '../../assets/icons8-file.svg'
import { Assignment, Student } from '../../utils/types';

interface InputModalProps {
    assignment: Assignment;
    isOpen: boolean;
    onClose: () => void;
    onSave: (assignment: { name: string; dueDate: string; selectedStudents: Student[]; file?: File | null }) => void;  
    testMode?: boolean;
}


const ConfigureModal: React.FC<InputModalProps> = ({assignment, isOpen, onClose, onSave, testMode=false}) => {
    const [name, setName] = useState(assignment.name);
    const [dueDate, setDueDate] = useState(assignment.dueDate);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>(assignment.selectedStudents || []); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);
    const [file, setFile] = useState<File | null>(assignment.file || null);

    const endpoint = `/api/ENDPOINT`; // Adjust URL to your actual API endpoint


    // Update the state when the assignment prop changes
    useEffect(() => {
        setName(assignment.name);
        setDueDate(assignment.dueDate);
        setSelectedStudents(assignment.selectedStudents || []);
        setFile(assignment.file || null);
    }, [assignment]);

    // call to backend to send the modified assignment
    const handleSubmit = async () => {
        if (testMode) {
            onSave({
                ...assignment,
                name,
                dueDate,
                selectedStudents,
                file
            }); 
            onClose();
        } else {
            try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('dueDate', dueDate);
            formData.append('selectedStudents', JSON.stringify(selectedStudents.map(student => student.id)));
            if (file) formData.append('file', file);
        
            await axios.put(`${endpoint}/${assignment.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        
            onSave({
                ...assignment,
                name,
                dueDate,
                selectedStudents,
                file
            }); 
            onClose();
            } catch (error) {
                console.error("Error updating assignment", error);
                setError({ message: "Failed to update the assignment. Please try again." });
            } finally {
            setLoading(false);
            }
        }
      };
      

      const handleStudentSelection = (
        selectedOptions: MultiValue<{ value: string; label: string; }>, 
        actionMeta: ActionMeta<{ value: string; label: string; }>
    ) => {
        if (!selectedOptions) {
            setSelectedStudents([]);
            return;
        }
        const selectedStudents = selectedOptions.map(option => students.find(student => student.id === option.value)).filter((student): student is Student => student !== undefined);
        setSelectedStudents(selectedStudents);
    };

    const handleFileUpload = (newStatus: string, uploadedFile: File) => {
        setFile(uploadedFile);
      };
  
      const handleFileRemove = () => {
        setFile(null);
      };


    if (!isOpen) return null;


   //backend call to get students
   useEffect(() => {
        if (testMode) {
            // Dummy test data
            setStudents([
                { id: '1', name: 'Alice Smith' },
                { id: '2', name: 'Bob Johnson' },
                { id: '3', name: 'Carol Williams' },
                { id: '4', name: 'Dave Jones' },
                { id: '5', name: 'Eve Brown' }
            ]);
            setLoading(false);
        } else {
            const fetchStudents = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(endpoint);
                    setStudents(response.data); 
                
                } catch (error) {
                    console.error('Failed to fetch students:', error);
                    setError({message : 'Failed to load students. Please try again.'});
                }
                setLoading(false);
            };
            if (isOpen) {
                fetchStudents();
            }
        }
    }, [isOpen, testMode]);

    return (
        <div className="modal">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error.message}</p>
            ) : (
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Configure Assignment</h2>
                    <input
                        type="text"
                        placeholder="Assignment Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className="student-list">
                        <Select 
                            options={students.map(student => ({
                                value: student.id,
                                label: student.name
                            }))}
                            isMulti
                            placeholder='Select students...'
                            onChange={handleStudentSelection}
                            defaultValue={selectedStudents.map(student => ({
                                value: student.id,
                                label: student.name
                            }))}
                            value={selectedStudents.map(student => ({
                                value: student.id,
                                label: student.name
                            }))}
                        />
                    </div>
                    <div className='date-row'>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div className='file-row'>
                        {file ? (
                        <div className='file-info'>
                            <img src={fileIcon} alt="file type" className="file-icon" />
                            <p>{file.name}</p>
                            <div className='remove-file' onClick={handleFileRemove}>&times;</div>
                        </div>
                         ) : null}
                         <div className='control-btn'>
                            <FileUploadButton 
                                onFileUploadStatus={handleFileUpload}
                            />
                            <Button onClick={handleSubmit}>Save</Button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    )};

export default ConfigureModal;
