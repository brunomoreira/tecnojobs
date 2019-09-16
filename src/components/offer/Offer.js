import React from 'react'
import './offer.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

export default ({ offer }) => {

    return (
        <div className="offer">
            <i className="far fa-star"></i>
            <h2>{ offer.jobTitle }</h2>
            <p>{ offer.jobData }</p>
            <a href={ offer.jobUrl } target="_blank" rel="noopener noreferrer">Candidatura!</a>
        </div>
    )

}