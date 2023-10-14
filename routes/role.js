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
        const data2 = await Role.find();
        if(data2){
            const page = 1;
                const perPage = 10;
                const total = data2.length;
                const totalPages = Math.ceil(total / perPage)
                if (page < 1 || page > totalPages) {
                    console.log("Invalid page number");
                } else {
                    const startIdx = (page - 1) * perPage;
                    const endIdx = startIdx + perPage;
                    const pageData = data2.slice(startIdx, endIdx);

                    const response = {
                        status: true,
                        content: {
                            meta: {
                                total,
                                pages: totalPages,
                                page,
                            },
                            data: pageData,
                        },
                    };
                    res.status(200).send(response)
                }
        }
        else{
            res.status(500).send("Unable to get role")
            
        }
    } catch (error) {
        res.status(500).send(error.message)
        
    }
})

module.exports = router;