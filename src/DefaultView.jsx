import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { QuizContext } from './QuizContext.jsx';

export default function DefaultView() {
    const getRandomColor = () => {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    const navigate = useNavigate();
    const globalContext = useContext(QuizContext);

    const addNewTeamToArray = () => {
        globalContext.setTeams([...globalContext.teams, {name: "", color: getRandomColor(), score: 0}])
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
        navigate('/quiz');
    }

    const renderTeamsInput = () => {
        return (
            <div>
                {globalContext.teams.map((team, i) => {
                    return (
                        <div key={i}>
                            <input type="text" placeholder="Team Name" key = {"name_"+i} value={team.name} onChange={e => editTeamEntry(e, i)}/>
                            <input type="color" value={team.color} key={"color_"+i} onChange={e => editTeamColor(e, i)} />
                            <button key={"delete_key_"+i} onClick={() => {
                                let t = [...globalContext.teams]
                                t.splice(i, 1)
                                globalContext.setTeams(t)
                            }}>-</button>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div>
            <h1>Quiz</h1>
            {renderTeamsInput()}
            <div>
                <button onClick={addNewTeamToArray}>+</button>
            </div>
            <div>
                <button onClick={startQuiz}>Start Quiz</button>
            </div>
        </div>
    )
}
