import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import SubmissionHistory from './SubmissionHistory';

const SurveyForm: React.FC = () => {
  const [questions, setQuestions] = useState<{ id: number; text: string }[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://localhost:7162/api/Survey'); // Use a relative URL
        if (response.status === 200) {
          // Extract the 'id' and 'question' properties from the response data
          const questionData = response.data;
          const questionArray = questionData.map((item: { id: number; question: string }) => ({
            id: item.id,
            text: item.question,
          }));
          setQuestions(questionArray);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Create an array of objects with question ID and answer
      const answerData = questions.map((question) => ({
        surveyQuestionId: question.id,
        answer: answers[question.id - 1] || '', // Use the answer or an empty string if not provided
      }));
  
      console.log(answerData);
  
      // Serialize the answerData array to JSON
      const jsonData = JSON.stringify(answerData);
  
      // Send the JSON data in the POST request
      const response = await axios.post('https://localhost:7162/api/Survey', jsonData, {
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      });
  
      if (response.status === 200) {
        const result = response.data;
        console.log('Survey submitted successfully:', result);
        // Display a success message to the user
        alert('Survey submitted successfully!');
        // Clear the answers
        setAnswers([]);
        window.location.reload();
      } else {
        console.error('Error submitting survey:', response.data);
        // Display an error message to the user
        alert('Error submitting survey. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      // Display an error message to the user
      alert('Error submitting survey. Please try again.');
    }
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5 mb-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Survey Form</h2>
              <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                  <div className="form-group p-2" key={index}>
                    <label className="mb-2">{question.text}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary btn-block mt-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          {/* Include the SubmissionHistory component here */}
          <SubmissionHistory />
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
