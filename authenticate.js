let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
  // User = require('./models/user')
let userData = require('./modules/handle')

let {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')
let jwt = require('jsonwebtoken')

let config = require('./config')

let {log} = console // for test

// passport.use(new LocalStrategy(User.authenticate()))
passport.use(new LocalStrategy(
  // {session: false},
// usernameField 设置 name 字段, 默认 username
// passwordField 设置 password 字段, 默认 password
// passReqToCallback 设置 request 是否回调函数的第一个参数, 默认 false (不是第一个参数)
// session 设置 是否支持 session 会话, 保持持久化登录状态, 默认 true
  (username, password, done) => {
  userData.queryByUsername(username).then(result => {
    if (result) {
      // log('LocalStrategy', result)
      return done(null, result)
    } else {
      return done(null, false)
    }
  })
}))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())
passport.serializeUser(function(user, done) {
  // log('serializeUser', user)
  done(null, user._id);
  // done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  // log('deserializeUser', user)
  userData.queryById(id).then(user => {
    done(err, user)
  })
});

// let fromCookieExtractor = (req) => {
//   let token = null
//   if (req && req.cookies) {
//     token = req.cookies['token']
//   }
//   return token
// }
var options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // jwtFromRequest: fromCookieExtractor,
  secretOrKey: config.secretKey
}

exports.getToken = (user) => jwt.sign(user, config.secretKey, {expiresIn: 18000}) // 时间默认单位是 ms
exports.jwtPassport = passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  // User.findOne({_id: jwt_payload._id}, (err, user) => {
  //   if (err) {
  //     return done(err, null)
  //   } else {
  //     if (user) {
  //       return done(null, user)
  //     } else {
  //       return done(null, false)
  //     }
  //   }
  // })
  // log('jwt_payload', jwt_payload)
  userData.queryById(jwt_payload._id).then(result => {
    if (result) {
      return done(null, result)
    } else {
      return done(null, false)
    }
  }).catch(err => {
    return done(err, null)
  })
  
}))
// 指定使用jwt方式验证用户是否登录。
exports.verifyUser = passport.authenticate('jwt', {
  session: false
  // failureRedirect: '/error/auth'
})
exports.verifyAdmin = (req, res, next) => {
  // log('verifyAdmin', req.user)
  if (req.user.role === 1000) {
    next()
  } else {
    res.status(403).send('not admin')
  }
}