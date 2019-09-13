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

app.get('/api/cities', (req, res) => {

    let cities = [
        "Alcobaça","Alfena","Almada","Almeirim","Alverca do Ribatejo","Amadora","Amarante","Amora","Anadia","Angra do Heroísmo","Aveiro","Benavente","Barcelos","Barreiro","Beja","Borba","Braga","Bragança","Caldas da Rainha","Câmara de Lobos","Caniço","Cantanhede","Cartaxo","Castelo Branco","Chaves","Coimbra","Costa da Caparica","Covilhã","Elvas","Entroncamento","Ermesinde","Esmoriz","Espinho","Esposende","Estarreja","Estremoz","Évora","Fafe","Faro","Fátima","Felgueiras","Figueira da Foz","Fiães","Freamunde","Funchal","Fundão","Gafanha da Nazaré","Gandra","Gondomar","Gouveia","Guarda","Guimarães","Horta","Ílhavo","Lagoa","Lagos","Lamego","Leiria","Lisboa","Lixa","Loulé","Loures","Lourosa","Macedo de Cavaleiros","Machico","Maia","Mangualde","Marco de Canaveses","Marinha Grande","Matosinhos","Mealhada","Mêda","Miranda do Douro","Mirandela","Montemor-o-Novo","Montijo","Moura","Odivelas","Olhão","Oliveira de Azeméis","Oliveira do Bairro","Oliveira do Hospital","Ourém","Ovar","Paços de Ferreira","Paredes","Penafiel","Peniche","Peso da Régua","Pinhel","Pombal","Ponta Delgada","Ponte de Sor","Portalegre","Portimão","Porto","Póvoa de Santa Iria","Póvoa de Varzim","Praia da Vitória","Quarteira","Queluz","Rebordosa","Reguengos de Monsaraz","Ribeira Grande","Rio Maior","Rio Tinto","Sabugal","Sacavém","Samora Correia","Santa Comba Dão","Santa Cruz","Santa Maria da Feira","Santana","Santarém","Santiago do Cacém","Santo Tirso","São João da Madeira","São Mamede de Infesta","São Pedro do Sul","Lordelo","Seia","Seixal","Senhora da Hora","Serpa","Setúbal","Silves","Sines","Tarouca","Tavira","Tomar","Tondela","Torres Novas","Torres Vedras","Trancoso","Trofa","Valbom","Vale de Cambra","Valença","Valongo","Valpaços","Vendas Novas","Viana do Castelo","Vila Baleira","Vila do Conde","Vila Franca de Xira","Vila Nova de Famalicão","Vila Nova de Foz Côa","Vila Nova de Gaia","Vila Nova de Santo André","Vila Real","Vila Real de Santo António","Viseu"
    ]

    res.send({ cities })

})

// Redirect to / if any other path is request
app.get('*', function (req, res) {
    res.redirect('/')
});


app.listen(process.env.PORT || 4000)