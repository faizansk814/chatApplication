const express = require('express')
const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userrouter = express.Router()


userrouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const isUserPresent = await UserModel.findOne({ email })
        if (isUserPresent) {
            return res.status(401).send({ msg: "User already present" })
        }
        bcrypt.hash(password, 5, async (err, hash) => {
            const newUser = new UserModel({ name, email, password: hash })
            await newUser.save()
            return res.status({ msg: "Registration Succesful" })
        })
    } catch (error) {
        return res.status(401).send({ msg: error.message })
    }
})


userrouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const isUserPresent = await UserModel.findOne({ email })
        if (isUserPresent) {
            bcrypt.compare(password, isUserPresent.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: isUserPresent._id }, "marvel", { expiresIn: "1h" })
                    return res.status(200).send({ msg: "Login succesful", token })
                } else {
                    return res.status(401).send({ msg: "wrong credintials" })
                }
            })
        } else {
            return res.status(401).send({ msg: "No user present" })
        }

    } catch (error) {
        return res.status(401).send({ msg: error.message })
    }
})

module.exports = userrouter