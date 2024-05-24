import React, { useState, useEffect } from "react";
import axios from "axios";
import "./assignmentTable.css";
import AssignmentCell from "../AssignmentCell/assignmentCell";
import { getCookie, getCookieRole, getCookieId } from "../../utils/cookieUtils";
import Button from "../Button/Button";
import AssignmentAddModal from "../AssignmentAddModal/assignmentAddModal";
import { Assignment } from "../../utils/types";
import ConfigureModal from "../AssignmentConfigureModal/configureModal";
import { config } from "../../config";
import { loginResponse } from "../../pages/login/login";

interface AssignmentTableProps {
  testMode?: boolean;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({
  testMode = false,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);
  const pageSize = 2; // Number of assignments per page

  const role = getCookieRole();
  const baseEndpoint = `${config.VITE_BACKEND_URL}`; // Adjust URL to your actual API endpoint

  const handleDeleteAssignment = async (assignmentId: number) => {
    try {
      const response = await axios.delete(
        `${baseEndpoint}/assignment/removeAssignmentId/${assignmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: loginResponse.token.split("|")[0],
          },
        }
      );

      if (response.status === 200) {
        // Update state to remove the assignment
        setAssignments((prevAssignments) =>
          prevAssignments.filter((a) => a.id !== assignmentId)
        );
      } else {
        setError({ message: "Failed to delete assignment" });
        console.error("Failed to delete assignment:", response.status);
      }
    } catch (error) {
      setError({ message: "Failed to delete assignment" });
      console.error("Error deleting assignment:", error);
    }
  };

  const handlePauseAssignment = async (assignmentId: number) => {
    try {
      const response = await axios.put(
        `${baseEndpoint}/assignment/pause/${assignmentId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: loginResponse.token.split("|")[0],
          },
        }
      );

      if (response.status === 200) {
        // assuming i get a new assignment object back with pause = true
        const updatedAssignment = response.data;

        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === assignmentId ? updatedAssignment : assignment
          )
        );
      } else {
        setError({ message: "Failed to pause assignment" });
        console.error("Failed to pause assignment:", response.status);
      }
    } catch (error) {
      setError({ message: "Failed to pause assignment" });
      console.error("Error pause assignment:", error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleOpenConfigureModal = (assignmentId: number) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      setSelectedAssignment(assignment);
    }
  };

  const handleCreateAssignment = (newAssignment: Assignment) => {
    setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );
    setSelectedAssignment(null);
  };

  // When the component mounts, fetch the assignments
  useEffect(() => {
    if (testMode) {
      // In test mode, use dummy data instead of fetching from the API
      const testAssignments: Assignment[] = [
        {
          id: 1,
          name: "Test Assignment 1",
          dueDate: new Date("2024-06-01"),
          visible: true,
          maxTime: 0,
          maxMem: 0,
          vCpu: 0,
          maxSubmissions: 2,
          StudentSubmissions: [],
          teacher: "",
        },
        {
          id: 2,
          name: "Test Assignment 2",
          dueDate: new Date("2024-06-02"),
          visible: false,
          maxTime: 0,
          maxMem: 0,
          vCpu: 0,
          maxSubmissions: 2,
          StudentSubmissions: [],
          teacher: "",
        },
        {
          id: 3,
          name: "Test Assignment 3",
          dueDate: new Date("2024-06-03"),
          visible: true,
          maxTime: 0,
          maxMem: 0,
          vCpu: 0,
          maxSubmissions: 2,
          StudentSubmissions: [],
          teacher: "",
        },
        {
          id: 4,
          name: "Test Assignment 4",
          dueDate: new Date("2024-06-04"),
          visible: true,
          maxTime: 0,
          maxMem: 0,
          vCpu: 0,
          maxSubmissions: 2,
          StudentSubmissions: [],
          teacher: "",
        },
        {
          id: 5,
          name: "Test Assignment 5",
          dueDate: new Date("2023-05-05"),
          visible: true,
          maxTime: 0,
          maxMem: 0,
          vCpu: 0,
          maxSubmissions: 2,
          StudentSubmissions: [],
          teacher: "",
        },
        {
          id: 6,
          name: "Test Assignment 6",
          dueDate: new Date("2023-05-05"),
          visible: true,
          maxTime: 0,
          maxMem: 0,
          vCpu: 0,
          maxSubmissions: 2,
          StudentSubmissions: [],
          teacher: "",
        },
      ];
      const filteredAssignments =
        role === "student"
          ? testAssignments.filter((assignment) => assignment.visible)
          : testAssignments;
      setAssignments(filteredAssignments);
      setLoading(false);
    } else {
      const userId = getCookie();
      if (!userId) {
        setError({ message: "No user ID found in cookie" });
        setLoading(false);
        return;
      }

      // get all assignments in a table
      axios
        .get(
          role === "student"
            ? `${baseEndpoint}/assignment/getUserAssignments//${userId}`
            : `${baseEndpoint}/assignment/getTeacherAssignment/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authentication: loginResponse.token.split("|")[0],
            },
          }
        )
        .then((response) => {
          const assignmentsFromAPI = response.data;
          // Filter out assignments with visibility=false if role is "student"
          const filteredAssignments =
            role === "student"
              ? assignmentsFromAPI.filter(
                  (assignment: { visible: any }) => assignment.visible
                )
              : assignmentsFromAPI;
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

  // Filter assignments based on due date
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
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            pagedAssignments.map((assignment) => (
              <AssignmentCell
                key={assignment.id}
                assignment={assignment}
                isPast={new Date(assignment.dueDate) < new Date()}
                onDelete={
                  role === "teacher" ? handleDeleteAssignment : undefined
                }
                onPause={
                  role === "teacher"
                    ? () => handlePauseAssignment(assignment.id)
                    : undefined
                }
                onConfigure={
                  role === "teacher"
                    ? () => handleOpenConfigureModal(assignment.id)
                    : undefined
                }
                studentId={
                  role == "student" ? getCookieId() ?? undefined : undefined
                }
              />
            ))
          )}
        </div>
      </div>
      <div className="pagination">
        <button onClick={previousPage} disabled={currentPage <= 0}>
          Previous
        </button>
        <span>
          {" "}
          {`${currentPage + 1} of ${Math.ceil(
            filteredAssignments.length / pageSize
          )}`}
        </span>
        <button
          onClick={nextPage}
          disabled={(currentPage + 1) * pageSize >= filteredAssignments.length}
        >
          Next
        </button>
      </div>
      {showModal && (
        <AssignmentAddModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleCreateAssignment}
          testMode={false}
          teacherId={getCookieId() || undefined} // if no teacherId, pass undefined to use the default value
        />
      )}
      {selectedAssignment && (
        <ConfigureModal
          assignment={selectedAssignment}
          isOpen={!!selectedAssignment}
          testMode={true}
          onClose={() => setSelectedAssignment(null)}
          onSave={(updatedAssignmentData) =>
            handleUpdateAssignment({
              ...selectedAssignment,
              ...updatedAssignmentData,
              file: updatedAssignmentData.file || undefined,
            })
          }
        />
      )}
    </div>
  );
};

export default AssignmentTable;
