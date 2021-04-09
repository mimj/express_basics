import passport from 'passport'
import LocalStrategy from 'passport-local'
import _ from 'lodash'
import {users} from './data/users.js'


passport.use(new LocalStrategy((username, password, done) => {

    let user = _.find(users, u => u.name === username)

    if (!user || user.password !== password) {
        done(null, false); // null means nor error,false means not authenticated
        return;
    }

    done(null, user)

}));

passport.serializeUser((user, done) => {
    // here will serialize user to the session
    // so its available in the ext request
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})