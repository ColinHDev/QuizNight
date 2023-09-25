import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { QuizContext } from './QuizContext.jsx';
import QuizBody from './layout/QuizBody.jsx';


export default function QuestionView() {
    const navigate = useNavigate();
    let location = useLocation();
    const globalContext = useContext(QuizContext);

    let question = location.state.question;
    let questionFromGameQuestions = globalContext.gameQuestions[globalContext.currentRound].find(q => q.question === question.question);
    if (question.answerOfFirstTeam === null && questionFromGameQuestions.answerOfFirstTeam !== null) {
        question.answerOfFirstTeam = questionFromGameQuestions.answerOfFirstTeam;
        question.answerOfSecondTeam = questionFromGameQuestions.answerOfSecondTeam;
        question.isAnswered = questionFromGameQuestions.isAnswered;
    }

    const [showAdditionalInfo, setShowAdditionalInfo] = useState(question.isAnswered);
    const [secondChance, setSecondChance] = useState(question.answerOfFirstTeam !== null);

    const handleAnswer = (answerIndex) => {
        // Fix which teams are allowed to answer in which order
        const teams = [...globalContext.teams];
        //If the first team has already answered, the second team is allowed to answer
        if (!secondChance) {
            question.answerOfFirstTeam = answerIndex;
        } else {
            question.answerOfSecondTeam = answerIndex;
            question.isAnswered = true;
        }
        // Correct answer
        if (question.correctAnswerIndex === answerIndex) {
            if (!secondChance) {
                teams[question.firstTeamToAnswer].score += question.points;
            } else {
                teams[question.secondTeamToAnswer].score += question.points / 2
            }
            setShowAdditionalInfo(true);
            question.isAnswered = true;
        }
        // Wrong answer (cannot go below 0)
        else {
            if (!secondChance) {
                teams[question.firstTeamToAnswer].score = Math.max(teams[question.firstTeamToAnswer].score - question.points / 2, 0);
                setSecondChance(true);
            } else {
                setShowAdditionalInfo(true);
            }
        }
        updateGameQuestions(question);
        location.state.question = question;
        globalContext.setTeams(teams);
    }

    const updateGameQuestions = (question) => {
        const allGameQuestions = [...globalContext.gameQuestions[globalContext.currentRound]];
        const questionIndex = allGameQuestions.findIndex(q => q.question === question.question);
        allGameQuestions[questionIndex] = question;
        const gameQuestions = [...globalContext.gameQuestions];
        gameQuestions[globalContext.currentRound] = allGameQuestions;
        globalContext.setGameQuestions(gameQuestions);
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <QuizBody></QuizBody>
            {question.firstTeamToAnswer !== null && question.secondTeamToAnswer !== null && (
                <h2 className="text-center text-2xl p-2">
                    Diese Frage gehört Team "{globalContext.teams[question.firstTeamToAnswer].name}"
                    Wenn Team "{globalContext.teams[question.firstTeamToAnswer].name}" falsch liegt, darf Team "{globalContext.teams[question.secondTeamToAnswer].name}" antworten!
                </h2>
            )}
            <h2 className="text-center text-5xl p-2">Question: {question.question}</h2>
            <p className="text-center text-2xl p-2">Kategorie: {question.category}, Erreichbare Punktzahl: {question.points}</p>

            <div className="flex flex-col items-center justify-center">
                {question.possibleAnswers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={question.isAnswered || (secondChance && question.answerOfFirstTeam === index) || (question.answerOfFirstTeam === index || question.answerOfSecondTeam === index)}
                        className={`w-64 h-16 rounded-md text-black font-bold text-lg my-4 border-black border-opacity-100 border ${question.isAnswered ?
                            (question.correctAnswerIndex === index ? 'bg-green-500' :
                                ((question.answerOfFirstTeam !== null && question.answerOfFirstTeam === index) ||
                                    (question.answerOfSecondTeam !== null && question.answerOfSecondTeam === index) ?
                                    (question.correctAnswerIndex === index ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-500'))
                            : ((question.answerOfFirstTeam !== null && question.answerOfFirstTeam === index) ||
                                (question.answerOfSecondTeam !== null && question.answerOfSecondTeam === index) ? 'bg-red-500' : 'bg-white')} ${question.isAnswered || (secondChance && question.answerOfFirstTeam === index) || (question.answerOfFirstTeam === index || question.answerOfSecondTeam === index) ? '' : 'hover:bg-gray-600'}`}
                    >
                        {answer}
                    </button>
                ))}
            </div>
            <>
                {question.answerOfFirstTeam !== null && (
                    <p className="text-center text-lg">Antwort von Team {globalContext.teams[question.firstTeamToAnswer].name}: {question.answerOfFirstTeam + 1}.</p>
                )}
                {question.answerOfSecondTeam !== null && (
                    <p className="text-center text-lg">Antwort von Team {globalContext.teams[question.secondTeamToAnswer].name}: {question.answerOfSecondTeam + 1}.</p>
                )}
                {question.isAnswered && (
                    <>
                        <p className="text-center text-lg">Korrekte Antwort {question.correctAnswerIndex + 1}.</p>
                        <p className="text-center text-lg">Kontext: {question.additionalInfo}</p>
                    </>
                )}

            </>
            <button onClick={() => {
                navigate('/quiz');
            }} className="w-64 h-16 rounded-md text-white font-bold text-lg my-4 bg-gray-800">Back to Quiz</button>
        </div>
    )
}
