import React, { Fragment } from 'react'
import { QuizContext } from '../QuizContext'
import Scoreboard from '../components/Scoreboard'

export default function QuizBody() {
    /**
     *  This component is a general container for the quiz. It should contain the following components:
     * - Current Turn (Team)
     * - Current Round
     * - Scoreboard
     */
    const globalContext = React.useContext(QuizContext);

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">
                Aktuell wird Runde {globalContext.currentRound + 1} gespielt!
            </h2>
            <Scoreboard />
        </div>
    );
}
