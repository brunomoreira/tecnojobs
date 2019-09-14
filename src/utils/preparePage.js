import cheerio from 'cheerio'

export default (page) => {

    const $ = cheerio.load(page)

    // Check for internal server error in html
    let headerError = $('#header').find('h1').contents()//[0].data
    
    if(headerError.length !== 0) {

      return {
          error: true,
          loading: false,
          data: []
      }

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

      return {
          data,
          loading: false,
          error: false
      }

    }

}