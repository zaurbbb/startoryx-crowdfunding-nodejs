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
const router = require('./router/main-router')
const router2 = require('./router/user-router2')
const adminRouter = require('./router/admin-router')
const projectRouter = require('./router/project-router')

dotenv.config();

require('./controllers/passport')(passport)
require('./cron/days-update')
const viewController = require("./controllers/view-controller");

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.static('public'))
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

app.set('view engine', 'ejs')
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

app.get('/', (req, res) => {
    let email, nickname = null
    if (req.user != null) {
        email = req.user.email
        nickname = req.user.nickname
    }
    res.render('pages/index.ejs', {
        email: email,
        nickname: nickname
    })
})
app.use(router);
app.use('/api', router2);
app.use('/api/projects', projectRouter); // TODO: edit url (/api)

app.get('*', viewController.error_page)

start()