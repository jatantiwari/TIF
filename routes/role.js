const express = require('express');
const router = express.Router();
const { Snowflake } = require("@theinternetfolks/snowflake");
const Community = require('../models/Community')
const Role = require('../models/Role')
const jwt = require('jsonwebtoken')
const slugify = require('slugify');
const jwt_secret = "abcdefg"
router.post('/v1/role', async (req, res) => {
    try{const name = req.body.name;
    const id = Snowflake.generate();
    const role = await Role.create({ id, name });
    if (id) {
        res.status(200).send(role)
    }
    else {
        res.status(501).send("Unable to create role")
    }}catch(err){
        res.status(500).send(err.message)
    }


})

router.get('/v1/role', async (req, res) => {
    try {
        const role = await Role.find();
        if(role){
            res.status(200).send(role)
        }
        else{
            res.status(500).send("Unable to get role")
            
        }
    } catch (error) {
        res.status(500).send(error.message)
        
    }
})

module.exports = router;