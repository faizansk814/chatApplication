const express = require('express')
const connection = require('./connection/db')

const app = express()




app.listen(4031,async () => {
    try {
        await connection
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
    console.log("connected to express")
})