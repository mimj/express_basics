import {v4 as uuidv4} from "uuid";
import _ from "lodash";
import express from "express";

import {roomsOriginal} from './data/rooms.js'

let rooms = roomsOriginal;

export const router = express.Router()

// middleware to check if if user is admin
router.use((req, res, next) => {
    if (req.user.admin) {
        next()
        return;
    } else {
        res.redirect('/login')
    }
})


router.get('/rooms', function (req, res) {
    res.render('rooms', {rooms})
})


router.route('/rooms/add')
    .get(function (req, res) {
        res.render('add')
    })
    .post(function (req, res) {
        let room = {
            name: req.body.name,
            id: uuidv4()
        }
        rooms.push(room)

        res.redirect(req.baseUrl + '/rooms/')
    })


router.route('/rooms/edit/:id')
    .all(((req, res, next) => {
        /**
         * this is middleware
         * */
        let roomId = req.params.id
        let room = _.find(rooms, room => room.id === roomId)
        if (!room) {
            next(new Error("Oh no CUSTOM ERROR RISING"))
            return;
        }
        res.locals.room = room;
        next()
    }))
    .get(function (req, res) {
        // res.locals is available in the view
        // so adding that in object below is redundant and is just for being clear.
        res.render('edit', {room: res.locals.room})
    })
    .post(function (req, res) {

        res.locals.room.name = req.body.name;

        res.redirect(req.baseUrl + '/rooms')
    })

router.get('/rooms/delete/:id', function (req, res) {
    let roomId = req.params.id
    rooms = rooms.filter(room => room.id !== roomId)
    res.redirect(req.baseUrl + '/rooms')
})