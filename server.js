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

// API endpoit
app.get('/api', (req, res) => {
    
    if(parseInt(req.query.page)) {
        
        fetch(`http://www.tecnojobs.pt/default.asp?page=${req.query.page}`)
            .then(data => data.body.pipe(res))
            .catch(error => res.send(error))
    
    } else {
        
        fetch('http://tecnojobs.pt')
                .then(data => data.body.pipe(res))
                .catch(error => res.send(error))
    
    }

})

// Redirect to / if any other path is request
app.get('*', function (req, res) {
    res.redirect('/')
});


app.listen(process.env.PORT || 4000)