const express = require('express');
const router = express.Router();
const { Snowflake } = require("@theinternetfolks/snowflake");
const Member = require('../models/Member')
const Role = require('../models/Role')
const jwt = require('jsonwebtoken')
const slugify = require('slugify');
const jwt_secret = "abcdefg"

router.post('/v1/member', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const id = Snowflake.generate();
            const { community, user, role } = req.body;
            const member = await Member.create({ id, community, user, role });
            if (member) {
                res.status(200).send(member);
            }
            else {
                res.status(500).send("unable to create member");
            }
        }
        else {

            res.status(400).send("unable to verify token");
        }

    }catch (error) {
        res.status(500).send(error.message);
    }
})
router.delete('/v1/member/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const member = await Member.findOneAndDelete({ id:id });
        if(member){
            res.status(200).send(member);
        }
        else{
            res.status(500).send("Unable to delete member")
        }
    } catch (error) {
        res.status(500).send(error.message)
        
    }
})


module.exports = router;


