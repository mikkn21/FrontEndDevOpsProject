// In logsUtills.ts
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Submission } from './types';

export const downloadLogsZip = async (submissions: Submission[], filename: string = "submission_logs.zip") => {
    const zip = new JSZip();

    submissions.forEach(submission => {
        if (submission.log && submission.studentId) {
            // Each log file is named by the student's ID
            zip.file(`${submission.studentId}_logs.txt`, submission.log);
        }
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, filename);
};

