import React from 'react'
import { QuizContext } from '../QuizContext'

export default function FinalResults() {
    /**
     * Component to be rendered if the entire quiz is finished
     * This should show some nice animations and the final results
     * There should be an option to click "dismiss" and go back to the question grid
     */
    const globalContext = React.useContext(QuizContext)
    const teams = globalContext.teams
    const sortedTeams = teams.sort((a, b) => b.score - a.score)
    return (
        <div>
            <h1>Final Results</h1>
            <div>
                {sortedTeams.map((team, index) => {
                    return (
                        <div key={index}>
                            <div style={{ backgroundColor: team.color, height: '20px', width: '20px', display: 'inline-block' }}></div>
                            <span>{team.name}</span>
                            <span>{team.score}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )

  
}
