
const connectToMongo = require('./config/db');
const express = require('express');
const port = 3000
const cookieParser = require('cookie-parser');
connectToMongo();
const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(require('./routes/user'))
app.use(require('./routes/community'))
app.use(require('./routes/member'))
app.use(require('./routes/role'))
app.listen(port,()=>{
    console.log(`listening on port at http://localhost:${port}`)
})