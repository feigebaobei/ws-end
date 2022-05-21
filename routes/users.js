var express = require('express');
var router = express.Router();
let bodyParser = require('body-parser');
// let multer = require('multer');
// let config = require('config');
let cors = require('./cors');
let authenticate = require('../authenticate')
let userData = require('../modules/handle')
// let upload = require('./upload')
let sha256 = require('sha256')
var passport = require('passport')


router.use(bodyParser.json())

// for test start
let users = [
  {
    id: 1,
    name: 'jon',
    password: '1234',
  },
  {
    id: 2,
    name: 'test',
    password: 'test',
  }
]
let {log} = console
// for test end

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.route('/')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res, next) => {
  res.status(200).json({
    data: '',
    message: 'get',
    code: 0
  })
})
.post(cors.corsWithOptions,
  // upload.fields([
  //   {name: 'levelCert', maxCount: 1}
  // ]),
  (req, res, next) => {
  res.status(200).json({
    data: '',
    message: 'post',
    code: 0
  })
})
.put(cors.corsWithOptions, (req, res, next) => {
  res.status(200).json({
    data: '',
    message: 'put',
    code: 0
  })
})
.delete(cors.corsWithOptions, (req, res, next) => {
  res.status(200).json({
    data: '',
    message: 'delete',
    code: 0
  })
})

// 登录
router.route('/login')
.options(cors.corsWithOptions, (req, res) => {
  // console.log(req.origin)
  res.sendStatus(200)
})
.post(
  cors.corsWithOptions,
  passport.authenticate('local', {session: false}),
  (req, res, next) => {
    // req.user {}
    // log(req.user)
    // let token = authenticate.getToken({_id: req.user._id})
    let userDb = req.user
    let {username, password} = req.body
    if (sha256(password) === userDb.passwordHash) {
      let token = authenticate.getToken({_id: req.user.id})
      res.status(200).json({
        data: {
          token
        },
        message: '登录成功',
        code: 0
      })
    } else {
      res.status(200).json({
        data: '',
        message: '账号或密码错误',
        code: 1
      })
    }
    // res.status(200).json({
    //       data: {
    //         token
    //       },
    //       message: '登录成功',
    //       code: 0
    //     })
})

// 登出
router.post('/logout', (req, res, next) => {
  // res.status(200).json({result: true, message: '登出功能在前端做', data: {}})
  res.status(200).json({code: 0, message: '登出功能在前端做', data: {}})
  // if (req.cookies.token) {
  //   res.cookie('token', null, {httpOnly: true, expires: new Date()})
  //   res.setHeader('Content-Type', 'application/json')
  //   res.status(200).json({result: true, message: 'logout success.'})
  // } else {
  //   res.status(403).json({result: false, message: ''})
  // }
})

router.route('/signup')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
// .get(cors.corsWithOptions,
//   // 验证是否登录
//   authenticate.verifyUser,
//   (req, res, next) => {
//   res.status(200).json({
//     data: '',
//     message: 'get',
//     code: 0
//   })
// })
.post(cors.corsWithOptions,
  (req, res, next) => {
    let {username, password} = req.body
    // let role = 100 // 
    if (username.length < 4 || username.length > 16) {
      res.status(200).json({
        data: '',
        message: 'username的长度要求是 [4, 16]',
        code: 1
      })
    }
    if (password.length < 6 || password.length > 16) {
      res.status(200).json({
        data: '',
        message: 'password的长度要求是 [6, 16]',
        code: 2
      })
    }
    let passwordHash = sha256(password)
    userData.insertUsers(username, passwordHash).then(result => {
    // userData.insertTestUser(username, passwordHash, role, name, idCard).then(result => {
      res.status(200).json({
        data: result,
        message: '注册成功',
        code: 0
      })
    }).catch(err => {
      res.status(200).json({
        data: err,
        message: '注册失败',
        code: 1
      })
    })
})
// .put(cors.corsWithOptions, (req, res, next) => {
//   res.status(200).json({
//     data: '',
//     message: 'put',
//     code: 0
//   })
// })
// .delete(cors.corsWithOptions, (req, res, next) => {
//   res.status(200).json({
//     data: '',
//     message: 'delete',
//     code: 0
//   })
// })

// for test
router.route('/secret')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions,
  // 验证是否登录
  authenticate.verifyUser,
  (req, res, next) => {
    // userData.updateAdmin().then(result => {
    //   res.status(200).json({
    //     data: '',
    //     message: 'get',
    //     code: 0
    //   })
    // }).catch(err => {
    //   res.status(200).json({
    //     data: err,
    //     message: 'get',
    //     code: 1
    //   })
    // })
})
.post(cors.corsWithOptions,
  // upload.fields([
  //   {name: 'levelCert', maxCount: 1}
  // ]),
  (req, res, next) => {
  res.status(200).json({
    data: '',
    message: 'post',
    code: 0
  })
})
.put(cors.corsWithOptions, (req, res, next) => {
  res.status(200).json({
    data: '',
    message: 'put',
    code: 0
  })
})
.delete(cors.corsWithOptions, (req, res, next) => {
  res.status(200).json({
    data: '',
    message: 'delete',
    code: 0
  })
})


module.exports = router;
