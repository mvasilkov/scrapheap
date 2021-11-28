import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// const api = 'https://api.airtable.com/v0/appxcAffF21lWb1vk/riddles?fields%5B%5D=Title&fields%5B%5D=Info&fields%5B%5D=Num&fields%5B%5D=Section&fields%5B%5D=Task&fields%5B%5D=Solution&sort%5B0%5D%5Bfield%5D=Num'
const api = 'https://api.airtable.com/v0/appxcAffF21lWb1vk/contents?fields%5B%5D=Num&fields%5B%5D=Title&fields%5B%5D=Href&sort%5B0%5D%5Bfield%5D=Num&filterByFormula=%28%7Bvisibility%7D%20%3D%20%27published%27%29'
const auth = { Authorization: 'Bearer keyjVwf4ZBroViZYl' }

async function fetchOptions() {
    const res = await fetch(api, { headers: auth })
    return res.json()
}

function Nav({ current }) {
    const [options, setOptions] = useState([])

    useEffect(async () => {
        let alive = true

        const opt = await fetchOptions()
        if (alive) setOptions(opt?.records)

        return () => alive = false
    }, [])

    return (
        <ul className="nav">
            {options.map(({ id, fields }) =>
                <li key={id} className={current === fields.Href ? 'current' : ''}>
                    <Link href={`/cat/${encodeURIComponent(fields.Href)}`}>
                        <a>{fields.Title}</a>
                    </Link>
                </li>
            )}
        </ul>
    )
}

export default Nav
