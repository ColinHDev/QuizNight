import React from 'react'
import { QuizContext } from '../QuizContext'


export default function Scoreboard() {
    const globalContext = React.useContext(QuizContext);
    const teams = globalContext.teams;
    const numTeams = teams.length;
    const splitIndex = Math.ceil(numTeams / 2);

    const leftTeams = teams.slice(0, splitIndex);
    const rightTeams = teams.slice(splitIndex);

    const renderTable = (teamList) => {
        return (
            <table className="table-auto border border-gray-400 shadow-md rounded-md">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-4xl">Team</th>
                        <th className="px-4 py-2 text-4xl">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {teamList.map((team, index) => {
                        return (
                            <tr key={index} className="border-b border-gray-400">
                                <td className="px-4 py-2 text-4xl" style={{ backgroundColor: team.color }}>{team.name}</td>
                                <td className="px-4 py-2 text-4xl">{team.score}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div className="flex justify-center items-center">
            {numTeams > 5 ? (
                <>
                    <div className="mr-4">{renderTable(leftTeams)}</div>
                    <div>{renderTable(rightTeams)}</div>
                </>
            ) : (
                renderTable(teams)
            )}
        </div>
    );
}
