export default async (config) => {
    
    let raw = await fetch(`${config.dev}cities`)
    let { cities } = await raw.json()

    return cities

}