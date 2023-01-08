const socket = io();
const welcome = document.querySelector('#welcome')
const roonNameform = welcome.querySelector('#room-name')
const nickForm = welcome.querySelector('#nick')
const room = document.querySelector('#room')


let roomName = ''

room.hidden = true;

function msgSubmit(e) {
    e.preventDefault()
    const input = room.querySelector('#msg input')
    socket.emit('newMsg', input.value, roomName, () => {
        printMsg(`You: ${input.value}`)
        input.value = ''
    })
}

function showRoom() {
    const h3 = room.querySelector('h3')
    welcome.hidden = true;
    room.hidden = false
    h3.innerText = `Room: ${roomName}`
    const msgForm = room.querySelector('#msg')
    msgForm.addEventListener('submit', msgSubmit)
}

function printMsg(msg) {
    const ul = room.querySelector('ul')
    const li = document.createElement('li')
    li.innerText = msg
    ul.append(li)
}

roonNameform.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = roonNameform.querySelector('input')
    socket.emit('enter_room', input.value, showRoom)
    roomName = input.value
    input.value = ''
})
nickForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = nickForm.querySelector('input')
    socket.emit('nickname', input.value)
})

socket.on('welcome', (user) => {
    printMsg(`${user} Join! 🎉`)
})

socket.on('bye', (user) => {
    printMsg(`${user} Left! 👋`)
})

socket.on('sendMsg', (msg) => {
    printMsg(msg)
})