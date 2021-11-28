const api = 'https://api.airtable.com/v0/appxcAffF21lWb1vk/contents?fields%5B%5D=Num&fields%5B%5D=Title&fields%5B%5D=Href&sort%5B0%5D%5Bfield%5D=Num&filterByFormula=%28%7Bvisibility%7D%20%3D%20%27published%27%29'
const auth = { Authorization: 'Bearer keyjVwf4ZBroViZYl' }

async function fetchOptions() {
    const res = await fetch(api, { headers: auth })
    return res.json()
}

module.exports = {
    async redirects() {
        const opt = await fetchOptions()
        if (!opt || !opt.records || !opt.records.length) {
            return []
        }

        const { fields } = opt.records[0]
        console.log(`Index page will redirect to ${fields.Title} (${fields.Href})`)
        return [
            {
                source: '/',
                destination: `/cat/${encodeURIComponent(fields.Href)}`,
                permanent: false,
            },
        ]
    },
}
