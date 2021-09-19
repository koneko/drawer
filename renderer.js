function render() {
    let raw = localStorage.data
    if (!raw) {
        localStorage.setItem('data', JSON.stringify([]))
        raw = '[]'
    }
    let array = JSON.parse(raw)
    array.forEach(drawing => {
        let title = document.createElement('h3')
        let editbtn = document.createElement('button')
        let deletebtn = document.createElement('button')
        let div = document.createElement('div')
        let boardraw = document.createElement('div')
        let container = document.getElementById('container')
        boardraw.setAttribute('id', drawing.title)
        // boardraw.setAttribute('style', 'width: 1200px; height: 600px; pointer-events: none;')
        boardraw.setAttribute('style', 'width: 400px; height: 250px; pointer-events: none;')
        container.appendChild(div)
        editbtn.textContent = 'Edit'
        deletebtn.textContent = 'Delete'
        title.textContent = drawing.title
        editbtn.setAttribute('onclick', `edit('${drawing.title}')`)
        deletebtn.setAttribute('onclick', `deletedrawing('${drawing.title}')`)
        editbtn.setAttribute('class', `btn btn-secondary`)
        editbtn.setAttribute('style', `margin-right: 10px`)
        deletebtn.setAttribute('class', `btn btn-danger`)
        div.appendChild(boardraw)
        div.appendChild(title)
        div.appendChild(editbtn)
        div.appendChild(deletebtn)
        const board = new DrawingBoard.Board(drawing.title, {
            controls: [],
            webStorage: false,
            stretchImg: true
        })
        board.setImg(drawing.img)
    });
}

function edit(title) {
    localStorage.last = title
    window.location = 'edit'
}

function newdrawing() {
    let title = prompt('Please enter the title of your new drawing.')
    if (title == null || title === "") return
    localStorage.last = title
    let raw = localStorage.getItem('data')
    if (!raw) {
        localStorage.setItem('data', JSON.stringify([]))
        raw = localStorage.data
    }
    let array = JSON.parse(raw)
    array.push({
        title: title,
        img: null
    })
    localStorage.data = JSON.stringify(array)
    window.location = 'edit'
}

function deletedrawing(title) {
    if (confirm("Are you sure you want to delete this?")) {
        let raw = localStorage.data
        if (!raw) {
            localStorage.setItem('data', JSON.stringify([]))
            raw = '[]'
        }
        let array = JSON.parse(raw)
        let badthing = array.find(drawing => drawing.title == title)
        let newarray = arrayRemove(array, badthing)
        localStorage.data = JSON.stringify(newarray)
        localStorage.removeItem('last')
        location.reload()
    }
}

function clearall() {
    if (confirm("Are you sure? (can't be undone)")) {
        localStorage.removeItem('data')
        localStorage.removeItem('last')
        location.reload()
    }
}

function openlast() {
    window.location = 'edit'
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

render()