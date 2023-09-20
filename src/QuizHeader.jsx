import React, { Fragment, useContext } from 'react'
import { QuizContext } from './QuizContext.jsx'


export default function QuizHeader() {
    const globalContext = useContext(QuizContext);

    return (
        <Fragment>
            <h1>Vorkurs-Quiz</h1>
        </Fragment>
    )
}
