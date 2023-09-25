import React from 'react'
import { QuizContext } from '../QuizContext'


export default function Scoreboard() {
    const globalContext = React.useContext(QuizContext)

    return (
        <div className="flex justify-center items-center">
            <table className="table-auto border border-gray-400 shadow-md rounded-md">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Team</th>
                        <th className="px-4 py-2">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {globalContext.teams.map((team, index) => {
                        return (
                            <tr key={index} className="border-b border-gray-400">
                                <td className="px-4 py-2">{team.name}</td>
                                <td className="px-4 py-2">{team.score}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
