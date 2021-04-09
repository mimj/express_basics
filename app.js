import express from 'express'
import exphbs from 'express-handlebars'
import bodyParser from 'body-parser'
import './passport-init.js'
import passport from 'passport'
import express_session from 'express-session'

const app = new express();

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs'); // by this we do not need to write the extension in render function.

// app.set("views",'/views') /* views folder is default */


app.use(express.static("public")) // to serve static files
app.use(express.static("node_modules/bootstrap/dist")) // to serve bootstrap files. address = localhost:3000/css/bootstrap.css for example.

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express_session({
    secret: 'a secret key', resave: false, saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


import {router as authRouter} from './auth.js'

app.use(authRouter);

// prevent access of not-authenticated users to routs below of this middleware
app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
        next()
        return;
    } else {
        res.redirect('/login')
    }
})

app.get('/', function (req, res) {
    res.render('home', {
        data: 'dataaaa',
        // layout: 'main2'
    })
});

import {router as adminRouter} from './admin.js'

app.use('/admin', adminRouter)

import {router as apiRouter} from './api.js'

app.use('/api', apiRouter)

app.listen(3000, function () {
    console.log('Running on Port 3000')
})