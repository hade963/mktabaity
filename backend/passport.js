const passport = require('passport');
const JWTSTRATIGE = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const db = require('./db');

const options = {
  jwtFromRequest:  ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET ,
}


passport.use(new JWTSTRATIGE(options, function(jwt_payload, done) { 
    const user = db.query('SELECT * FROM users WHERE  id = ?', [jwt_payload.id],function(e, r) {
      if(e) { 
        done(e, null, "" ,{message: "اسم المستخدم غير موجود"} );
      }
      if(r) { 
        done(null, r[0].id);
      }
      else { 
        done(false, null,{ message:"اسم المستخدم غير موجود"});
      }
    });
}));
