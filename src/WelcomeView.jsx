import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { QuizContext } from './QuizContext.jsx';

// Import helper functions from utils
import { getRandomColor } from './utils.js';
import './ressources/css/QuizStyles.css'

export default function DefaultView() {

    const navigate = useNavigate();
    const globalContext = useContext(QuizContext);

    const addNewTeamToArray = () => {
        globalContext.setTeams([...globalContext.teams, { name: "", color: getRandomColor(), score: 0 }])
    }

    const editTeamEntry = (event, index) => {
        let t = [...globalContext.teams]
        t[index].name = event.target.value
        globalContext.setTeams(t)
    }

    const editTeamColor = (event, index) => {
        let t = [...globalContext.teams]
        t[index].color = event.target.value
        globalContext.setTeams(t)
    }

    const startQuiz = () => {
        // Generate the questions
        globalContext.generateGameQuestions()
        // Navigate to the quiz
        navigate('/quiz');
    }

    const isValidTeamEntries = () => {
        //1. Check if there are at least 2 teams
        if (globalContext.teams.length < 2) {
            return false
        }
        //2. Check if all teams have a name (Return false if there is at least one team without a name)
        if (globalContext.teams.filter(team => team.name === "").length !== 0) {
            return false
        }
        //3. Check if two teams share the same name
        if (globalContext.teams.length !== new Set(globalContext.teams.map(team => team.name)).size) {
            return false
        }
        //4. Check if the number of teams is smaller or equal to the max allowed teams
        if (globalContext.teams.length > globalContext.maxAllowedTeams) {
            return false
        }
        return true

    }

        const renderTeamsInput = () => {
            return (
                <div className="flex flex-col space-y-2">
                    {globalContext.teams.map((team, i) => {
                        return (
                            <div key={i} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Team Name"
                                    key={"name_" + i}
                                    value={team.name}
                                    onChange={(e) => editTeamEntry(e, i)}
                                    className="border border-gray-300 rounded-md px-2 py-1 w-48 text-2xl"
                                />
                                <input
                                    type="color"
                                    value={team.color}
                                    key={"color_" + i}
                                    onChange={(e) => editTeamColor(e, i)}
                                    className="w-8 h-8 rounded-full border-none"
                                    style={{ borderRadius: "50%" }}
                                />
                                <button
                                    key={"delete_key_" + i}
                                    onClick={() => {
                                        let t = [...globalContext.teams];
                                        t.splice(i, 1);
                                        globalContext.setTeams(t);
                                    }}
                                    className="bg-black text-white rounded-md px-2 py-1 text-2xl"
                                >
                                    -
                                </button>
                            </div>
                        );
                    })}
                </div>
            );
        };

        const renderMaxAllowedTeams = () => {
            if (globalContext.maxAllowedTeams && globalContext.maxAllowedTeams !== -1) {
                return (
                    <div>
                        <p className="text-black text-2xl"><i>Es können maximal {globalContext.maxAllowedTeams} Teams erstellt werden!</i></p>
                    </div>
                )
            }
        }

        return (
            <div className=" pt-4 flex justify-center items-center">
                <div className="grid grid-cols-1 gap-4 content-start justify-center items-center">
                    <div className="flex flex-col space-y-4 text-center justify-center items-center">
                        {renderTeamsInput()}
                        <div className="flex justify-center">
                            <button onClick={addNewTeamToArray} className="text-white bg-black rounded-md px-4 py-2 text-2xl">Add Team</button>
                        </div>
                        {renderMaxAllowedTeams()}
                        <div className="flex justify-center">
                            <button disabled={!isValidTeamEntries()} onClick={startQuiz} className="bg-green-500 text-white rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-2xl">Start Quiz</button>
                        </div>
                    </div>
                </div>
            </div>
        )

    }


