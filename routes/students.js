var express = require('express');
var router = express.Router();
let bodyParser = require('body-parser')
let multer = require('multer')
let config = require('../config')
let cors = require('./cors')
let authenticate = require('../authenticate')
let userData = require('../modules/handle')
let fs = require('fs')
let path = require('path')

router.use(bodyParser.json())
let {log} = console // for test

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
      let reg = new RegExp(`^.*(?=\.(${config.imageExtend.join('|')})$)`)
      let res = file.originalname.match(reg)
      let [name, extend] = res
      // [name, extend, index: n, input: 'string', group: undefined]
      // 原始名称 + 时间戳 + 5位随机数
      cb(null, `${name}${Date.now()}${Math.floor(Math.random() * 100000)}.${extend}`)
      // cb(null, `${file.originalname}-${Date.now()}`)
    }
})
let imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('You can upload only image files!'), false)
  }
  cb(null, true)
}
let upload = multer({
    storage,
    fileFilter: imageFileFilter
})

/* GET users listing. */
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
.post(
    // 解析跨域
    cors.corsWithOptions, 
    // 验证用户权限
    // authenticate.verifyUser,
    // authenticate.verifyAdmin,
    // 保存图片
    // upload.fields([
    //   {name: 'levelCert', maxCount: 1},
    // ]),
    // 保存图片路由到数据库
    (req, res, next) => {
      // res.send('post 保存成功');
      res.status(200).json({
        data: '',
        message: 'post',
        code: 0
      })
      // res.status(401).json({
      //   data: '',
      //   message: 'post 保存成功',
      //   code: 0
      // })
    }
)
.put(cors.corsWithOptions, (req, res, next) => {
    res.send('put');
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.send('delete');
})

// 处理级位证书
router.route('/levelCert')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res, next) => {
  let {idCardOrCertNumber} = req.query
  if (idCardOrCertNumber) {
    if (idCardOrCertNumber.length === 18) {
      userData.queryStudentByIdCard(idCardOrCertNumber).then(result => {
        res.status(200).json({
          data: result[0].levelCertUrl,
          message: '请求成功',
          code: 0
        })
      }).catch(err => {
        res.status(500).json({
          data: err,
          message: '查询失败',
          code: 1
        })
      })
    } else {
      // userData.queryStudentByName(idCardOrCertNumber).then(result => {
      //   res.status(200).json({
      //     data: result,
      //     message: '请求成功',
      //     code: 0
      //   })
      // })
      userData.queryStudentByCertNumber(idCardOrCertNumber).then(result => {
        res.status(200).json({
          data: result[0].levelCertUrl,
          message: '请求成功',
          code: 0
        })
      }).catch(err => {
        res.status(500).json({
          data: err,
          message: '查询失败',
          code: 1
        })
      })
    }
  } else {
    res.status(200).json({
      data: '',
      message: '请输入姓名或身份证号',
      code: 1
    })
  }
})
.post(
    // 解析跨域
    cors.corsWithOptions, 
    // 验证用户权限
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    // 保存图片
    // let temp = 
    upload.fields([
      {name: 'levelCert', maxCount: 1},
    ]),
    // 保存图片路由到数据库
    (req, res, next) => {
      // req.body.username
      // req.files: {levelCert: [
      //   {
      //     fieldname: '',
      //     originalname: 'first.jpeg',
      //     encoding: '7bit',
      //     mimetype: 'image/jpeg',
      //     destination: 'public/images',
      //     filename: 'first164653587935731751.jpeg',
      //     path: 'public/images/first
      //   }
      // ]}
      // console.log(req.files)

      // certNumber idCard levelCert
      let certNumber = req.body.certNumber
      let idCard = req.body.idCard
      // let levelCertUrl = `${req.files.levelCert[0].destination}/${req.files.levelCert[0].filename}`
      let levelCertUrl = `images/${req.files.levelCert[0].filename}`
      log(levelCertUrl)
      log(req.files.levelCert[0].filename)
      // 是否已经存在该学生
      if (!certNumber || !idCard || !levelCertUrl) {
        res.status(200).json({
          data: '',
          message: '参数错误',
          code: 1
        })
      } else {
        userData.queryStudentByIdCard(idCard).then(user => {
          // user: []
          // log('user', user, user[0].levelCertUrl)
          if (user.length) { // 更新该学生的数据
            user = user[0]
            // 删除原来的级位证书
            let levelCertPath = path.join(__dirname, '../', user.levelCertUrl)
            fs.stat(levelCertPath, (err, stat) => {
              if (!err) {
                // 若无错误，则表示存在。然后执行删除
                fs.unlink(levelCertPath, () => {})
              // } else {
              //   log('err', err)
              }
              // 更新该学生的数据
              userData.updateStudentLevelCertUrl(levelCertUrl, user.id).then(result => {
                res.status(200).json({
                  data: result,
                  message: '更新成功',
                  code: 0
                })
              })
            })
          } else { // 保存该学生的数据
            return userData.insertStudents(idCard, levelCertUrl, certNumber).then(_ => {
              res.status(200).json({
                data: '',
                message: '保存成功',
                code: 0
              })
            })
          }
        }).catch(err => {
          res.status(200).json({
            data: err,
            message: '保存失败',
            code: 1
          })
        })
      }
    }
)
.put(cors.corsWithOptions, (req, res, next) => {
    res.send('put');
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.send('delete');
})

module.exports = router;
