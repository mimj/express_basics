import express from "express";
import passport from 'passport'
import {users} from "./data/users.js";

export const router = express.Router()


router.get('/login', function (req, res) {
    /**
     * this commented block logins in first user by default for each request */
    // if (req.app.get("env") === 'development') {
    //     let user = users[0];
    //     req.login(user, (err) => {
    //         if (err) next(err)
    //         return res.redirect('/')
    //     })
    //     return;
    // }
    res.render('login', {layout: false})
});

router.get('/logout', function (req, res) {
    // user object still is in req
    req.logout(); // passport adds this function
    // now user object is removed from req
    res.redirect('/login')
});

router.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    });

