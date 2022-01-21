import client from './client.js'
let newNote = {
    key: 5,
    value: 'c'
}

client.setKey(newNote, (error, note) => {
    if (!error) {
       console.log('note added to cache! current cache is: ', note)
    } else {
       console.error(error)
    }
})