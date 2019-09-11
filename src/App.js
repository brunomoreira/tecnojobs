import React, { Fragment, useState, useEffect } from 'react'
import cheerio from 'cheerio'
import './App.css'

function App() {
  
  let [ data, setData ] = useState([])
  let [ pageNum, setPageNum ] = useState(1)
  let [ loading, setLoading ] = useState(true)
  let [ error, setError ] = useState(false)

  useEffect(() => {

    (async () => {
      let data = await getPage(pageNum)
      let body$ = data.body

      let readings = await body$.getReader().read()
      
      let blob = new Blob([ readings.value ], { type: 'text/html' })
      let reader = new FileReader()
    
      reader.addEventListener('loadend', (e) => {
        
        let html = e.srcElement.result

        // Prepare page
        preparePage(html)
      
      });
  
      reader.readAsText(blob)


    })()


  }, [pageNum, data])

  const preparePage = (page) => {
    
    const $ = cheerio.load(page)

    // Check for internal server error in html
    let headerError = $('#header').find('h1').contents()//[0].data
    
    if(headerError.length !== 0) {

      setError(true)
      setLoading(false)

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
          { jobTitle: String($(tRows.find('tr')[0]).text()).trim(), jobData: String($(tRows.find('tr')[1]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[0] ? $(tRows).find('a')[0].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[2]).text()).trim(), jobData: String($(tRows.find('tr')[3]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[1] ? $(tRows).find('a')[1].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[4]).text()).trim(), jobData: String($(tRows.find('tr')[5]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[2] ? $(tRows).find('a')[2].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[6]).text()).trim(), jobData: String($(tRows.find('tr')[7]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[3] ? $(tRows).find('a')[3].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[8]).text()).trim(), jobData: String($(tRows.find('tr')[9]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[4] ? $(tRows).find('a')[4].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[10]).text()).trim(), jobData: String($(tRows.find('tr')[11]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[5] ? $(tRows).find('a')[5].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[12]).text()).trim(), jobData: String($(tRows.find('tr')[13]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[6] ? $(tRows).find('a')[6].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[14]).text()).trim(), jobData: String($(tRows.find('tr')[15]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[7] ? $(tRows).find('a')[7].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[16]).text()).trim(), jobData: String($(tRows.find('tr')[17]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[8] ? $(tRows).find('a')[8].attribs.href : 'http://tecnojobs.pt'}` },
          { jobTitle: String($(tRows.find('tr')[18]).text()).trim(), jobData: String($(tRows.find('tr')[19]).text()), jobUrl: `http://tecnojobs.pt${$(tRows).find('a')[9] ? $(tRows).find('a')[9].attribs.href : 'http://tecnojobs.pt'}` },
        ]

        setData(data)
      
      }
    
      setLoading(false)

    }

  } 

  const getPage = async (pageNum) => {
  
    let rawRes = null
  
    try {

      if(pageNum === 1 || pageNum === 0) {
        rawRes = await fetch(`/api`, { method: 'GET', headers: { 'Content-Type': 'text/html' } })
      } else {
        rawRes = await fetch(`/api?page=${pageNum}`, { method: 'GET', headers: { 'Content-Type': 'text/html' } })
      }
      
      return rawRes
  
    } catch(error) {
      setError(true)
    }
  
  }

  const handleNextPage = () => {
    setLoading(true)
    setPageNum(pageNum + 1)
  }

  const handlePreviousPage = () => {
    
    setLoading(true)
    
    if(pageNum > 1) {
      setPageNum(pageNum - 1)
    }
  
  }

  const handleSearch = (e) => {
    
    let value = e.target.value
    
    let filtered = data.filter(element => {

      return (
        element.jobTitle.toLowerCase().search(value) !== -1 ||
        element.jobData.toLowerCase().search(value) !== -1
      )

    })

    setData(filtered);

  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>TecnoJobs v2</h1>
        <small>Página - { pageNum }</small>
        <input type="text" placeholder="filtrar" onChange={ handleSearch } />
      </header>
      <section className="App-section">
        { !loading &&
          !error &&
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
                      <button onClick={ handlePreviousPage }>Últimos 10</button>
                      { pageNum <= 75 &&
                        <button onClick={ handleNextPage }>Próximos 10!</button>
                      }
                    </Fragment> :
                    <Fragment>
                      { pageNum <= 75 &&
                        <button onClick={ handleNextPage }>Próximos 10!</button>
                      }
                    </Fragment>
                  }
                </div>
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

export default App;
