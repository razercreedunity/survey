import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubmissionHistory: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('https://localhost:7162/api/Survey/submission-history');
        if (response.status === 200) {
          const sortedSubmissions = response.data.sort((a: any, b: any) => {
            // Sort by submitTime in descending order
            return new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime();
          });
          setSubmissions(sortedSubmissions);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (isLoading) {
    return <div>Loading submissions...</div>;
  }

  let counter = 1; // Initialize the counter

  return (
    <div>
      <h3>Submission History</h3>
      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Submit Time</th>
              <th>Answers</th>
              {/* Add additional table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index}>
                <td>{counter++}</td> {/* Display the incrementing number */}
                <td>{new Date(submission.submitTime).toLocaleString()}</td>
                <td>{submission.answers}</td>
                {/* Add additional table cells for other properties */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionHistory;
