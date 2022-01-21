import client from './client.js'
let note = {
    key: 5,
}

client.getKey(note, (error, value) => {
    if (!error) {
       console.log(value)
    } else {
       console.error(error)
    }
})