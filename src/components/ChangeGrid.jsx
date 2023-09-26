import React from 'react'
import { QuizContext } from '../QuizContext'
import { isRoundFinished } from '../utils'

export default function ChangeGrid() {
    // Renders to buttons a "left arrow" and a "right arrow" to change which set of questions is displayed.
    // If the left arrow is clicked, globalContext.currentRound is decremented by 1 (if it is not already 0)
    // If the right arrow is clicked, globalContext.currentRound is incremented by 1 (if it is not already the last round, which is indicated by globalContext.amountOfRounds) )
    // if globalContext.currentRound is 0, the left arrow is disabled
    // if globalContext.currentRound is globalContext.amountOfRounds, the right arrow is disabled
    // If not all questions of a round are answered, the corresponding button is disabled
    const globalContext = React.useContext(QuizContext)
    const leftArrowDisabled = globalContext.currentRound === 0
    const rightArrowDisabled = globalContext.currentRound === globalContext.amountOfRounds - 1 && !isRoundFinished(globalContext.gameQuestions[globalContext.currentRound])
    return (
        <div>
            <button className="ml-2 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-200 text-white font-bold py-2 px-4 rounded" disabled={leftArrowDisabled} onClick={() => globalContext.setCurrentRound(globalContext.currentRound - 1)}>{"<"}</button>
            <button className="mr-2 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-200 text-white font-bold py-2 px-4 rounded" disabled={rightArrowDisabled} onClick={() => globalContext.setCurrentRound(globalContext.currentRound + 1)}>{">"}</button>
        </div>
    )
}
