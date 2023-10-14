const express = require('express');
const router = express.Router();
const { Snowflake } = require("@theinternetfolks/snowflake");
const Community = require('../models/Community')
const Member = require('../models/Member')
const Role = require('../models/Role')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const slugify = require('slugify');
const jwt_secret = "abcdefg"

async function updateCommunity(community){
    let data = [];
    await Promise.all(community.map(async (comm)=>{
        let user = await User.findOne({id:comm.owner})
        comm.owner = "{id: "+comm.id+", name: "+user.name+"}"
        data = data.concat(comm);

    }))
    return data;
}

async function getJoinedCommunity(id) {
    const member = await Member.find({ user: id })
    if (member) {
        let data = [];
        await Promise.all(member.map(async (mem) => {
            let isMem = await Community.findOne({ id: mem.community })
            data = data.concat(isMem)
            
        }))
        return data;
    }
    else {
        return false;
    }
}

async function getData(slug) {
    const comm = await Community.findOne({ slug: slug })
    let members = await Member.find({community:comm.id});
    let data = [];
    if(members){
        await Promise.all(members.map (async(member)=>{
            let user = await User.findOne({id: member.user});
            let role = await Role.findOne({id: member.role});
            let newData = new Object();
            newData.id = member.id;
            newData.community = comm.id
            newData.user = {id:user.id,name:user.name}
            newData.role = {id:role.id,name:role.name}
            newData.created_at = comm.created_at
            data = data.concat(newData);
        }))
    }
    return data;
        
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
            const community = await Community.create({ id: id, name: name, slug: slug, owner: owner })

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
        let community = await Community.find();
        let data2 = await updateCommunity(community)
        if (data2) {
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
                            data2: pageData,
                        },
                    };
                    res.status(200).send(response)
                }
        }
        else {
            res.status(500).send("No community found");

        }
    } catch (error) {
        res.status(500).send(error.message);

    }
})
router.get('/v1/community/:id/members', async (req, res) => {
    try {
        let slug = req.params.id
        let data2 = await getData(slug)
        if (data2) {
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
                            data2: pageData,
                        },
                    };
                    res.status(200).send(response)
                }
        }
        else {
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
                const id = data.user.id
                const data2= await Community.find({owner:id});
                if(data){
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
                            data2: pageData,
                        },
                    };
                    res.status(200).send(response)
                }
            }
            else{
                res.status(400).send("No community found")
            }
        }
        else{
                res.status(400).send("No token found")
                
            }
        } catch (error) {
        res.status(400).send(error.message)
        
    }
        
})
router.get('/v1/community/me/member', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const data = jwt.verify(token, jwt_secret);
            const id = data.user.id
            let data2 = await getJoinedCommunity(id)
            if (data2) {
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
            else {
                res.status(500).send("Unable to find community")
            }
        }
    } catch (error) {
        res.status(500).send(error.message)

    }
})

module.exports = router;