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

      let raw = await this.getPage(this.state.pageNum, null)
      let html = await raw.text()

      this.preparePage(html)

      this.loadCities()

    })()

  }

  config = {
    dev: 'http://localhost:4000/api/',
    prod: '/api/'
  }
  
  getPage = async (pageNum, city) => {
    
    try {

      if(pageNum === 1 || pageNum === 0) {
        
        if(city) {

          let response = await fetch(`${this.config.prod}?CHAVES=${city}`)
          return response

        } else {

          let response = await fetch(`${this.config.prod}`)
          return response
        }
      
      } else {

        if(city) {

          let response = await fetch(`${this.config.prod}?page=${pageNum}&CHAVES=${city}`)
          return response

        } else {
          
          let response = await fetch(`${this.config.prod}?page=${pageNum}`)
          return response
        
        }
      
      }
      
  
    } catch(error) {
      this.setState({ error: true })
    }
  }

  loadCities = async () => {
    
    let raw = await fetch(`${this.config.prod}cities`)
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

      let jobsUrls = $(tRows).find('a')
      
      // Array to construct with page data
      let data = []

      for(let i = 0; i < tRows.find('tr').length - 1; i++) {

        if(i % 2 === 0) {
          
          let jobTitle = String($(tRows.find('tr')[i]).text()).trim()
          let jobData = String($(tRows.find('tr')[i + 1]).text()).trim()
          let jobUrl = 'http://tecnojobs.pt'

          if(i === 0) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[0].attribs.href}`
          } else if(i === 2) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[1].attribs.href}`
          } else if(i === 4) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[2].attribs.href}`
          } else if(i === 6) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[3].attribs.href}`
          } else if(i === 8) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[4].attribs.href}`
          } else if(i === 10) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[5].attribs.href}`
          } else if(i === 12) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[6].attribs.href}`
          } else if(i === 14) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[7].attribs.href}`
          } else if(i === 16) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[8].attribs.href}`
          } else if(i === 18) {
            jobUrl = `http://tecnojobs.pt${jobsUrls[9].attribs.href}`
          }

          data.push({
            jobTitle,
            jobData,
            jobUrl
          })
        
        }
      
      }

      this.setState((prevState, prevProps) => ({
        ...prevState,
        data
      }))
    
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
    let html = await raw.text()
    
    this.preparePage(html)

  }

  handlePreviousPage = async () => {
    
    if(this.state.pageNum > 1) {
      
      this.setState((prevState, prevProps) => ({
        ...prevState,
        loading: true,
        pageNum: prevState.pageNum - 1
      }))

      let raw = await this.getPage(this.state.pageNum - 1, this.state.city)
      let html = await raw.text()
      
      this.preparePage(html)
  
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

    let raw = await this.getPage(1, city)
    let html = await raw.text()

    this.preparePage(html)

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
                  { data.length === 10 && 
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
