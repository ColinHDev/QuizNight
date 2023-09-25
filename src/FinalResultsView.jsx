import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QuizContext } from './QuizContext'
import { useSpring, animated, useSprings } from 'react-spring'
import { isQuizFinished } from './utils'

export default function FinalResultsView() {
    /**
     * Component to be rendered if the entire quiz is finished
     * This should show some nice animations and the final results
     * There should be an option to click "dismiss" and go back to the question grid
     */
    const globalContext = React.useContext(QuizContext)
    const teams = globalContext.teams
    const sortedTeams = teams.sort((a, b) => b.score - a.score)
    const emojis = ['🎉', '🎊', '🎈', '🎁', '🥳', '🕺', '💃']


    const data = sortedTeams.map((team, index) => {
        return {
            key: index,
            place: index + 1,
            name: team.name,
            score: team.score,
            color: team.color,
        }
    })

    const [springs, setSprings] = useSprings(200, (index) => ({
        from: { x: `${Math.random() * window.innerWidth}px`, y: `${Math.random() * window.innerHeight}px` },
        to: async (next) => {
            while (true) {
                await next({
                    x: `${Math.random() * window.innerWidth*0.98}px`,
                    y: `${Math.random() * window.innerHeight*0.85}px`,
                    config: { duration: 3000, easing: t => t * (2 - t) },
                })
            }
        },
    }))
    


    return (
        <div className="relative h-screen overflow-hidden">
            {globalContext.gameQuestions && !isQuizFinished(globalContext.gameQuestions) && springs.map((props, index) => (
                <animated.div
                    key={index}
                    style={{
                        ...props,
                        position: 'absolute',
                        fontSize: '3rem',
                    }}
                >
                    {emojis[index % emojis.length]}
                </animated.div>
            ))}
                <animated.div
                    style={{
                        ...useSpring({
                            from: { opacity: 0, transform: 'translate3d(0, -50px, 0)' },
                            to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                        }),
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                    className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2 text-center  max-h-max max-w-max mx-auto"
                >
                    <h1 className="text-3xl font-bold mb-4">Ergebnisse</h1>
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 font-bold text-4xl">Place</th>
                                <th className="px-4 py-2 font-bold text-4xl">Team Name</th>
                                <th className="px-4 py-2 font-bold text-4xl">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((team) => (
                                <tr key={team.key} style={{ backgroundColor: team.color }}>
                                    <td className="border px-4 py-2 font-bold text-4xl">{team.place}</td>
                                    <td className="border px-4 py-2 font-bold text-4xl">{team.name}</td>
                                    <td className="border px-4 py-2 font-bold text-4xl">{team.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link
                        to="/quiz"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Zurück zum Quiz
                    </Link>
                </animated.div>
            </div>
    )
}
