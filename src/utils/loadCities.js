export default async (config) => {
    
    let raw = await fetch(`${config.prod}cities`)
    let { cities } = await raw.json()

    return cities

}