const board = new DrawingBoard.Board('board', {
    controls: ['Color', 'DrawingMode', {
        Navigation: {
            reset: true,
            forward: false,
            back: false
        },
    }],
    webStorage: false,
    size: 3,
    controlsPosition: 'bottom left',
})
let save = true

function changestate() {
    save = !save
}

function locktitle() {
    let btn = document.getElementById('locktitle')
    if (btn.textContent == "lock title") {
        btn.textContent = "unlock title"
        document.getElementById('title').disabled = 'true'
    } else {
        btn.textContent = "lock title"
        document.getElementById('title').removeAttribute('disabled')
    }
}

function loadlastdrawing() {
    let last = localStorage.last
    if (!last) return
    let raw = localStorage.data
    let array = JSON.parse(raw)
    let result = array.find(drawing => drawing.title == localStorage.last).img
    document.getElementById('title').value = localStorage.last
    if (result == null) return
    board.setImg(result)
}

function loaddrawing(title) {
    localStorage.last = title
    location.reload()
}

// function populatedrawings() {
//     let raw = localStorage.data
//     if (!raw) return
//     let array = JSON.parse(raw)
//     let holder = document.getElementById('selectdrawings')
//     holder.innerHTML = ""
//     array.forEach(drawing => {
//         let btn = document.createElement('button')
//         btn.textContent = drawing.title
//         btn.setAttribute('onclick', `loaddrawing('${drawing.title}')`)
//         holder.appendChild(btn)
//         holder.appendChild(document.createElement('br'))
//         holder.appendChild(document.createElement('br'))
//     });
// }

function newdrawing() {
    document.getElementById('title').value = ''
    let title = prompt('Please enter the title of your new drawing.')
    if (title == null || title === "") return
    let raw = localStorage.getItem('data')
    if (!raw) {
        localStorage.setItem('data', JSON.stringify([]))
        raw = localStorage.data
    }
    let array = JSON.parse(raw)
    if (array.find(v => v.title == title)) return alert('that already exists!')
    board.reset()
    localStorage.last = title
    array.push({
        title: title,
        img: null
    })
    localStorage.data = JSON.stringify(array)
    window.location.reload()
}


function updatedrawing(title) {
    let raw = localStorage.getItem('data')
    if (!raw) {
        localStorage.setItem('data', JSON.stringify([]))
        raw = localStorage.data
        console.log('raw didnt exist: ' + raw)
    }
    let array = JSON.parse(raw)
    if (array.find(drawing => drawing.title == title) == null) {
        console.log('nothing found, creating')
        initialize()
        return
    }
    array.find(drawing => drawing.title == title).img = board.getImg()
    let newdata = JSON.stringify(array)
    localStorage.setItem('data', newdata)
    localStorage.setItem('last', title)

}

function initialize() {
    if (!document.getElementById('title').value) return console.log('no title given, not saving')
    let title = document.getElementById('title').value
    let raw = localStorage.getItem('data')
    if (!raw) {
        localStorage.setItem('data', JSON.stringify([]))
        console.log('raw didnt exist: ' + raw)
    }
    let data = JSON.parse(raw)
    if (data.find(drawing => drawing.title == title) != null) {
        alert('only to be used to initialize a drawing! from now on the drawing saves after you stop drawing a line individualy')
        document.getElementById('deleteme').remove()
        return
    }
    let id = guid()
    data.push({
        title: document.getElementById('title').value,
        img: board.getImg()
    })
    let newdata = JSON.stringify(data)
    localStorage.setItem('data', newdata)
    localStorage.setItem('last', title)
}

function stopdrawing() {
    changestate()
    let drawings = document.querySelector('.drawing-board')
    if (save == false) {
        drawings.setAttribute('style', 'pointer-events: none;')
    } else {
        drawings.setAttribute('style', 'pointer-events: default;')
    }
}

// document.getElementById('title').value = "hello"



board.ev.bind('board:startDrawing', () => {
    console.log('start drawing')
})
// board.ev.bind('board:drawing', () => {
//     if (save == false) return
//     saveCTX()
// })
board.ev.bind('board:stopDrawing', () => {
    if (save == false) return
    updatedrawing(document.getElementById('title').value)
    console.log('stopped drawing')
})

board.ev.bind('board:reset', () => {
    if (save == false) return
    updatedrawing(document.getElementById('title').value)
    console.log('board was reset')
})

loadlastdrawing()



let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString()
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return new Date().getTime() + '-' + s4()
}

function clear() {
    localStorage.removeItem('data')
    localStorage.removeItem('last')
    board.reset()
    window.location.reload()
}

if (localStorage.last == null) {
    window.location = '..'
}