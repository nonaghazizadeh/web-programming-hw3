import client from '../client.js'

client.clear({},(error,note) => {
    if (!error) {
       console.log(note)
    } else {
       console.error(error)
    }
})