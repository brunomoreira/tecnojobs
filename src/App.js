import React, { Component, Fragment } from 'react'
import preparePage from './utils/preparePage'
import getPage from './utils/getPage'
import Offer from './components/offer/Offer'
import Favorites from './components/favorites/Favorites'
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
    search: null,
    favorites: [],
    showFavorites: false
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

    // Get Favorites
    if (JSON.parse(localStorage.getItem('favorites'))) {
      this.setState({ favorites: JSON.parse(localStorage.getItem('favorites')) })
    }

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

  handleSetFavorite = (offer) => {
    
    // find offer in the data array and update it aswell
    let newData = [...this.state.data]
    let index = newData.findIndex(el => el.id === offer.id)

    // Check if its already favorited - remove if true
    if (newData[index] && newData[index].favorited) {
      newData[index] = {...offer, favorited: false}
    } else {      
      newData[index] = {...offer, favorited: true}
    }

    // Set on localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites'))

    if(!favorites) {

      // Set favorites on state
      this.setState((prevState, prevProps) => ({
        ...prevState,
        data: newData,
        favorites: [
          ...prevState.favorites,
          { ...offer, favorited: true }
        ]
      }))

      localStorage.setItem('favorites', JSON.stringify([{...offer, favorited: true}]))
    
    } else {
      
      if(offer.favorited) {

        let favorites = this.state.favorites.filter(favorite => offer.id !== favorite.id)

        // Set favorites on state
        this.setState((prevState, prevProps) => ({
          ...prevState,
          data: newData,
          favorites
        }))

        localStorage.setItem('favorites', JSON.stringify([...favorites]))
      
      } else {
        // Set favorites on state
        this.setState((prevState, prevProps) => ({
          ...prevState,
          data: newData,
          favorites: [
            ...prevState.favorites,
            { ...offer, favorited: true }
          ]
        }))
      
        localStorage.setItem('favorites', JSON.stringify([...favorites, {...offer, favorited: true}]))
      
      }
    }

    // Set showFavorites to false if no favorites are found after removal
    if(this.state.favorites.length === 0 && this.state.showFavorites) {
      this.setState({ showFavorites: false })
    }

  }

  render() {

    let { pageNum, cities, loading, error, filtered, data, favorites, showFavorites } = this.state

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
            <button 
              className="show-favorites-btn" 
              disabled={ favorites.length === 0 ? 'disabled' : '' } 
              onClick={ () => this.setState({ showFavorites: !showFavorites })}
            >
              <i className={ favorites.length === 0 ? 'far fa-heart' : 'fas fa-heart' }></i>
               Favoritos
              </button>
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
                        return <Offer offer={element} key={element.id} handleSetFavorite={this.handleSetFavorite} />
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
                      return <Offer offer={element} key={element.id} handleSetFavorite={this.handleSetFavorite} />  
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
        { favorites.length > 0 && showFavorites &&
          <Favorites favorites={favorites} handleSetFavorite={this.handleSetFavorite} />
        }
      </div>
    );
  }
}

export default App;
