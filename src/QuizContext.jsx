import React, { createContext, useState, useEffect } from 'react';

import questionsFromDisk from './ressources/questions.json'


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
    // State for teams: Load from LocalStorage or use default value 
    const [teams, setTeams] = useState(JSON.parse(localStorage.getItem('teams')) || [{ name: "", color: '#000000', score: 0 }]);
    //State for CurrentTurn: Load from LocalStorage or use default value (0)
    const [currentTurn, setCurrentTurn] = useState(JSON.parse(localStorage.getItem('currentTurn')) || 0);
    // State for questions: Load from LocalStorage or load from JSON file (questions.json)
    const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || extendedQuestionsFromDisk);
    //State for questions which are used in the current game
    const [gameQuestions, setGameQuestions] = useState(JSON.parse(localStorage.getItem('gameQuestions')) || []);
    //State for questions which were already used in a previous game or are used in the current game
    const [usedQuestions, setUsedQuestions] = useState(JSON.parse(localStorage.getItem('usedQuestions')) || []);
    //State for current round
    const [currentRound, setCurrentRound] = useState(1);

    useEffect(() => {
        localStorage.setItem('teams', JSON.stringify(teams));
    }, [teams]);

    useEffect(() => {
        localStorage.setItem('currentTurn', JSON.stringify(currentTurn));
    }, [currentTurn]);

    useEffect(() => {
        localStorage.setItem('questions', JSON.stringify(questions));
    }, [questions]);

    useEffect(() => {
        localStorage.setItem('gameQuestions', JSON.stringify(gameQuestions));
        console.warn("Updated Game Questions")
    }, [gameQuestions]);

    useEffect(() => {
        localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));
    }, [usedQuestions]);

    useEffect(() => {
        localStorage.setItem('currentRound', JSON.stringify(currentRound));
    }, [currentRound]);

    // Update game questions and used questions
    const updateGameAndUsedQuestions = () => {
        let _gameQuestions = [];
        let _questions = questions.filter(question => !usedQuestions.includes(question));

        // Make a copy of _questions so that we can safely modify it
        let availableQuestions = [..._questions];

        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < amountOfQuestions; j++) {
                if (availableQuestions.length === 0) {
                    // If we run out of available questions, shuffle them again
                    availableQuestions = [..._questions];
                }

                let randomIndex = Math.floor(Math.random() * availableQuestions.length);
                let _question = availableQuestions.splice(randomIndex, 1)[0];
                _gameQuestions.push(_question);
            }
        }

        setGameQuestions(_gameQuestions);
    };

    useEffect(() => {
        // If Questions is loaded: Take a subset of 5 questions per team
        if (questions.length > 0 && gameQuestions.length !== teams.length * amountOfQuestions) {
            updateGameAndUsedQuestions();
        }

    }, [questions, teams]);

    useEffect(() => {
        // Update game questions and used questions when current round changes
        if (currentRound > 1) {
            updateGameAndUsedQuestions();
            setUsedQuestions(usedQuestions.concat(gameQuestions));
        }
    }, [currentRound]);

    // Define the reset function
    const resetQuiz = () => {
        // Clear all localStorage variables
        localStorage.clear();

        // Reset all states
        setTeams([{ name: "", color: '#000000', score: 0 }]);
        setCurrentTurn(0);
        setQuestions(extendedQuestionsFromDisk);  // Set questions back to initial value
        setGameQuestions([]);
        setUsedQuestions([]);
    };

    return (
        <QuizContext.Provider value={{ teams, setTeams, currentTurn, setCurrentTurn, questions, setQuestions, gameQuestions, setGameQuestions, usedQuestions, setUsedQuestions, resetQuiz }}>
            {children}
        </QuizContext.Provider>
    );
};
