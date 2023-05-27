import { useEffect, useRef, useState } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [showName, setName] = useState("");
  const [timer, setTimer] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const targetRef = useRef(null);

  const scrollToTarget = () => {
    targetRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let intervalId;
    if (!timerExpired && !showScore) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [timerExpired, showScore]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('quizData.json');
      const data = await response.json();
      setQuestions(data);
      setUserAnswers(Array(data.length).fill(''));
    } catch (error) {
      console.log('Error fetching questions:', error);
    }
  };

  const handleAnswerOptionClick = (index, selectedAnswer) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[index] = selectedAnswer;
    setUserAnswers(updatedUserAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (question.correctAnswer === userAnswers[index]) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    setName(name)
    setShowScore(true);
    clearInterval();
    console.log('Score:', calculateScore()); // Display or process the score as needed
  };

  const handleTimerExpired = () => {
    setTimerExpired(true);
    setShowScore(true);
    console.log('Time is up!');
    console.log('Score:', calculateScore()); // Display or process the score as needed

  };

  const handleRestart = () => {
    setShowScore(false)
    setTimer(0)
    setTimerExpired(false)
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={targetRef} style={{ border: '2px white solid', padding: '50px 100px', width: '800px', margin: ' 30px 31%' }} >
      {showScore && (
        <div >
          <h2>Quiz Completed!</h2>
          {timerExpired && (
            <div>
              <p style={{color:'red', fontWeight:'700'}}>Time is up!</p>
            </div>
          )}
          {calculateScore() < 2 &&
            <div>
              <h4>Candidate name: {showName} </h4><h4>Your score: <span style={{ color: 'red' }}> {calculateScore()} </span> out of {questions.length}</h4></div>
           || calculateScore() < 7 &&
           <div>
             <h4>Candidate name: {showName} </h4>
             <h4>Your score: {calculateScore()} out of {questions.length}</h4></div> 
             || calculateScore() === 7 &&
            <div>
              <h3 style={{ color: 'cyan' }}>Congratulations!</h3>
              <h4>Candidate name: {showName} </h4>
              <h4>Your score: {calculateScore()} out of {questions.length}</h4></div>
          }
          <button onClick={handleRestart}> Restart the Quiz</button>
          <br></br><br></br>
          <hr />
        </div>
      )}
      <h2>Quiz</h2>
      <p>Quiz Time: <span style={{color:'orange'}}><b>2 Minutes</b></span></p>
      {!timerExpired && (
        <div>
          <p>Timer: <span style={{color:'cyan'}}>{timer}</span> seconds</p>
          {timer >= 120 &&
            handleTimerExpired()}
        </div>
      )}

      <form onSubmit={handleSubmit}>
     <div>
      <label>Name: </label>
      <input type='text' name='name' style={{padding:'5px', width:'200px'}} placeholder='Enter your name' required></input>
     <ol> { questions.map((question, index) => (
          <div key={index}>
            <li><b>{question.question}</b></li>
            <ol type="a">
              {question.options.map((option, optionIndex) => {
                const isCorrectAnswer = question.correctAnswer === option;
                const isSelected = userAnswers[index] === option;
                const isWrongAnswer = showScore && isSelected && !isCorrectAnswer;
                const optionStyle = {
                  color: isWrongAnswer ? 'red' : '',
                };
                const labelStyle = isCorrectAnswer && showScore ? {
                  color: 'green'
                } : {};
                return (
                  <li key={optionIndex}>
                    <label style={labelStyle}>
                      <input
                        type="radio"
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerOptionClick(index, option)}
                        disabled={showScore || timerExpired} 
                      />
                      <span style={optionStyle}>{option}</span>
                    </label>
                  </li>
                );
              })}
            </ol>
            <br></br>
            {showScore && (
              <div>
                {<p>
                  Correct answer: <b>{question.correctAnswer}</b>
                </p>}
              </div>
            )}
          </div>
        ))}</ol>
        <button type="submit" disabled={showScore || timerExpired}>
          Submit
        </button>
        <br></br><br></br>
        {
          showScore && <a onClick={scrollToTarget}>Click to see the Result</a>
        }

     </div>
      </form>

    </div>
  );
};

export default Quiz;
