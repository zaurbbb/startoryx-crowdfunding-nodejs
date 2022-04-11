require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const passport = require('passport')
const session = require('express-session')
const dotenv = require('dotenv')
const {engine} = require("express-handlebars")

//load dotenv config.
dotenv.config();

require('./config/passport')(passport)

const PORT = process.env.PORT || 5000;
const app = express()

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.use(errorMiddleware);
// handlebars
app.engine('.handlebars', engine());
app.set('view engine', '.handlebars');
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log("http://localhost:" + PORT))
    }
    catch (e){
        console.log(e)
        process.exit(1)
    }
}

app.use('/api', router);

start()