'use strict'

function initApp() {
    loadQuestions()
    initQuestionForm()
    initDeleteButtons()
}

async function loadQuestions() {
    const questionList = document.querySelector('.questions')

    const response = await fetch('/api/questions')
    const questions = await response.json()

    while (questionList.firstChild) {
        questionList.removeChild(questionList.firstChild)
    }

    for (let objectid in questions) {
        const { title, text } = questions[objectid]
        if (!title || !text) continue

        questionList.appendChild(createQuestionHTML(objectid, title, text))
    }
}

function createQuestionHTML(objectid, title, text) {
    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.className = 'delete-button'
    deleteButton.dataset.objectid = objectid
    deleteButton.appendChild(document.createTextNode('❌'))

    const qTitle = document.createElement('h2')
    qTitle.appendChild(document.createTextNode(title))
    qTitle.appendChild(deleteButton)

    const question = document.createElement('li')
    question.appendChild(qTitle)
    question.appendChild(document.createTextNode(text))
    return question
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

function initDeleteButtons() {
    window.addEventListener('click', async event => {
        if (event.target.className === 'delete-button' &&
            event.target.dataset.objectid) {

            await fetch('/api/questions/' + event.target.dataset.objectid, {
                method: 'DELETE'
            })

            loadQuestions()
        }
    })
}
