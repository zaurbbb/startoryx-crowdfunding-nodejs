require('dotenv').config()
const dotenv = require('dotenv')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const passport = require('passport')
const router = require('./router/user-router')
const adminRouter = require('./router/admin-router')
const projectRouter = require('./router/project-router')
const errorMiddleware = require('./middlewares/error-middleware')

dotenv.config();

require('./controllers/passport')(passport)
require('./cron/days-update')

const PORT = process.env.PORT || 5000;
const app = express()

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:process.env.GOOGLE_CLIENT_SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        ttl: 7 * 24 *  60 * 60, // 7 Days
    }),
    resave: false,
    saveUninitialized: false
}));
app.use('/admin', adminRouter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// handlebars

app.set('view engine', 'ejs')
// passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(errorMiddleware);

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

app.get('/', (req, res) => {
    let email = null
    if (req.user != null) {
        email = req.user.email
    }
    res.render('pages/index.ejs', {
        email: email
    })
})
app.use('/api', router);
app.use('/api/projects', projectRouter); // TODO: edit url (/api)

start()