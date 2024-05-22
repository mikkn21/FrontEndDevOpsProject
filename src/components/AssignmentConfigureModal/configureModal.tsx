import React, { useState, useEffect } from 'react';
import Select, {MultiValue} from 'react-select';
import '../AssignmentAddModal/assignmentAddModal.css';
import Button from '../Button/Button';
import axios from "axios";
import FileUploadButton from '../Button/FileUploadButton';
import fileIcon from '../../assets/icons8-file.svg'
import { Assignment, Person, Role, Status } from '../../utils/types';
import { config } from '../../config';

interface InputModalProps {
    assignment: Assignment;
    isOpen: boolean;
    onClose: () => void;
    onSave: (assignment: Assignment) => void;
    testMode?: boolean;
}


const ConfigureModal: React.FC<InputModalProps> = ({assignment, isOpen, onClose, onSave, testMode=false}) => {
    const [name, setName] = useState(assignment.name);
    const [dueDate, setDueDate] = useState<Date>(new Date(assignment.dueDate));
    const [students, setStudents] = useState<Person[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Person[]>(assignment.selectedStudents || []); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);
    const [file, setFile] = useState<File | null>(assignment.file || null);
    const [visible, setVisible] = useState(true); // Default to true
    const [maxTime, setMaxTime] = useState(0); // Default to 0
    const [maxMem, setmaxMem] = useState(0); // Default to 0
    const [isPaused, setIsPaused] = useState(false); // Default to 0
    const [vCpu, setVCpu] = useState(0); // Default to 0
    const [maxSubmissions, setMaxSubmissions] = useState(2); // Default to 2

    const endpoint = `${config.VITE_BACKEND_URL}/`;


    // Update the state when the assignment prop changes
    useEffect(() => {
        setName(assignment.name);
        setDueDate(new Date(assignment.dueDate));
        setVisible(assignment.visible);
        setMaxTime(assignment.maxTime);
        setmaxMem(assignment.maxMem);
        setVCpu(assignment.vCpu);
        setMaxSubmissions(assignment.maxSubmissions);
        setSelectedStudents(assignment.selectedStudents || []);
        setFile(assignment.file || null);
        setIsPaused(assignment.isPaused);
    }, [assignment]);


    // call to backend to send the modified assignment
    const handleSubmit = async () => {
        if (testMode) {
            onSave({
                ...assignment,
                name,
                dueDate,
                selectedStudents,
                visible,
                isPaused, 
                maxTime,  
                maxMem, 
                vCpu, 
                maxSubmissions,
                ...(file && { file })  // Only include file if it's not null
              });
            onClose();
            onClose();
        } else {
            try {
            setLoading(true);
            const formData = new FormData();
            // Only the configurable fields are sent
            formData.append('title', name);
            formData.append('students', JSON.stringify(selectedStudents.map(student => student.id)));
            formData.append('deadline', dueDate.toISOString().split('T')[0]);
            formData.append('ispaused', String(isPaused));
            formData.append('visibility', String(visible));
            formData.append('maxtime', String(maxTime));
            formData.append('maxmem', String(maxMem));
            formData.append('vcpu', String(vCpu));
            formData.append('attempts', String(maxSubmissions));
          
            if (file) formData.append('file', file);
            
            // assuming the backend send the updated assignment back
            const response = await axios.put(`${endpoint}/${assignment.id}`, formData);
            //     "title":name,
            //     "students":JSON.stringify(selectedStudents.map(student => student.id)),
            //     "deadline":dueDate.toISOString().split('T')[0],
            //     "ispaused":String(isPaused),
            //     "maxmemory":String(maxMem),
            //     "maxtime":String(maxMem),
            //     "vcpu":String(vCpu),
            //     "attempts":String(maxSubmissions),
            //     "visibility":String(visible),
            //     "file"
            // });

            onSave(response.data);
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
    ) => {
        if (!selectedOptions) {
            setSelectedStudents([]);
            return;
        }
        const selectedStudents = selectedOptions.map(option => students.find(student => student.id === option.value)).filter((student): student is Person => student !== undefined);
        setSelectedStudents(selectedStudents);
    };

    const handleFileUpload = (uploadedFile: File) => {
        setFile(uploadedFile);
    };
  

    // the remove file allows you to remove the file and add a new 
    // but you cannot remove the file and save, a file must be present.
    const handleFileRemove = () => {
        setFile(null);
    };


    if (!isOpen) return null;


   //backend call to get students
   useEffect(() => {
        if (testMode) {
            // Dummy test data
            setStudents([
                { id: '1', name: 'Alice Smith', role: Role.STUDENT, status: Status.ACTIVE},
                { id: '2', name: 'Bob Johnson', role: Role.STUDENT, status: Status.ACTIVE},
                { id: '3', name: 'Carol Williams', role: Role.STUDENT, status: Status.ACTIVE},
                { id: '4', name: 'Dave Jones', role: Role.STUDENT, status: Status.ACTIVE},
                { id: '5', name: 'Eve Brown', role: Role.STUDENT, status: Status.ACTIVE},
            ]);
            setLoading(false);
        } else {
            const fetchStudents = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${endpoint}/users/getAllStudents`);
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
                    <div className='data-entry'>
                        <div className='data-row'>
                            <label>Assignment Name</label>
                            <input
                                type="text"
                                placeholder="Assignment Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='data-row'>
                            <label>Visibility: </label>
                            <input 
                                type="checkbox"
                                checked={visible}
                                onChange={(e) => setVisible(e.target.checked)}
                            />
                        </div>
                        <div className='data-row'>
                            <label>Max Time: </label>
                            <input
                                type="number"
                                placeholder="Max Time"
                                value={maxTime}
                                onChange={(e) => setMaxTime(Number(e.target.value))}
                                min={0}
                            />
                        </div>
                        <div className='data-row'>
                            <label>Max Memory: </label>
                            <input
                                type="number"
                                placeholder="Max Memory "
                                value={maxMem}
                                onChange={(e) => setmaxMem(Number(e.target.value))}
                                min={0}
                            />
                        </div>
                        <div className='data-row'>
                            <label>VCPU: </label>
                            <input
                                type="number"
                                placeholder="number of vCPU"
                                value={vCpu}
                                onChange={(e) => setVCpu(Number(e.target.value))}
                                min={0}
                            />
                        </div>
                        <div className='data-row'>
                            <label>Max submissions for each student: </label>
                            <input
                                type="number"
                                placeholder="maximum number of assignment submissions"
                                value={maxSubmissions}
                                onChange={(e) => setMaxSubmissions(Number(e.target.value))}
                                min={1}
                                max={3}
                            />
                        </div>
                     </div>
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
                            value={dueDate.toString()}
                            onChange={(e) => setDueDate(new Date(e.target.value))}
                        />
                    </div>
                    <div className='file-row'>
                        {file ? (
                        <div className='file-info-modal'>
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
