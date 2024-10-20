import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, Image, Row, Col, Container } from 'react-bootstrap';

// Function to extract questions along with user data
function extractQuestionsWithUserData(data) {
  const allQuestions = [];

  // Loop through each user in the data array
  data.forEach((userData) => {
    const { user, topics } = userData;

    // Loop through each topic for the user
    topics.forEach((topic) => {
      const { questions } = topic;

      // Loop through each question and add user data
      questions.forEach((question) => {
        allQuestions.push({
          ...question,
          profileImage: user.profileImage,
          socialLink: user.socialLink,
          username: user.username
        });
      });
    });
  });

  return allQuestions;
}

const QuizCard = () => {
  // Get the data from the Redux state
  const data = useSelector((state) => state.data.data);

  // Extract all questions with user data
  const allQuestions = extractQuestionsWithUserData(data);

  // State hooks
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Total time per question in seconds
  const [finished, setFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Selected option

  // useEffect to manage the countdown timer
  useEffect(() => {
    if (hasStarted && timeLeft > 0 && !finished) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer); // Cleanup the timer
    } else if (timeLeft === 0) {
      setFinished(true); // End the quiz when the time runs out
    }
  }, [timeLeft, hasStarted, finished]);

  // useEffect to reset selected option when the question changes
  useEffect(() => {
    setSelectedOption(null); // Clear the selected option when moving to the next question
  }, [currentQuestion]);

  // Handle selecting an answer
  const handleAnswer = (option) => {
    if (!selectedOption) {
      setSelectedOption(option); // Save the selected option

      if (option === allQuestions[currentQuestion].answer) {
        setScore(score + 1); // Increment score if the answer is correct
      }

      // Move to the next question after a short delay
      setTimeout(() => {
        if (currentQuestion + 1 < allQuestions.length) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setFinished(true); // Finish the quiz when all questions are answered
        }
      }, 500); // Delay before moving to the next question
    }
  };

  // Reset the quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setFinished(false);
    setHasStarted(false);
    setSelectedOption(null); // Clear the selected option
  };

  // Display loading message if there are no data or questions available
  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="d-flex justify-content-center">
      {!hasStarted ? (
        <Card className="mb-4 shadow-sm text-center" style={{ maxWidth: '800px' }}>
          <Card.Body>
            <h2>Welcome to the Quiz!</h2>
            <Button variant="primary" onClick={() => setHasStarted(true)}>Start</Button>
          </Card.Body>
        </Card>
      ) : !finished ? (
        <Card
          key={currentQuestion} // Unique key to force re-render when the question changes
          className="mb-4 shadow-sm"
          style={{ maxWidth: '800px' }}
        >
          <Card.Body>
            <Row className="align-items-center">
              {/* Column for profile image and social link */}
              <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                <Image
                  src={allQuestions[currentQuestion].profileImage}
                  roundedCircle
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  className="mb-2"
                />
                <div className="font-weight-bold">{allQuestions[currentQuestion].socialLink}</div>
              </Col>

              {/* Column for the question and answer options */}
              <Col xs={12} md={8}>
                <Card.Title className="mb-3 text-center text-md-start">
                  {allQuestions[currentQuestion].question}
                </Card.Title>
                <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
                  {allQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedOption === option ? 'primary' : 'outline-primary'}
                      className="m-1"
                      onClick={() => handleAnswer(option)}
                      disabled={!!selectedOption} // Disable buttons after selecting an option
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>
            <div className="mt-3 text-center">
              <h5>Time left: {timeLeft}s</h5>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-4 shadow-sm text-center" style={{ maxWidth: '800px' }}>
          <Card.Body>
            <h2>Quiz Finished!</h2>
            <h4>Your score: {score} / {allQuestions.length}</h4>
            <Button variant="primary" onClick={handleRestart}>Restart</Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default QuizCard;


