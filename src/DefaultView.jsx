import React, { useState } from 'react'

export default function DefaultView() {
    // This is the default view when opening the application.
    // It contains a Title "Quiz" and allows to add teams one by one
    // A team should be added with a name in a new line 
    // At the bottom there should be a "+", when clicked a new row appears such that a new team can be added.

    const [team, setTeams] = useState([])

    const addTeam = () => {
        setTeams([...team, { name: "", score: 0 }])
    }

    return (
        <div>
            <h1>Quiz</h1>

            <div>
                <input type="text" placeholder="Team Name" />
            </div>
            <div>
                <button onClick={addTeam}>+</button>
            </div>
        </div>
    )





}
