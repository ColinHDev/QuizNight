import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { QuizContext } from './QuizContext.jsx';


export default function QuestionView() {
    const navigate = useNavigate();
    const location = useLocation();
    const globalContext = useContext(QuizContext);
    const question = location.state.question;

    const [showAdditionalInfo, setShowAdditionalInfo] = useState(location.state.question.isAnswered);
    const [secondChance, setSecondChance] = useState(location.state.question.answerOfFirstTeam !== null);

    const handleAnswer = (answerIndex) => {
        // Fix which teams are allowed to answer in which order

        //If the first team has already answered, the second team is allowed to answer
        if (!secondChance) {
            question.answerOfFirstTeam = answerIndex;
        } else {
            question.answerOfSecondTeam = answerIndex;
            question.isAnswered = true;
        }

        if (question.correctAnswerIndex === answerIndex) {
            // Correct answer
            globalContext.teams[globalContext.currentTurn].points += secondChance ? question.points / 2 : question.points;
            setShowAdditionalInfo(true);
            question.isAnswered = true;
        } else {
            // Wrong answer (cannot go below 0)
            if (!secondChance) {
                globalContext.teams[globalContext.currentTurn].points = Math.max(globalContext.teams[globalContext.currentTurn].points - question.points / 2, 0);
                setSecondChance(true);
            } else {
                setShowAdditionalInfo(true);
            }
        }
        updateGameQuestions(question);
    }

    const updateGameQuestions = (question) => {
        const allGameQuestions = [...globalContext.gameQuestions];
        const questionIndex = allGameQuestions.findIndex(q => q.question === question.question);
        allGameQuestions[questionIndex] = question;
        globalContext.setGameQuestions(allGameQuestions);
    }

    return (
        <div>
            <h1>Question</h1>
            {question.firstTeamToAnswer !== null && question.secondTeamToAnswer !== null && (
                <h2>
                    Diese Frage gehört Team "{globalContext.teams[question.firstTeamToAnswer].name}"
                    Wenn Team "{globalContext.teams[question.firstTeamToAnswer].name}" falsch liegt, darf Team "{globalContext.teams[question.secondTeamToAnswer].name}" antworten!
                </h2>
            )}
            <p>Category: {question.category}</p>
            <p>Points: {question.points}</p>
            <p>Question: {question.question}</p>
            {question.possibleAnswers.map((answer, index) => (
                <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showAdditionalInfo || (secondChance && question.answerOfFirstTeam === index) || (question.answerOfFirstTeam === index || question.answerOfSecondTeam === index)}
                    style={{
                        backgroundColor: showAdditionalInfo ?
                            (question.correctAnswerIndex === index ? 'lightgreen' :
                                ((question.answerOfFirstTeam !== null && question.answerOfFirstTeam === index) ||
                                    (question.answerOfSecondTeam !== null && question.answerOfSecondTeam === index) ?
                                    (question.correctAnswerIndex === index ? 'lightgreen' : 'lightcoral') : ''))
                            : ((question.answerOfFirstTeam !== null && question.answerOfFirstTeam === index) ||
                                (question.answerOfSecondTeam !== null && question.answerOfSecondTeam === index) ? 'lightcoral' : '')
                    }}

                >
                    {answer}
                </button>
            ))}

            {showAdditionalInfo && (
                <>
                    {question.answerOfFirstTeam !== null && (
                        <p>Team {globalContext.teams[question.firstTeamToAnswer].name} has answered with option {question.answerOfFirstTeam + 1}.</p>
                    )}
                    {question.answerOfSecondTeam !== null && (
                        <p>Team {globalContext.teams[question.firstTeamToAnswer].name} has answered with option {question.answerOfSecondTeam + 1}.</p>
                    )}
                    {question.isAnswered && (
                        <p>The Correct option for this question is {question.correctAnswerIndex + 1}.</p>
                    )}
                    <p>Additional Info: {question.additionalInfo}</p>
                </>
            )}
            <button onClick={() => {
                navigate('/quiz');
            }}>Back to Quiz</button>
        </div>
    )
}
