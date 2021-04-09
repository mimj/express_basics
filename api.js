import express from 'express'
import {roomsOriginal} from './data/rooms.js'
import {messages} from './data/messages.js'
import _ from 'lodash'
import {v4 as uuidv4} from 'uuid'
import {users} from "./data/users.js";


export const router = express.Router()

router.get('/rooms', function (req, res) {
    res.json(roomsOriginal)
})

router.route('/rooms/:roomId/messages')
    .get(function (req, res) {
        let roomId = req.params.roomId
        let roomMessages = messages.filter(m => m.roomId === roomId)
            .map(m => {
                let user = _.find(users, u => u.id === m.userId);
                return {text: `${user.name}: ${m.text}`}
            })

        let room = _.find(roomsOriginal, r => r.id === roomId)

        if (!room) {
            res.sendStatus(404);
            return;
        }

        res.json({
            room,
            messages: roomMessages
        })
    })
    .post(function (req, res) {
        let roomId = req.params.roomId
        let message = {
            roomId: roomId,
            text: req.body.text,
            userId: req.user.id,
            id: uuidv4()
        }

        messages.push(message)

        res.sendStatus(200)


    })
    .delete(function (req, res) {
        let roomId = req.params.roomId
        let newMessages = messages.filter(m => m.roomId !== roomId)

        res.json(newMessages)

    })


