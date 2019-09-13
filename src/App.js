import React, { Component, Fragment } from 'react'
import cheerio from 'cheerio'
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

  componentDidMount() {

    (async () => {

      let raw = await this.getPage(this.state.pageNum)
      let html = await raw.text()

      this.preparePage(html)

      this.loadCities()

    })()

  }

  config = {
    dev: 'https://tecnojobs-app.herokuapp.com/api/',
    prod: '/api/'
  }
  
  getPage = async (pageNum, city = null) => {
    
    try {

      if(pageNum === 1 || pageNum === 0) {
        
        if(city) {

          let response = await fetch(`${this.config.dev}?CHAVES=${city}`)
          return response

        } else {

          let response = await fetch(`${this.config.dev}`)
          return response
        }
      
      } else {

        if(city) {

          let response = await fetch(`${this.config.dev}?page=${pageNum}&CHAVES=${city}`)
          return response

        } else {
          
          let response = await fetch(`${this.config.dev}?page=${pageNum}`)
          return response
        
        }
      
      }
      
  
    } catch(error) {
      this.setState({ error: true })
    }
  }

  loadCities = async () => {
    
    let raw = await fetch(`${this.config.dev}cities`)
    let { cities } = await raw.json()

    this.setState((prevState, prevProps) => ({
      ...prevState,
      cities
    }))
  
  }

  preparePage = (page) => {
    
    const $ = cheerio.load(page)

    // Check for internal server error in html
    let headerError = $('#header').find('h1').contents()//[0].data
    
    if(headerError.length !== 0) {

      this.setState({ error: true, loading: false })

    } else {

      // If no error was found - parse html and construct object
      const tRows = $('#AutoNumber2').find('tbody')
  
      if(
        $(tRows.find('tr')[0]).text().length > 0 && 
        $(tRows.find('tr')[1]).text().length > 0 &&
        $(tRows.find('tr')[2]).text().length > 0 && 
        $(tRows.find('tr')[3]).text().length > 0 &&
        $(tRows.find('tr')[4]).text().length > 0 && 
        $(tRows.find('tr')[5]).text().length > 0 &&
        $(tRows.find('tr')[6]).text().length > 0 && 
        $(tRows.find('tr')[7]).text().length > 0 &&
        $(tRows.find('tr')[8]).text().length > 0 && 
        $(tRows.find('tr')[9]).text().length > 0
      ) {

        let data = [
          { jobTitle: String($(tRows.find('tr')[0]).text()).trim(), jobData: String($(tRows.find('tr')[1]).text()), jobUrl: $(tRows).find('a')[0] ? `http://tecnojobs.pt${(tRows).find('a')[0].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[2]).text()).trim(), jobData: String($(tRows.find('tr')[3]).text()), jobUrl: $(tRows).find('a')[1] ? `http://tecnojobs.pt${(tRows).find('a')[1].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[4]).text()).trim(), jobData: String($(tRows.find('tr')[5]).text()), jobUrl: $(tRows).find('a')[2] ? `http://tecnojobs.pt${(tRows).find('a')[2].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[6]).text()).trim(), jobData: String($(tRows.find('tr')[7]).text()), jobUrl: $(tRows).find('a')[3] ? `http://tecnojobs.pt${(tRows).find('a')[3].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[8]).text()).trim(), jobData: String($(tRows.find('tr')[9]).text()), jobUrl: $(tRows).find('a')[4] ? `http://tecnojobs.pt${(tRows).find('a')[4].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[10]).text()).trim(), jobData: String($(tRows.find('tr')[11]).text()), jobUrl: $(tRows).find('a')[5] ? `http://tecnojobs.pt${(tRows).find('a')[5].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[12]).text()).trim(), jobData: String($(tRows.find('tr')[13]).text()), jobUrl: $(tRows).find('a')[6] ? `http://tecnojobs.pt${(tRows).find('a')[6].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[14]).text()).trim(), jobData: String($(tRows.find('tr')[15]).text()), jobUrl: $(tRows).find('a')[7] ? `http://tecnojobs.pt${(tRows).find('a')[7].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[16]).text()).trim(), jobData: String($(tRows.find('tr')[17]).text()), jobUrl: $(tRows).find('a')[8] ? `http://tecnojobs.pt${(tRows).find('a')[8].attribs.href}` : 'http://tecnojobs.pt' },
          { jobTitle: String($(tRows.find('tr')[18]).text()).trim(), jobData: String($(tRows.find('tr')[19]).text()), jobUrl: $(tRows).find('a')[9] ? `http://tecnojobs.pt${(tRows).find('a')[9].attribs.href}` : 'http://tecnojobs.pt' },
        ]

        this.setState((prevState, prevProps) => ({
          ...prevState,
          data
        }))
      
      }
    
      this.setState({ loading: false })

    }

  }

  handleNextPage = async () => {
    
    this.setState((prevState, prevProps) => ({
      ...prevState,
      loading: true,
      pageNum: prevState.pageNum + 1
    }))

    let raw = await this.getPage(this.state.pageNum + 1, this.state.city)
    this.preparePage(raw.text())

  }

  handlePreviousPage = async () => {
    
    if(this.state.pageNum > 1) {
      
      this.setState((prevState, prevProps) => ({
        ...prevState,
        loading: true,
        pageNum: prevState.pageNum - 1
      }))

      let raw = await this.getPage(this.state.pageNum - 1, this.state.city)
      this.preparePage(raw.text())
  
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
    
    this.setState({ city })

    let raw = await this.getPage(1, city)

    this.preparePage(raw.text())

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
                  <option value="any">Qualquer</option>
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
                    { data.map((element, index) => {
                        return (
                          <div className="offer" key={index}>
                            <h2>{ element.jobTitle }</h2>
                            <p>{ element.jobData }</p>
                            <a href={ element.jobUrl } target="_blank" rel="noopener noreferrer">Candidatura!</a>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="buttons-container">
                    { pageNum > 1 ?
                      <Fragment>
                        <button onClick={ this.handlePreviousPage }>Últimos 10</button>
                        { pageNum <= 75 &&
                          <button onClick={ this.handleNextPage }>Próximos 10!</button>
                        }
                      </Fragment> :
                      <Fragment>
                        { pageNum <= 75 &&
                          <button onClick={ this.handleNextPage }>Próximos 10!</button>
                        }
                      </Fragment>
                    }
                  </div>
                  <small>Página - { pageNum }</small>
                </Fragment>
              )
          }
          { !loading &&
            !error &&
            filtered.length !== 0 &&
            (
                <div className="offers-container">
                { filtered.map((element, index) => {
                    return (
                        <div className="offer" key={index}>
                        <h2>{ element.jobTitle }</h2>
                        <p>{ element.jobData }</p>
                        <a href={ element.jobUrl } target="_blank" rel="noopener noreferrer">Candidatura!</a>
                        </div>
                    )
                    })
                }
                </div>
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
