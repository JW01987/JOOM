const msgForm = document.querySelector('#msg')
const nickForm = document.querySelector('#nick')
const msgList = document.querySelector('ul')
const socket = new WebSocket(`ws://${window.location.host}`)

function makeJson(type, payload) {
    const data = {
        type: type,
        payload: payload
    }
    return JSON.stringify(data)
}

socket.addEventListener('open', () => {
    console.log('Server is Open ✅')
})

socket.addEventListener('message', (message) => {
    const li = document.createElement('li')
    li.innerText = message.data
    msgList.append(li)
})

socket.addEventListener('close', () => {
    console.log('Server is Close ❌')
})

msgForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = msgForm.querySelector('input')
    socket.send(makeJson('message', input.value))
    input.value = ''
})
nickForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = nickForm.querySelector('input')
    socket.send(makeJson('nickname', input.value))
})