'use strict'

function initApp() {
    loadQuestions()
    initQuestionForm()
}

async function loadQuestions() {
    const response = await fetch('/api/questions')
    const questions = await response.json()
    const contents = []
    for (let objectid in questions) {
        const { title, text } = questions[objectid]
        contents.push(`<li><h2>${title}</h2>${text}</li>`)
    }
    document.querySelector('.questions').innerHTML = contents.join('')
}

function initQuestionForm() {
    const qTitle = document.getElementById('q-title')
    const qText = document.getElementById('q-text')
    let sending = false

    document.getElementById('q-form').addEventListener('submit', async event => {
        event.preventDefault()

        if (sending) return

        const title = qTitle.value
        const text = qText.value
        if (!title || !text) return

        sending = true

        await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                text,
            })
        })

        qTitle.value = ''
        qText.value = ''

        sending = false

        loadQuestions()
    })
}
