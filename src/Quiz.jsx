import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { QuizContext } from './QuizContext.jsx'

import './QuizStyles.css'

/**
* Question:
* - Category
* - Points
* - Question
* - Possible Answers
* - Correct Answer Index
* - Additional Info
* 
* - First Team to answer
* - Answer of First Team
* - Second Team to answer
* - Answer of Second Team
*/



export default function Quiz() {
    const navigate = useNavigate();
    const globalContext = useContext(QuizContext);

    const resetQuiz = () => {
        if (window.confirm('Are you sure you want to reset the quiz? This action cannot be undone.')) {
            globalContext.resetQuiz()
            // Navigate to the front page
            navigate('/');
        }
    };

    useEffect(() => {
        console.log(globalContext.gameQuestions)
    }, [])

    const onQuestionSelection = (question) => {
        //Modify the state: Set firstTeamToAnswer to the current turn, set secondTeamToAnswer to the next turn (modulo amount of teams)
        if (question.firstTeamToAnswer === null) {
            question.firstTeamToAnswer = globalContext.currentTurn;
            question.secondTeamToAnswer = (globalContext.currentTurn + 1) % globalContext.teams.length;
            
            //Update Turn only if the question was not already answered or Clicked on
            globalContext.setCurrentTurn((globalContext.currentTurn + 1) % globalContext.teams.length);
        }

        navigate(`/question`, { state: { question } })
    }



    const renderQuizGrid = () => {
        if (globalContext.gameQuestions !== null && globalContext.gameQuestions.length !== 0) {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: `repeat(${globalContext.teams.length}, 1fr)` }}>
                    {globalContext.gameQuestions.map((question, index) => (
                        <div key={index} onClick={() => onQuestionSelection(question)}
                            className={`QuestionPreview ${question.isAnswered ? 'isAnswered' : (question.answerOfFirstTeam !== null ? 'isStarted' : '')}`}>
                            <p>{question.category}</p>
                            <p>{question.points}</p>
                        </div>
                    ))}
                </div>
            )
        }
        return (
            <div>
                <p>Loading</p>
            </div>
        )
    }


    return (
        <div>
            <h2>Aktuell ist Team {globalContext.teams[globalContext.currentTurn].name} dran!</h2>
            <button onClick={resetQuiz}>Reset Quiz</button>
            {renderQuizGrid()}
        </div>
    )
}


