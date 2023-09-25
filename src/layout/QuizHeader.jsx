import React, { Fragment, useContext } from 'react'
import { QuizContext } from '../QuizContext.jsx'

import '../index.css'

export default function QuizHeader() {
    return (
        <Fragment>
            <h1 className='font-bold underline flex justify-center' style={{ fontSize: '3rem', paddingTop: '2rem' }}>Vorkurs-Quiz</h1>
        </Fragment>
    )
}
