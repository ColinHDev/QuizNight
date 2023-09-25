import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { QuizContext } from './QuizContext.jsx'

import './ressources/css/QuizStyles.css'
import Scoreboard from './components/Scoreboard.jsx';
import ChangeGrid from './components/ChangeGrid.jsx';
import QuizBody from './layout/QuizBody.jsx';

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
        const [hoveredIndex, setHoveredIndex] = useState(null);

        if (
            globalContext.gameQuestions &&
            globalContext.gameQuestions[globalContext.currentRound] &&
            globalContext.gameQuestions[globalContext.currentRound].length !== 0
        ) {
            return (
                <div className="grid grid-cols-5 gap-4 p-4 rounded-lg w-full">
                    {globalContext.gameQuestions[globalContext.currentRound].map(
                        (question, index) => (
                            <div
                                key={index}
                                onClick={() => onQuestionSelection(question)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`QuestionPreview ${
                                    question.isAnswered
                                        ? "bg-gray-400"
                                        : question.answerOfFirstTeam !== null
                                        ? "bg-gray-200"
                                        : ""
                                } border border-gray-400 rounded-lg p-4 ${
                                    hoveredIndex === index ? "bg-gray-600 transition-colors duration-300" : ""
                                }`}
                            >
                                <p>{question.category}</p>
                                <p>{question.points}</p>
                            </div>
                        )
                    )}
                </div>
            );
        }
        return (
            <div>
                <p>Loading</p>
            </div>
        );
    };


    return (
        <div className="">
            <QuizBody></QuizBody>
            <div className="flex justify-center items-center">
                <div className='w-full text-center'>
                    <h1 className="text-3xl">Die nächste Frage geht an Team: {globalContext.teams[globalContext.currentTurn].name}</h1>
                    {renderQuizGrid()}
                    <div className="flex justify-between">
                        <div className="flex">
                            <button onClick={resetQuiz} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Reset Quiz
                            </button>
                            <ChangeGrid></ChangeGrid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


