const express = require('express');
const router = express.Router();
const { Snowflake } = require("@theinternetfolks/snowflake");
const Community = require('../models/Community')
const Member = require('../models/Member')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const slugify = require('slugify');
const jwt_secret = "abcdefg"

async function getJoinedCommunity(id){
    const member = await Member.find({user:id})
    if(member){
        let data = [];
        let len = member.length
        let i = 1;
        member.map(async (mem)=>{
            let isMem =await  Community.findOne({id:mem.community})
            data = data.concat(isMem)
            if(i==len){
                console.log(data);
            }
            i++;
        })
        return true;
    }
    else{
        return false;
    }
}

async function  getData(slug){
    const comm = await Community.findOne({slug:slug})
        if(comm){
            const id = comm.id;
            const members = await Member.find({community:id})
            let data = [];
            let len = members.length;
            console.log(len)
            let  i =1;
            if(members){
                members.map(async (member)=>{
                    let user = await User.findOne({id:member.user})
                    data = data.concat({name:user.name,id:member.user})
                    if(i==len){

                        console.log(data)
                    }
                    i++

                })
                return true;
                
            }
        }
        return false;
}
router.post('/v1/community', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const data = jwt.verify(token, jwt_secret);
            const owner = data.user.id
            const id = Snowflake.generate();
            const name = req.body.name;
            const slug = slugify(name, {
                replacement: '-',  
                lower: true,  
              });
            const community = await Community.create({ id: id, name: name,slug:slug,owner: owner})

            if (community) {
                res.status(200).send(community);
            }
            else {
                res.status(501).send('Unable to create community')
            }

        }
        else {
            res.status(401).send('Unable to verify token')
        }

    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get('/v1/community', async (req, res) => {
   try {
        const community = await Community.find();
        if(community){
            res.status(200).send(community);
        }
        else{
            res.status(500).send("No community found");
            
        }
    } catch (error) {
       res.status(500).send(error.message);
    
   }
})
router.get('/v1/community/:id/members', async (req, res) => {
    try {
        let slug = req.params.id
        let data = await getData(slug)
        if(data){
            res.status(200).send('members found check console')
        }
        else{
            res.status(400).send("Unable to find community");  
        }
    } catch (error) {
        res.status(500).send(error.message);
        
    }
})
router.get('/v1/community/me/owner', async (req, res) => {
 try {
        const token = req.cookies.token;
        if (token) {
            const data = jwt.verify(token, jwt_secret);
            const owner = data.user.id
            const id = Snowflake.generate();
            const name = req.body.name;
            const slug = slugify(name, {
                replacement: '-',  
                lower: true,  
              });
            const community = await Community.create({ id: id, name: name,slug:slug,owner: owner})

            if (community) {
                res.status(200).send(community);
            }
            else {
                res.status(501).send('Unable to create community')
            }

        }
        else {
            res.status(401).send('Unable to verify token')
        }

    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get('/v1/community/me/member', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const data = jwt.verify(token, jwt_secret);
            const id = data.user.id
            if(getJoinedCommunity(id)){
                res.status(200).send("community found check console")
            }
            else{
                res.status(500).send("Unable to find community")
            }     
        }
    } catch (error) {
        res.status(500).send(error.message)
        
    }
})

module.exports = router;