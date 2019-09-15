const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
const favicon = require('express-favicon')
const path = require('path')
const helmet = require('helmet')

const app = express()

// Middleware
app.use(cors())
app.use(helmet())

app.use(favicon(__dirname + '/build/favicon.ico'))

// Static Assets
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')))

// Serve React index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

// API endpoint
app.get('/api', async (req, res) => {
    
    if(parseInt(req.query.page)) {

        if(req.query.CHAVES) {

            let raw = await fetch(`http://tecnojobs.pt/default.asp?page=${req.query.page}&CHAVES=${req.query.CHAVES}`)
            let html = await raw.text()
    
            res.send(html)

        } else {
            
            let raw = await fetch(`http://tecnojobs.pt/default.asp?page=${req.query.page}`)
            let html = await raw.text()
    
            res.send(html)

        }
        

    } else {
        
        if(req.query.CHAVES) {

            let raw = await fetch(`http://www.tecnojobs.pt/default.asp?chaves=${req.query.CHAVES}`)
            let html = await raw.text()
        
            res.send(html)

        } else {
            
            let raw = await fetch('http://tecnojobs.pt')
            let html = await raw.text()
        
            res.send(html)

        }

    
    }

})

app.get('/api/search', async(req, res) => {

    // ie. http://www.tecnojobs.pt/default.asp?chaves=porto+frontend
    if(req.query.chaves) {
    
        let raw = await fetch(`http://www.tecnojobs.pt/default.asp?chaves=${req.query.chaves}`)
        let html = await raw.text()
    
        res.send(html)
    
    } else {

        let raw = await fetch(`http://www.tecnojobs.pt`)
        let html = await raw.text()
    
        res.send(html)
    }


})

// Redirect to / if any other path is request
app.get('*', function (req, res) {
    res.redirect('/')
});


app.listen(process.env.PORT || 4000)