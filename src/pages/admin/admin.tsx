import React, { useState, useEffect } from "react";
import Navbar from "../../components/NavBar/navBar";
import axios from "axios";
import { Person, Role, Status } from "../../utils/types";
import "./admin.css";
import Button from "../../components/Button/Button";
import { AiOutlineDelete, AiOutlinePauseCircle } from "react-icons/ai";
import AddTeacherModal from "../../components/AddTeacherModal/AddTeacherModal";
import { config } from "../../config";
import { loginResponse } from "../login/login";

type AdminProps = {
  testMode?: boolean;
};

type BackendPerson = {
  userId: string;
  name: string;
  password: string;
  role: Role;
  timestamp: string;
};

function convertBackendPerson(persons: BackendPerson[]): Person[] {
  return persons.map((person) => {
    return {
      id: person.userId,
      name: person.name,
      role: person.role,
      status: Status.ACTIVE,
    };
  });
}

const Admin: React.FC<AdminProps> = ({ testMode = false }) => {
  const [students, setStudents] = useState<Person[]>([]);
  const [teachers, setTeachers] = useState<Person[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "students" | "teachers">("all"); // filter types
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 2;

  const endpoint = `${config.VITE_BACKEND_URL}`;

  const addError = (newError: string) => {
    setErrors([newError]);
  };

  useEffect(() => {
    setLoading(true); // Start loading
    if (testMode) {
      setStudents([
        { id: "1", name: "Alice", role: Role.STUDENT, status: Status.ACTIVE },
        { id: "2", name: "Bob", role: Role.STUDENT, status: Status.ACTIVE },
        { id: "3", name: "Charlie", role: Role.STUDENT, status: Status.ACTIVE },
      ]);
      setTeachers([
        { id: "4", name: "David", role: Role.TEACHER, status: Status.PAUSED },
        { id: "5", name: "Eve", role: Role.TEACHER, status: Status.ACTIVE },
      ]);
      setLoading(false); // End loading
    } else {
      console.log("Fetching students and teachers");
      console.log("ENDPOINT for fetching teacher and user: ", endpoint);
      console.log("backend url", config.VITE_BACKEND_URL);
      const fetchStudents = async () => {
        try {
          const studentEndpoint = `${endpoint}/users/getAllStudents`;
          console.log("TOKEN : ", loginResponse.token.split("|")[0]);
          const response = await axios.get(studentEndpoint, {
            headers: {
              "Content-Type": "application/json",
              Authentication: loginResponse.token.split("|")[0],
            },
          });
          setStudents(response.data);
          if (response.data.length === 0) {
            addError("No students found");
          }
        } catch (err) {
          console.error(err);
          addError("Failed to fetch students");
        }
      };

      const fetchTeachers = async () => {
        try {
          const teacherEndpoint = `${endpoint}/users/getAllTeachers`;
          console.log("TEACHER ENDPOINT : ", teacherEndpoint);
          const response = await axios.get(teacherEndpoint, {
            headers: {
              "Content-Type": "application/json",
              Authentication: loginResponse.token.split("|")[0],
            },
          });
          console.log("response.data : ", response.data);
          console.log("response:", response);
          const updatedTeachers = convertBackendPerson(response.data);
          setTeachers(updatedTeachers);
          if (response.data.length === 0) {
            addError("No teachers found");
          }
        } catch (err) {
          console.error(err);
          addError("Failed to fetch teachers");
        }
      };

      Promise.all([fetchStudents(), fetchTeachers()]).finally(() =>
        setLoading(false)
      );
    }
  }, [testMode, endpoint]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = async (id: string, isStudent: boolean) => {
    try {
      if (isStudent) {
        const deleteEndpoint = `${endpoint}/users/remove/${id}`;
        await axios.delete(deleteEndpoint, {
          headers: {
            "Content-Type": "application/json",
            Authentication: loginResponse.token.split("|")[0],
          },
        });
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== id)
        );
        return;
      } else {
        const deleteEndpoint = `${endpoint}/users/remove/${id}`;
        await axios.delete(deleteEndpoint, {
          headers: {
            "Content-Type": "application/json",
            Authentication: loginResponse.token.split("|")[0],
          },
        });
        setTeachers((prevTeachers) =>
          prevTeachers.filter((teacher) => teacher.id !== id)
        );
      }
    } catch (err) {
      console.error(err);
      addError("Failed to delete");
    }
  };

  const handlePause = async (id: string) => {
    const pauseEndpoint = `${endpoint}/teacher/${id}/pause`; // not implemented
    try {
      await axios.post(
        pauseEndpoint,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authentication: loginResponse.token.split("|")[0],
          },
        }
      );
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === id ? { ...teacher, status: Status.PAUSED } : teacher
        )
      );
    } catch (err) {
      console.error(err);
      addError("Failed to pause");
    }
  };

  const handleAddTeacher = (newTeacher: Person) => {
    setTeachers((prevTeachers) => [...prevTeachers, newTeacher]);
  };

  // Combined list based on filter
  const combinedList = () => {
    if (filter === "students") {
      return [...students];
    } else if (filter === "teachers") {
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
      <div className="tableAdmin">
        <div className="borderAdmin">
          <div className="table-headerAdmin">
            <h1>Members</h1>
          </div>
          <div className="table-content">
            <div className="control-rowAdmin">
              <div>
                <Button
                  onClick={() => {
                    setFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  All
                </Button>
                <Button
                  onClick={() => {
                    setFilter("students");
                    setCurrentPage(1);
                  }}
                >
                  Students
                </Button>
                <Button
                  onClick={() => {
                    setFilter("teachers");
                    setCurrentPage(1);
                  }}
                >
                  Teachers
                </Button>
              </div>
              <Button onClick={openModal}>Add Teacher</Button>
            </div>
            <div>
              {errors.map((error, index) => (
                <p className="error" key={index}>
                  Error: {error}
                </p>
              ))}
            </div>
            <ul>
              {currentItems.map((person, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {person.name} - {person.role}{" "}
                  {person.status === Status.PAUSED ? "(Paused)" : ""}
                  <div className="btn-stuff">
                    {person.role === Role.TEACHER && (
                      <button
                        title="pause teacher"
                        onClick={() => handlePause(person.id)}
                      >
                        <AiOutlinePauseCircle />
                      </button>
                    )}
                    <button
                      title="delete person"
                      onClick={() =>
                        handleDelete(person.id, person.role == Role.STUDENT)
                      }
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="page-controlAdmin">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <AddTeacherModal
        isOpen={isModalOpen}
        testMode={false}
        onRequestClose={closeModal}
        onAddTeacher={handleAddTeacher}
      />
    </div>
  );
};

export default Admin;
