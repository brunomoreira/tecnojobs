import React, { Component, Fragment } from 'react'
import preparePage from './utils/preparePage'
import loadCities from './utils/loadCities'
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
    cities: [],
    city: null
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
        let cities = await loadCities(this.config)
        
        this.setState((prevState, prevProps) => ({
          ...prevState,
          error,
          loading,
          data,
          cities
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
  
      let { html } = await getPage(this.config, this.state.pageNum + 1, this.state.city)
      
      let { error, data, loading } = preparePage(html)
  
      this.setState((prevState, prevProps) => ({
        ...prevState,
        error,
        data,
        loading
      }))
      
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
    
    this.setState({ city, loading: true, pageNum: 1 })

    let { html } = await getPage(this.config, 1, city)

    let { error, data, loading } = preparePage(html)

    this.setState((prevState, prevProps) => ({
      ...prevState,
      error,
      data,
      loading
    }))

  }

  render() {

    let { pageNum, cities, loading, error, filtered, data } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1>TecnoJobs v2</h1>
          <div className="actions">
            <input type="text" placeholder="filtrar" onChange={ this.handleFilter } />
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
              <p className="message">Loading...</p>
          }
          { !loading && data.length === 0 && !error &&
            <p className="message">No Data!</p>
          }
          { !loading && error && 
            <p className="message">Error Loading Data!</p>
          }
        </section>
      </div>
    );
  }
}

export default App;
