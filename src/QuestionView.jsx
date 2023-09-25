import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { QuizContext } from './QuizContext.jsx';
import QuizBody from './layout/QuizBody.jsx';
import { useSpring, animated } from 'react-spring';


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
                teams[question.secondTeamToAnswer].score = Math.max(teams[question.secondTeamToAnswer].score - question.points / 4, 0);
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

    const renderSecondChanceText = () => {
        if (secondChance) {
            return (
                <>
                    <span>Team "<b>{globalContext.teams[question.secondTeamToAnswer].name}</b>" hat eine zweite Chance</span>

                    <button
                        disabled={question.isAnswered}
                        onClick={() => {
                            question.secondTeamToAnswer = (question.secondTeamToAnswer + 1) % globalContext.teams.length;
                            updateGameQuestions(question);
                        }}
                        className="px-4 py-2 ml-4 text-white disabled:bg-blue-200 bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                    >
                        Nächstes Team
                    </button>
                    <button disabled={question.firstTeamToAnswer === null || question.firstTeamToAnswer === undefined || question.isAnswered} onClick={() => {
                        question.isAnswered = true;
                        updateGameQuestions(question);
                    }} className="px-4 py-2 ml-4 text-white disabled:bg-blue-200 bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                        Auflösen
                    </button>
                </>
            );
        }
    };

    const springProps = useSpring({
        from: { opacity: 0, transform: 'translateY(-50px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    });

    return (
        <animated.div style={springProps} className="flex flex-col items-center justify-center">
            <QuizBody></QuizBody>
            {question.firstTeamToAnswer !== null && question.secondTeamToAnswer !== null && (
                <h2 className="text-center text-2xl p-2">
                    Team "<b>{globalContext.teams[question.firstTeamToAnswer].name}</b>" gehört die Frage. {renderSecondChanceText()}
                </h2>
            )}
            <h2 className="text-center font-bold text-5xl p-2">{question.question}</h2>
            <p className="text-center text-2xl p-2">Kategorie: {question.category}, Erreichbare Punktzahl: {question.points}</p>

            <div className="flex flex-col items-center justify-center">
                {question.possibleAnswers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={question.isAnswered || (secondChance && question.answerOfFirstTeam === index) || (question.answerOfFirstTeam === index || question.answerOfSecondTeam === index)}
                        className={`w-full h-16 rounded-md text-black font-bold text-3xl my-4 border-black border-opacity-100 border ${question.isAnswered ?
                            (question.correctAnswerIndex === index ? 'bg-green-500' :
                                ((question.answerOfFirstTeam !== null && question.answerOfFirstTeam === index) ||
                                    (question.answerOfSecondTeam !== null && question.answerOfSecondTeam === index) ?
                                    (question.correctAnswerIndex === index ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-500'))
                            : ((question.answerOfFirstTeam !== null && question.answerOfFirstTeam === index) ||
                                (question.answerOfSecondTeam !== null && question.answerOfSecondTeam === index) ? 'bg-red-500' : 'bg-white')} ${question.isAnswered || (secondChance && question.answerOfFirstTeam === index) || (question.answerOfFirstTeam === index || question.answerOfSecondTeam === index) ? '' : 'hover:bg-gray-600'}`}
                    >
                        <span className='pl-2'>{index + 1}: </span>{answer} <span className='pl-2'></span>
                    </button>
                ))}
            </div>
            <>
                {question.answerOfFirstTeam !== null && (
                    <p className="text-center text-2xl">Antwort von Team {globalContext.teams[question.firstTeamToAnswer].name}: {question.answerOfFirstTeam + 1}</p>
                )}
                {question.answerOfSecondTeam !== null && (
                    <p className="text-center text-2xl">Antwort von Team {globalContext.teams[question.secondTeamToAnswer].name}: {question.answerOfSecondTeam + 1}</p>
                )}
                {question.isAnswered && (
                    <>
                        <p className="text-center text-2xl">Korrekte Antwort {question.correctAnswerIndex + 1}</p>
                        {question.additionalInfo && (
                            <p className="text-center text-2xl">Kontext: {question.additionalInfo}</p>
                        )}
                    </>
                )}

            </>
            <button onClick={() => {
                navigate('/quiz');
            }} className="w-64 h-16 rounded-md text-white font-bold text-3xl my-4 bg-gray-800">Übersicht</button>
        </animated.div>
    )
}
