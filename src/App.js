import React, { Component, Fragment } from 'react'
import preparePage from './utils/preparePage'
import getPage from './utils/getPage'
import Offer from './components/offer/Offer'
import './App.css'

class App extends Component {

  state = {
    data: [],
    pageNum: 1,
    loading: true,
    error: false,
    filtered: [],
    cities: [
      "Alcobaça","Alfena","Almada","Almeirim","Alverca do Ribatejo","Amadora","Amarante","Amora","Anadia","Angra do Heroísmo","Aveiro","Benavente","Barcelos","Barreiro","Beja","Borba","Braga","Bragança","Caldas da Rainha","Câmara de Lobos","Caniço","Cantanhede","Cartaxo","Castelo Branco","Chaves","Coimbra","Costa da Caparica","Covilhã","Elvas","Entroncamento","Ermesinde","Esmoriz","Espinho","Esposende","Estarreja","Estremoz","Évora","Fafe","Faro","Fátima","Felgueiras","Figueira da Foz","Fiães","Freamunde","Funchal","Fundão","Gafanha da Nazaré","Gandra","Gondomar","Gouveia","Guarda","Guimarães","Horta","Ílhavo","Lagoa","Lagos","Lamego","Leiria","Lisboa","Lixa","Loulé","Loures","Lourosa","Macedo de Cavaleiros","Machico","Maia","Mangualde","Marco de Canaveses","Marinha Grande","Matosinhos","Mealhada","Mêda","Miranda do Douro","Mirandela","Montemor-o-Novo","Montijo","Moura","Odivelas","Olhão","Oliveira de Azeméis","Oliveira do Bairro","Oliveira do Hospital","Ourém","Ovar","Paços de Ferreira","Paredes","Penafiel","Peniche","Peso da Régua","Pinhel","Pombal","Ponta Delgada","Ponte de Sor","Portalegre","Portimão","Porto","Póvoa de Santa Iria","Póvoa de Varzim","Praia da Vitória","Quarteira","Queluz","Rebordosa","Reguengos de Monsaraz","Ribeira Grande","Rio Maior","Rio Tinto","Sabugal","Sacavém","Samora Correia","Santa Comba Dão","Santa Cruz","Santa Maria da Feira","Santana","Santarém","Santiago do Cacém","Santo Tirso","São João da Madeira","São Mamede de Infesta","São Pedro do Sul","Lordelo","Seia","Seixal","Senhora da Hora","Serpa","Setúbal","Silves","Sines","Tarouca","Tavira","Tomar","Tondela","Torres Novas","Torres Vedras","Trancoso","Trofa","Valbom","Vale de Cambra","Valença","Valongo","Valpaços","Vendas Novas","Viana do Castelo","Vila Baleira","Vila do Conde","Vila Franca de Xira","Vila Nova de Famalicão","Vila Nova de Foz Côa","Vila Nova de Gaia","Vila Nova de Santo André","Vila Real","Vila Real de Santo António","Viseu"
    ],
    city: null,
    search: null
  }

  config = {
    dev: 'http://localhost:4000/api/',
    prod: '/api/'
  }

  componentDidMount() {

    (async () => {

      let { error, html } = await getPage(this.config, this.state.pageNum, null)
      
      if(!error && html) {
        
        let { error, loading, data } = preparePage(html)
        
        this.setState((prevState, prevProps) => ({
          ...prevState,
          error,
          loading,
          data
        }))
      
      } else {
        this.setState({ error })
      }
      
    })()

  }

  handlePageChange = async (mode) => {

    if(mode === 'next') {
      this.setState((prevState, prevProps) => ({
        ...prevState,
        loading: true,
        pageNum: prevState.pageNum + 1
      }))
      
      if(this.state.search) {
        
        let { html } = await getPage(this.config, this.state.pageNum + 1, this.state.search)
        let { error, data, loading } = preparePage(html)
    
        this.setState((prevState, prevProps) => ({
          ...prevState,
          error,
          data,
          loading
        }))
      
      } else {

        let { html } = await getPage(this.config, this.state.pageNum + 1, this.state.city)
        let { error, data, loading } = preparePage(html)
    
        this.setState((prevState, prevProps) => ({
          ...prevState,
          error,
          data,
          loading
        }))

      }
      
    } else {

      if(this.state.pageNum > 1) {
      
        this.setState((prevState, prevProps) => ({
          ...prevState,
          loading: true,
          pageNum: prevState.pageNum - 1
        }))
  
        let { html } = await getPage(this.config, this.state.pageNum - 1, this.state.city)
        
        let { error, data, loading } = preparePage(html)
  
        this.setState((prevState, prevProps) => ({
          ...prevState,
          error,
          data,
          loading
        }))
    
      }

    }

  }

  handleFilter = (e) => {
    
    let value = e.target.value.toLowerCase()

    if(value.length === 0) {

      this.setState((prevState, prevProps) => ({
        ...prevState,
        filtered: []
      }))

    } else {

      let filtered = this.state.data.filter(element => {
  
        return (
          element.jobTitle.toLowerCase().includes(value) ||
          element.jobData.toLowerCase().includes(value)
        )
  
      })
  
      this.setState((prevState, prevProps) => ({
        ...prevState,
        filtered
      }))
    
    }

  }

  handleCityChange = async (e) => {

    let city = e.target.value
    
    this.setState({ city, loading: true, pageNum: 1, search: null })

    let { html } = await getPage(this.config, 1, city)

    let { error, data, loading } = preparePage(html)

    this.setState((prevState, prevProps) => ({
      ...prevState,
      error,
      data,
      loading
    }))

  }

  handleSearch = async (e) => {

    if(e.key === 'Enter') {

      this.setState({ loading: true })

      let query = e.target.value.trimLeft().replace(' ', '+')

      if(query.trim().length > 0) {

        let { html } = await getPage(this.config, 1, query)
    
        let { error, data, loading } = preparePage(html)
    
        this.setState((prevState, prevProps) => ({
          ...prevState,
          search: query,
          error,
          data,
          loading
        }))
      
      }
  
    
    }

  }

  render() {

    let { pageNum, cities, loading, error, filtered, data } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1>TecnoJobs v2</h1>
          <div className="actions">
            <input type="search" placeholder="procurar" onKeyUp={ this.handleSearch } />  
            { cities.length > 0 && 
              <select onChange={ this.handleCityChange }>
                  <option value="any">Qualquer Cidade</option>
                { cities.map(city => {
                    return <option value={city} key={city}>{city}</option>
                }) }
              </select>
            }
          </div>
        </header>
        <section className="App-section">
          <input type="text" placeholder="filtrar" onChange={ this.handleFilter } />
          { !loading &&
            !error &&
            filtered.length === 0 &&
            data.length > 0 &&
              (
                <Fragment>
                  <div className="offers-container">
                    { data.map(element => {
                        return <Offer offer={element} key={element.id} />
                      })
                    }
                  </div>
                  { data.length === 10 && 
                    <div className="buttons-container">
                      { pageNum > 1 ?
                        <Fragment>
                          <button onClick={ () => this.handlePageChange('previous') }>Últimos 10</button>
                          { pageNum <= 75 &&
                            <button onClick={ () => this.handlePageChange('next') }>Próximos 10!</button>
                          }
                        </Fragment> :
                        <Fragment>
                          { pageNum <= 75 &&
                            <button onClick={ () => this.handlePageChange('next') }>Próximos 10!</button>
                          }
                        </Fragment>
                      }
                    </div>
                  }
                  <small>Página - { pageNum }</small>
                </Fragment>
              )
          }
          { !loading &&
            !error &&
            filtered.length !== 0 &&
            (
              <Fragment>
                <div className="offers-container">
                  { filtered.map(element => {
                      return <Offer offer={element} key={element.id} />  
                    })
                  }
                </div>
                <small>Página - { pageNum }</small>
              </Fragment>
            )
          }
          { loading &&
              <p className="message">A Carregar...</p>
          }
          { !loading && data.length === 0 && !error &&
            <p className="message">Sem Resultados!</p>
          }
          { !loading && error && 
            <p className="message">Erro ao carregar!</p>
          }
        </section>
      </div>
    );
  }
}

export default App;
