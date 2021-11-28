import React from 'react'
import { useRouter } from 'next/router'
import Nav from '../../components/nav'

function CatPage() {
    const router = useRouter()
    const { cat } = router.query

    return (
        <Nav current={cat} />
    )
}

export default CatPage
