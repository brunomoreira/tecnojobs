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
        
        let raw = await fetch(`http://tecnojobs.pt/default.asp?page=${req.query.page}`)
        let html = await raw.text()

        res.send(html)

    } else {
        
        let raw = await fetch('http://tecnojobs.pt')
        let html = await raw.text()
    
        res.send(html)
    
    }

})

app.get('/api/cities', (req, res) => {

    let cities = [
        "Alcobaça (Portugal)",
        "Alfena",
        "Almada",
        "Almeirim (Portugal)",
        "Alverca do Ribatejo",
        "Amadora",
        "Amarante (Portugal)",
        "Amora (Seixal)",
        "Anadia (Portugal)",
        "Angra do Heroísmo",
        "Aveiro (Portugal)",
        "Benavente",
        "Barcelos",
        "Barreiro",
        "Beja",
        "Borba (Portugal)",
        "Braga",
        "Bragança (Portugal)",
        "Caldas da Rainha",
        "Câmara de Lobos",
        "Caniço (Santa Cruz)",
        "Cantanhede (Portugal)",
        "Cartaxo",
        "Castelo Branco",
        "Chaves (Portugal)",
        "Coimbra",
        "Costa da Caparica",
        "Covilhã",
        "Elvas",
        "Entroncamento",
        "Ermesinde",
        "Esmoriz",
        "Espinho (Portugal)",
        "Esposende",
        "Estarreja",
        "Estremoz",
        "Évora",
        "Fafe",
        "Faro",
        "Fátima (Ourém)",
        "Felgueiras",
        "Figueira da Foz",
        "Fiães (Santa Maria da Feira)",
        "Freamunde",
        "Funchal",
        "Fundão (Castelo Branco)",
        "Gafanha da Nazaré",
        "Gandra (Paredes)",
        "Gondomar",
        "Gouveia (Portugal)",
        "Guarda",
        "Guimarães",
        "Horta",
        "Ílhavo",
        "Lagoa (Açores)",
        "Lagoa (Algarve)",
        "Lagos (Portugal)",
        "Lamego",
        "Leiria",
        "Lisboa",
        "Lixa (Portugal)",
        "Loulé",
        "Loures",
        "Lourosa (Santa Maria da Feira)",
        "Macedo de Cavaleiros",
        "Machico",
        "Maia",
        "Mangualde",
        "Marco de Canaveses",
        "Marinha Grande",
        "Matosinhos",
        "Mealhada",
        "Mêda",
        "Miranda do Douro",
        "mwl:Miranda de l Douro",
        "Mirandela",
        "Montemor-o-Novo",
        "Montijo",
        "Moura",
        "Odivelas",
        "Olhão",
        "Oliveira de Azeméis",
        "Oliveira do Bairro",
        "Oliveira do Hospital",
        "Ourém (Portugal)",
        "Ovar",
        "Paços de Ferreira",
        "Paredes",
        "Penafiel",
        "Peniche",
        "Peso da Régua",
        "Pinhel",
        "Pombal (Portugal)",
        "Ponta Delgada",
        "Ponte de Sor",
        "Portalegre (Portugal)",
        "Portimão",
        "Porto",
        "Póvoa de Santa Iria",
        "Póvoa de Varzim",
        "Praia da Vitória",
        "Quarteira",
        "Queluz (cidade)",
        "Rebordosa",
        "Reguengos de Monsaraz",
        "Ribeira Grande (Açores)",
        "Rio Maior",
        "Rio Tinto (Gondomar)",
        "Sabugal",
        "Sacavém",
        "Samora Correia",
        "Santa Comba Dão",
        "Santa Cruz (Madeira)",
        "Santa Maria da Feira",
        "Santana (Madeira)",
        "Santarém (Portugal)",
        "Santiago do Cacém",
        "Santo Tirso",
        "São João da Madeira",
        "São Mamede de Infesta",
        "São Pedro do Sul (Portugal)",
        "Lordelo (Paredes)",
        "Seia",
        "Seixal",
        "Senhora da Hora",
        "Serpa",
        "Setúbal",
        "Silves (Portugal)",
        "Sines",
        "Tarouca",
        "Tavira",
        "Tomar",
        "Tondela",
        "Torres Novas",
        "Torres Vedras",
        "Trancoso",
        "Trofa",
        "Valbom (Gondomar)",
        "Vale de Cambra",
        "Valença (Portugal)",
        "Valongo",
        "Valpaços",
        "Vendas Novas",
        "Viana do Castelo",
        "Vila Baleira",
        "Vila do Conde",
        "Vila Franca de Xira",
        "Vila Nova de Famalicão",
        "Vila Nova de Foz Côa",
        "Vila Nova de Gaia",
        "Vila Nova de Santo André",
        "Vila Real",
        "Vila Real de Santo António",
        "Viseu"
    ]

    res.send({ cities })

})

// Redirect to / if any other path is request
app.get('*', function (req, res) {
    res.redirect('/')
});


app.listen(process.env.PORT || 4000)