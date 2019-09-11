const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')

const app = express()

app.use(cors())
app.get('/', async (req, res) => {
    
    if(parseInt(req.query.page)) {
        try {
            let rawResponse = await fetch(`http://www.tecnojobs.pt/default.asp?page=${req.query.page}`)
            rawResponse.body.pipe(res)
        } catch(error) {
            res.send(error)
        }
    } else {
        try {
            let rawResponse = await fetch('http://tecnojobs.pt')
            rawResponse.body.pipe(res)
        } catch(error) {
            res.send(error)
        }
    }

})

app.listen(process.env.PORT || 4000)