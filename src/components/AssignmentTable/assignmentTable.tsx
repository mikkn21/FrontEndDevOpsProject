import React, { useState, useEffect } from "react";
import axios from "axios";
import "./assignmentTable.css";
import AssignmentCell from "../AssignmentCell/assignmentCell";
import { getCookie, getCookieRole } from "../../utils/cookieUtils";
import Button from "../Button/Button";
import InputModal from "../AssignmentAddModal/inputModal";
import { Assignment, Person } from "../../utils/types";
import ConfigureModal from "../AssignmentConfigureModal/configureModal";

interface AssignmentTableProps {
  testMode?: boolean;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({
  testMode = false,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);
  const pageSize = 2; // Number of assignments per page

  const role = getCookieRole();

  const handleDeleteAssignment = (assignmentId: number) => {
    setAssignments((prevAssignments) =>
      prevAssignments.filter((a) => a.id !== assignmentId)
    );
  };


  const handlePauseAssignment = (assignmentId: number) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, isPaused: !assignment.isPaused }
          : assignment
      )
    );
  };

  const handleOpenModal = () => {
    setShowModal(true); 
  };

  const handleOpenConfigureModal = (assignmentId: number) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setSelectedAssignment(assignment);
    }
  };

  // TODO: ADD more attributes like for the handleCreateAssignment
  const handleUpdateAssignment = (updatedAssignmentData: { name: string; dueDate: string; selectedStudents: Person[]; file?: File | undefined; }) => {
    if (selectedAssignment) {
      const updatedAssignment: Assignment = {
        ...selectedAssignment,
        ...updatedAssignmentData
      };
      setAssignments(prevAssignments =>
        prevAssignments.map(assignment =>
          assignment.id === updatedAssignment.id ? updatedAssignment : assignment
        )
      );
      setSelectedAssignment(null); // Close modal after save
    }
  };

  const handleCreateAssignment = (assignmentData: { 
    name: string; 
    dueDate: string; 
    selectedStudents: Person[]; 
    file?: File;
    visible: boolean;
    maxTime: number; 
    maxMem: number; 
    vCpu: number; 
  }) => {
    const newAssignment: Assignment = {
      id: Math.max(0, ...assignments.map(a => a.id)) + 1, // Generating a new ID, handle empty list case
      ...assignmentData,
      isPaused: false,
    };
    setAssignments(prevAssignments => [...prevAssignments, newAssignment]);
  };


  useEffect(() => {
    if (testMode) {
      // In test mode, use dummy data instead of fetching from the API
      const testAssignments: Assignment[] = [
        { id: 1, name: "Test Assignment 1", dueDate: "2024-06-01", visible: true, maxTime: 0, maxMem: 0, vCpu: 0},
        { id: 2, name: "Test Assignment 2", dueDate: "2024-06-02", visible: false, maxTime: 0, maxMem: 0, vCpu: 0},
        { id: 3, name: "Test Assignment 3", dueDate: "2024-06-03", visible: true, maxTime: 0, maxMem: 0, vCpu: 0},
        { id: 4, name: "Test Assignment 4", dueDate: "2024-06-04", visible: true, maxTime: 0, maxMem: 0, vCpu: 0},
        { id: 5, name: "Test Assignment 5", dueDate: "2023-05-05", visible: true, maxTime: 0, maxMem: 0, vCpu: 0},
        { id: 6, name: "Test Assignment 6", dueDate: "2023-05-05", visible: true, maxTime: 0, maxMem: 0, vCpu: 0},
      ];
      const filteredAssignments = role === 'student' ? testAssignments.filter(assignment => assignment.visible) : testAssignments;
      setAssignments(filteredAssignments);
      setLoading(false);
    } else {
      const userId = getCookie();
      if (!userId) {
        setError({ message: "No user ID found in cookie" });
        setLoading(false);
        return;
      }
      const AssignmentEndpoint = `/api/EVALUATION_SERVICE_ENDPOINT/user/${userId}`;

      // get all assignments in a table
      axios
        .get(AssignmentEndpoint)
        .then((response) => {
          const assignmentsFromAPI = response.data;
          // Filter out assignments with visibility=false if role is "student"
          const filteredAssignments = role === 'student' ? assignmentsFromAPI.filter((assignment: { visible: any; }) => assignment.visible) : assignmentsFromAPI;
          setAssignments(filteredAssignments);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching assignments", error);
          setError({ message: error.message || "Error fetching assignments" });
          setLoading(false);
        });
    }
  }, [testMode]); // Depend on testMode to re-run the effect when it changes

  useEffect(() => {
    // After fetching, apply filter initially to show current assignments
    const now = new Date();
    const currentAssignments = assignments.filter(
      (a) => new Date(a.dueDate) >= now
    );
    setFilteredAssignments(currentAssignments);
    // Reset to first page after filtering
    setCurrentPage(0);
  }, [assignments]);

  // Add methods to filter assignments
  const showCurrent = () => {
    const now = new Date();
    setFilteredAssignments(
      assignments.filter((a) => new Date(a.dueDate) >= now)
    );
    setCurrentPage(0);
  };

  const showPast = () => {
    const now = new Date();
    const pastAssignments = assignments.filter(
      (a) => new Date(a.dueDate) < now
    );
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
  const pagedAssignments = filteredAssignments.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }



  return (
    <div>
      <div className="table">
        <div className="table-header assignment-table-header">
          <h1>Assignments</h1>
          <div className="button-container">
            <div>
              <Button onClick={showCurrent}>Current</Button>
              <Button onClick={showPast}>Past</Button>
            </div>
            <div className="right-button">
              {role === "teacher" && (
                <Button onClick={handleOpenModal}>Add Assignment</Button> 
              )}
            </div>
          </div>
        </div>
        <div>
          {pagedAssignments.map((assignment) => (
            <AssignmentCell
              key={assignment.id}
              assignment={assignment}
              isPast={new Date(assignment.dueDate) < new Date()}
              onDelete={role === "teacher" ? handleDeleteAssignment : undefined}
              onPause={
                role === "teacher"
                  ? () => handlePauseAssignment(assignment.id)
                  : undefined
              }
              onConfigure={role === "teacher" ? () => handleOpenConfigureModal(assignment.id) : undefined}
            />
          ))}
        </div>
      </div>
      <div className="pagination">
        <button onClick={previousPage} disabled={currentPage <= 0}>
          Previous
        </button>
        <span> { `${currentPage + 1} of ${Math.ceil(filteredAssignments.length / pageSize)}` }</span>
        <button
          onClick={nextPage}
          disabled={(currentPage + 1) * pageSize >= filteredAssignments.length}
         >
          Next
        </button>
      </div>
      {showModal && (
      <InputModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreateAssignment}
        testMode={true}
      /> 
      )}
      {selectedAssignment && (
        <ConfigureModal
          assignment={selectedAssignment}
          isOpen={!!selectedAssignment}
          testMode={true}
          onClose={() => setSelectedAssignment(null)}
          onSave={(updatedAssignmentData) => handleUpdateAssignment({...selectedAssignment, ...updatedAssignmentData, file: updatedAssignmentData.file || undefined})}
        />
      )}
    </div>
  );
};

export default AssignmentTable;
