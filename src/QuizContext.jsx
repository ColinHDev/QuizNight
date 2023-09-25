import React, { createContext, useState, useEffect } from 'react';

import questionsFromDisk from './ressources/questions.json'
import { shuffleQuestions } from './utils';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {

    // Extend every entry in questionsFromDisk with four additonal Properties which are null at start:
    const extendedQuestionsFromDisk = questionsFromDisk.map(question => ({
        ...question,
        isAnswered: false,
        firstTeamToAnswer: null,
        answerOfFirstTeam: null,
        secondTeamToAnswer: null,
        answerOfSecondTeam: null
    }));

    const amountOfQuestions = 5;
    const amountOfRounds = 2;
    // State for teams: Load from LocalStorage or use default value 
    const [teams, setTeams] = useState(JSON.parse(localStorage.getItem('teams')) || [{ name: "", color: '#000000', score: 0 }]);
    // State for max allowed teams
    const [maxAllowedTeams, setMaxAllowedTeams] = useState(-1);
    //State for CurrentTurn: Load from LocalStorage or use default value (0)
    const [currentTurn, setCurrentTurn] = useState(JSON.parse(localStorage.getItem('currentTurn')) || 0);
    // State for questions: Load from LocalStorage or load from JSON file (questions.json)
    const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || shuffleQuestions(extendedQuestionsFromDisk));
    //State for questions which are used in the current game. This is nested array with the following structure: [[question1, question2, question3, question4, question5], [question1, question2, question3, question4, question5]]
    const [gameQuestions, setGameQuestions] = useState(JSON.parse(localStorage.getItem('gameQuestions')) || []);
    //State for current round
    const [currentRound, setCurrentRound] = useState(JSON.parse(localStorage.getItem('currentRound')) || 0);
    //State for the current question
    const [currentQuestion, setCurrentQuestion] = useState(JSON.parse(localStorage.getItem('currentQuestion')) || null);



    useEffect(() => {
        localStorage.setItem('teams', JSON.stringify(teams));
        console.dir(teams)
    }, [teams]);

    useEffect(() => {
        localStorage.setItem('currentTurn', JSON.stringify(currentTurn));
    }, [currentTurn]);

    useEffect(() => {
        localStorage.setItem('questions', JSON.stringify(questions));
        //Additionally, update the number of max allowed teams
        if (questions.length === 0) setMaxAllowedTeams(-1)
        else setMaxAllowedTeams(Math.floor(questions.length / (amountOfQuestions * amountOfRounds)));

    }, [questions]);

    useEffect(() => {
        localStorage.setItem('gameQuestions', JSON.stringify(gameQuestions));
    }, [gameQuestions]);

    useEffect(() => {
        localStorage.setItem('currentRound', JSON.stringify(currentRound));
    }, [currentRound]);

    useEffect(() => {
        localStorage.setItem('currentQuestion', JSON.stringify(currentQuestion));
    }, [currentQuestion]);


    // Update game questions and used questions
    const generateGameQuestions = () => {
        let _gameQuestions = [];

        // Make a copy of _questions so that we can safely modify it
        let availableQuestions = [...questions];
        for (let h = 0; h < amountOfRounds; h++) {
            let _ronudQuestions = [];
            for (let i = 0; i < teams.length; i++) {
                for (let j = 0; j < amountOfQuestions; j++) {
                    let randomIndex = Math.floor(Math.random() * availableQuestions.length);
                    let _question = availableQuestions.splice(randomIndex, 1)[0];
                    _ronudQuestions.push(_question);
                }
            }
            _gameQuestions.push(_ronudQuestions)
        }
        setGameQuestions(_gameQuestions);
    };

    // Define the reset function
    const resetQuiz = () => {
        // Clear all localStorage variables
        localStorage.clear();

        // Reset all states
        setTeams([{ name: "", color: '#000000', score: 0 }]);
        setCurrentTurn(0);
        setQuestions(shuffleQuestions(extendedQuestionsFromDisk));  // Set questions back to initial value
        setGameQuestions([]);
    };

    return (
        <QuizContext.Provider value={{ teams, setTeams, currentTurn, setCurrentTurn, questions, setQuestions, gameQuestions, setGameQuestions, resetQuiz, currentRound, setCurrentRound, generateGameQuestions, maxAllowedTeams, currentQuestion, setCurrentQuestion }}>
            {children}
        </QuizContext.Provider>
    );
};
