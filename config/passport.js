var LocalStartegy = require('passport-local').Strategy;
var User =require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStartegy({
        usernameField: 'name',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, name, password, done) {
        process.nextTick(function(){
            User.findOne({'local.name': name}, function(err, user){
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'Такой пользователь уже сущестует'));
                    } else {
                        var newUser = new User();
                        newUser.local.name = name;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
        });
    }));

    passport.use('local-login', new LocalStartegy({
        usernameField: 'name',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, name,password,done) {
        User.findOne({'local.name': name}, function(err, user){
            if(err)
                return done(err);
            if(!user)
                return done(null,false,req.flash('loginMessage', 'Пользователь не найден'));
            if(!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Неправильный пароль'));
            return done(null, user);
        });
    }));
};