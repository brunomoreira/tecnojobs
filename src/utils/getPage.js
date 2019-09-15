export default async (config, pageNumber, query) => {

    try {

        if(pageNumber === 1 || pageNumber === 0) {
          
          if(query) {
  
            let response = await fetch(`${config.prod}?CHAVES=${query}`)
            let html = await response.text()
            
            return {
                error: false,
                html
            }
  
          } else {
  
            let response = await fetch(`${config.prod}`)
            let html = await response.text()
            
            return {
                error: false,
                html
            }
          }
        
        } else {
  
          if(query) {
  
            let response = await fetch(`${config.prod}?page=${pageNumber}&CHAVES=${query}`)
            let html = await response.text()
            
            return {
                error: false,
                html
            }
  
          } else {
            
            let response = await fetch(`${config.prod}?page=${pageNumber}`)
            let html = await response.text()
            
            return {
                error: false,
                html
            }
          
          }
        
        }
        
    
      } catch(error) {
        return {
            error: true,
            html: null
        }
    }

}