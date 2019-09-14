import React from 'react'
import './offer.css'

export default ({ offer }) => {

    return (
        <div className="offer">
            <h2>{ offer.jobTitle }</h2>
            <p>{ offer.jobData }</p>
            <a href={ offer.jobUrl } target="_blank" rel="noopener noreferrer">Candidatura!</a>
        </div>
    )

}