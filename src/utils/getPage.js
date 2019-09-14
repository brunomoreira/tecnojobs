export default async (config, pageNumber, city) => {

    try {

        if(pageNumber === 1 || pageNumber === 0) {
          
          if(city) {
  
            let response = await fetch(`${config.dev}?CHAVES=${city}`)
            let html = await response.text()
            
            return {
                error: false,
                html
            }
  
          } else {
  
            let response = await fetch(`${config.dev}`)
            let html = await response.text()
            
            return {
                error: false,
                html
            }
          }
        
        } else {
  
          if(city) {
  
            let response = await fetch(`${config.dev}?page=${pageNumber}&CHAVES=${city}`)
            let html = await response.text()
            
            return {
                error: false,
                html
            }
  
          } else {
            
            let response = await fetch(`${config.dev}?page=${pageNumber}`)
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