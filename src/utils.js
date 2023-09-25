import React from "react";
import { QuizContext } from "./QuizContext";

export const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export const isRoundFinished = (round) => {
    // Return true if all questions in the round have been answered
    return round.every(question => question.isAnswered);
}

export const isQuizFinished = (quiz) => {
    // Return true if for all rounds in the quiz, all questions have been answered
    return quiz.rounds.every(round => isRoundFinished(round));
}



export const shuffleQuestions = (questions) => {
    /**
     * Questions is an array of objects with the following structure:
     * {
     *  ...
     *  possibleAnswers: []
     *  correctAnswerIndex: 0
     * }
     * 
     * The correct answer is always at index 0. This function shuffles the possible answers and updates the correctAnswerIndex accordingly.
     */

    return questions.map(question => {
        //1. Shuffle the possible answers
        const shuffledAnswers = structuredClone(question).possibleAnswers.sort(() => Math.random() - 0.5);
        //2. Find the index of the correct answer in the shuffled array
        const correctAnswerIndex = shuffledAnswers.indexOf(question.possibleAnswers[question.correctAnswerIndex]);
        //3. Return the updated question object
        console.log(correctAnswerIndex)
        console.log(shuffledAnswers)
        return {
            ...question,
            possibleAnswers: shuffledAnswers,
            correctAnswerIndex: correctAnswerIndex
        }});
}
