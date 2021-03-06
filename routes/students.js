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
    if (idCardOrCertNumber.length === 18) { // 按身份证号查
      userData.queryStudentByIdCard(idCardOrCertNumber).then(result => {
        console.log('result', result)
        let data = {
          approvalDate: result[0].approval_date,
          approvalEnterprises: result[0].approval_enterprises,
          certNumber: result[0].cert_number,
          gender: result[0].gender,
          // id: result[0].id,
          idCard: result[0].id_card,
          name: result[0].name,
          photoPath: result[0].photo_path,
          project: result[0].project,
          projectGrade: result[0].project_grade
        }
        res.status(200).json({
          // data: result[0].photo_path,
          // data: result[0],
          data,
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
    } else { // 按证书号查
      userData.queryStudentByCertNumber(idCardOrCertNumber).then(result => {
        console.log('result', result)
        // let data = {}
        // result[0]
        // approval_date: "2021-03-04T16:00:00.000Z"
        // approval_enterprises: "中国武术协会"
        // cert_number: 211213283
        // gender: 1
        // id: 27
        // id_card: "110101199003077774"
        // name: "张三"
        // photo_path: "images/close165313054185459621.jpeg"
        // project: "武术"
        // project_grade: "段前一
        let data = {
          approvalDate: result[0].approval_date,
          approvalEnterprises: result[0].approval_enterprises,
          certNumber: result[0].cert_number,
          gender: result[0].gender,
          // id: result[0].id,
          idCard: result[0].id_card,
          name: result[0].name,
          photoPath: result[0].photo_path,
          project: result[0].project,
          projectGrade: result[0].project_grade
        }
        res.status(200).json({
          // data: result[0].photo_path,
          // data: result[0],
          data,
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
      // {name: 'levelCert', maxCount: 1},
      {name: 'photo', maxCount: 1},
    ]),
    // 保存图片路由到数据库
    (req, res, next) => {
      // req.body = {
      //   name,
      //   gender,
      //   project_grade,
      //   project,
      //   id_card,
      //   approval_enterprises,
      //   approval_date,
      //   cert_number,
      // }
      // req.files: {levelCert: [
      //   {
      //     fieldname: '',
      //     originalname: 'first.jpeg',
      //     encoding: '7bit',
      //     mimetype: 'image/jpeg',
      //     destination: 'public/images',
      //     filename: 'first164653587935731751.jpeg',
      //     path: 'public/images/first
      //   },
      // photo: [{...}]
      // ]}
      let photo_path = `images/${req.files.photo[0].filename}`
      let {
        name, gender, project_grade, project, id_card, approval_enterprises, approval_date, cert_number
      } = req.body
      // console.log(name, gender, project_grade, project, id_card, approval_enterprises, approval_date, cert_number)
      // 检查参数
      if (
        !name ||
        // !gender ||
        [0, 1].includes(gender),
        !project_grade ||
        !project ||
        !id_card ||
        !approval_enterprises ||
        !approval_date ||
        !cert_number //, levelCertUr ||
        ) {
        res.status(200).json({
          data: '',
          message: '上传数据错误',
          code: 1
        })
      } else {
        // 是否已经存在该学生
        userData.queryStudentByIdCard(id_card).then(user => {
          // user: []
          // log('user', user, user[0].photo_path)
          if (user.length) { // 更新该学生的数据
            user = user[0]
            // 删除原来的级位证书
            let levelCertPath = path.join(__dirname, '../', user.photo_path)
            fs.stat(levelCertPath, (err, stat) => {
              if (!err) {
                // 若无错误，则表示存在。然后执行删除
                fs.unlink(levelCertPath, () => {})
              // } else {
              //   log('err', err)
              }
              // 更新该学生的数据
              userData.updateStudentLevelCertUrl(
                // 其实已经检查了非空。
                name !== undefined ? name : user.name,
                gender !== undefined ? gender : user.gender,
                project_grade !== undefined ? project_grade : user.project_grade,
                project !== undefined ? project : user.project,
                id_card !== undefined ? id_card : user.id_card,
                approval_enterprises !== undefined ? approval_enterprises : user.approval_enterprises,
                approval_date !== undefined ? approval_date : user.approval_date,
                cert_number !== undefined ? cert_number : user.cert_number,
                photo_path !== undefined ? photo_path : user.photo_path,
                user.id
                ).then(result => {
                res.status(200).json({
                  data: result,
                  message: '更新成功',
                  code: 0
                })
              })
            })
          } else { // 保存该学生的数据
            return userData.insertStudents(
              name, gender, project_grade, project, id_card, approval_enterprises, approval_date, cert_number, photo_path
            ).then(_ => {
              res.status(200).json({
                data: '',
                message: '保存成功',
                code: 0
              })
            })
          }
        }).catch(err => {
          // console.log('err', err)
          res.status(500).json({
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
