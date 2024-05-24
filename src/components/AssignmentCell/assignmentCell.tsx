import React, { useEffect, useRef, useState } from "react";
import "./assignmentCell.css";
import FileUploadButton from "../Button/FileUploadButton";
import SubmitButton from "../Button/SubmitButton";
import fileIcon from "../../assets/icons8-file.svg";
import {
  AiOutlinePlayCircle,
  AiOutlinePauseCircle,
  AiOutlineDelete,
  AiOutlineSetting,
} from "react-icons/ai";
import { Assignment, Submission } from "../../utils/types";
import { getCookieRole, getCookieUsername } from "../../utils/cookieUtils";
import ViewSubmissionsButton from "../Button/ViewSubmissionsButton";
import axios from "axios";
import { loginResponse } from "../../pages/login/login";

interface AssignmentCellProps {
  assignment: Assignment;
  isPast?: boolean;
  onPause?: () => void;
  onDelete?: (id: number) => void;
  onConfigure?: (id: number) => void;
  studentId?: string;
}

const AssignmentCell: React.FC<AssignmentCellProps> = ({
  assignment,
  isPast,
  onPause,
  onDelete,
  onConfigure,
  studentId = "default-student-id",
}) => {
  const role = getCookieRole();
  const studentName = getCookieUsername() ?? "default-student-name";

  const effectiveAssignmentName = assignment.name || "Default assignment name";

  // if your a teacher or a student with a invalid id (default) initialSubmissions are empty
  // otherwise get your initialSubmissions
  const initialSubmissions =
    role === "student" && studentId !== "default-student-id"
      ? assignment.StudentSubmissions.filter(
          (sub) => sub.studentId === studentId
        )
      : [];

  const [files, setFiles] = useState<Submission[]>(initialSubmissions);

  const [canUploadMore, setCanUploadMore] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canceledSubmissions, setCanceledSubmissions] = useState<Submission[]>(
    []
  );

  const filesRef = useRef<Submission[]>(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const baseEndpoint = "${config.VITE_BACKEND_URL}/solution"; // Adjust URL to your actual API endpoint
  let testMode = false;

  const handleSubmissionSubmit = async () => {
    if (files.length === 0) {
      console.error("No file to submit.");
      return;
    }

    const fileToSubmit = files[files.length - 1]; // Get the last file

    if (fileToSubmit.evaluationStatus !== null) {
      console.error("File is already submitted or in progress.");
      return;
    }

    setLoading(true);

    // Set initial loading status for the file to be submitted
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f === fileToSubmit ? { ...f, evaluationStatus: "LOADING" } : f
      )
    );

    if (testMode) {
      setTimeout(() => {
        const currentFiles = filesRef.current;
        if (
          !currentFiles.some((f) => f.file === fileToSubmit.file) ||
          canceledSubmissions.some((c) => c.file === fileToSubmit.file)
        ) {
          console.log("test");
          return; // If the submission was canceled, do not update the state
        }
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file === fileToSubmit.file
              ? { ...f, evaluationStatus: "SUCCESS" as const }
              : f
          )
        );
        setCanUploadMore(true);
        setLoading(false);
        setSubmitted(true);
      }, 2500);
    } else {
      if (fileToSubmit.file) {
        const formData = new FormData();
        formData.append("studentId", studentId);
        formData.append("studentName", studentName);
        formData.append("file", fileToSubmit.file);
        try {
          setLoading(true);
          const response = await axios.post(
            `${baseEndpoint}/addSolution`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authentication: loginResponse.token.split("|")[0],
              },
            }
          );

          // assuming the response is a new submission object
          // with id and status fields set by the backend
          const newSubmission: Submission = response.data;

          const currentFiles = filesRef.current;
          if (
            !currentFiles.some((f) => f.file === fileToSubmit.file) ||
            canceledSubmissions.some((c) => c.file === fileToSubmit.file)
          ) {
            return; // Submission has been cancelled, do not update state
          }

          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file === fileToSubmit.file
                ? {
                    ...f,
                    // set the fields that the backend has updated
                    evaluationStatus: newSubmission.evaluationStatus,
                    id: newSubmission.id,
                    log: newSubmission.log,
                    result: newSubmission.result,
                  }
                : f
            )
          );
          setCanUploadMore(true);
          setSubmitted(true);
        } catch (error) {
          console.error("Error uploading file:", error);
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file === fileToSubmit.file
                ? { ...f, evaluationStatus: "ERROR" }
                : f
            )
          );
        } finally {
          setLoading(false);
        }
      } else {
        console.error("File is undefined");
      }
    }
  };

  const handleSubmissionUpload = (fileToSubmit: File) => {
    if (files.length >= assignment.maxSubmissions) {
      return;
    }

    const newSubmission: Submission = {
      // undefined and null is set by the backend once the submission has been submitted
      id: -1, // Set to -1 to indicate that it is a new submission without an actual id
      studentId: studentId,
      studentName: studentName,
      file: fileToSubmit,
      evaluationStatus: null,
      log: undefined,
      result: undefined,
    };
    setFiles((prevFiles) => [...prevFiles, newSubmission]);
    setCanUploadMore(false);
    setSubmitted(false);
  };

  const handleFileRemove = async (index: number) => {
    const submissionToRemove: Submission = files[index];

    if (!submissionToRemove) {
      console.error("Submission not found");
      return;
    }

    if (submissionToRemove.evaluationStatus === "LOADING") {
      await handleCancelSubmission(submissionToRemove);
      return;
    }
    setCanceledSubmissions((prevCanceled) => [
      ...prevCanceled,
      submissionToRemove,
    ]);
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setCanUploadMore(true);
    setSubmitted(false);
    setLoading(false);
  };

  const handleCancelSubmission = async (submission: Submission) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseEndpoint}/${assignment.id}/submissions/${submission.id}/cancel`,
        {},
        {
          headers: {
            Authentication: loginResponse.token.split("|")[0],
          },
        }
      );
      const updatedAssignment: Assignment = response.data;

      setFiles(
        updatedAssignment.StudentSubmissions.filter(
          (sub) => sub.studentId === studentId
        )
      );
      setCanceledSubmissions((prevCanceled) => [...prevCanceled, submission]);
      setCanUploadMore(true);
      setSubmitted(false);
    } catch (error) {
      console.error("Error cancelling submission:", error);
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f === submission ? { ...f, evaluationStatus: "ERROR" } : f
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "ERROR":
      case "STOPPED":
        return { color: "red" };
      case "LOADING":
        return { color: "orange" };
      case "SUCCESS":
        return { color: "green" };
      case "PAUSED":
        return { color: "gray" };
      default:
        return { color: "black" };
    }
  };

  const isTeacherAndHidden = role === "teacher" && !assignment.visible;

  return (
    <div className={`cell ${isTeacherAndHidden ? "dimmed" : ""}`}>
      <div className="teacherStuff">
        {onDelete && (
          <button
            className="delete-button"
            onClick={() => onDelete(assignment.id)}
          >
            <AiOutlineDelete />
          </button>
        )}
        {onPause && (
          <button className="pause-button" onClick={onPause}>
            {assignment.isPaused ? (
              <AiOutlinePlayCircle />
            ) : (
              <AiOutlinePauseCircle />
            )}
          </button>
        )}
        {onConfigure && (
          <button
            className="configure-button"
            onClick={() => onConfigure(assignment.id)}
          >
            <AiOutlineSetting />
          </button>
        )}
      </div>
      <h2>{effectiveAssignmentName}</h2>
      <div className="left-align">
        <p>
          Due date:{" "}
          {assignment.dueDate
            ? assignment.dueDate.toISOString().split("T")[0]
            : "No due date"}
        </p>
      </div>
      {role === "student" && (
        <div className="file-info">
          {files.map((submission, index) => (
            <div key={index} className="file-entry">
              <span className="status-file">
                Status:{" "}
                <span style={getStatusColor(submission.evaluationStatus)}>
                  {submission.evaluationStatus || "ready to submit"}
                </span>
              </span>
              <div className="file-details">
                <img src={fileIcon} alt="file type" className="file-icon" />
                {submission.file && <p>{submission.file.name}</p>}
              </div>
              {!submitted &&
                (submission.evaluationStatus === "LOADING" ||
                  submission.evaluationStatus === null) && (
                  <div
                    className="remove-file"
                    onClick={() => handleFileRemove(index)}
                  >
                    &times;
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
      <div className="buttons-container">
        {role === "student" ? (
          <>
            <FileUploadButton
              onFileUploadStatus={handleSubmissionUpload}
              disabled={
                isPast ||
                assignment.isPaused ||
                assignment.maxSubmissions === files.length ||
                !canUploadMore
              }
            />
            <SubmitButton
              onClick={handleSubmissionSubmit}
              disabled={submitted || isPast || assignment.isPaused}
              loading={loading}
            />
          </>
        ) : (
          <ViewSubmissionsButton
            AssignmentId={assignment.id}
            testMode={false}
          />
        )}
      </div>
    </div>
  );
};

export default AssignmentCell;
