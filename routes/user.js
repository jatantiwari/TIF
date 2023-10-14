const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { Snowflake } = require("@theinternetfolks/snowflake");
const jwt = require('jsonwebtoken')
const jwt_secret = "abcdefg"

router.post('/v1/auth/signup', async (req, res) => {
    const id = Snowflake.generate();
    const { name, email, password } = req.body;
    try {
        if (name != null && email != null && password != null) {
            const user = await User.create({ id, name, email, password })
            if (user != null) {
                res.status(201).send("user signed up")
            }
            else {
                res.status(500).send("unable to create user")
            }
        }
        else {
            res.status(401).send("name, email or password must not empty");
        }
    } catch (error) {
        res.status(501).send(error.message);
    }

})

router.post('/v1/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "email not matched" });

        }
        if (password != user.password) {
            return res.status(400).json({ error: "Password not matched" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const userToken = jwt.sign(data, jwt_secret);
        res.cookie('token', userToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).send(user)

    }

    // Handling and catching errors
    catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/v1/auth/me', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const data = jwt.verify(token, jwt_secret);
            const id = data.user.id
            const user = await User.findOne({ id, id });
            if (user) {
                res.status(200).send(user);
            }
            else {
                res.status(501).send('Unable to find user')
            }

        }
        else {
            res.status(401).send('Unable to verify token')
        }

    } catch (err) {
        res.status(500).send(err.message)
    }
})
module.exports = router;

