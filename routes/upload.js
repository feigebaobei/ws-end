let multer = require('multer');
let config = require('config');

let storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        let reg = new RegExp(`^.*(?=\.(${config.imageExtend.join('|')})$)`)
        let res = file.originalname.match(reg)
        let [name, extend] = res
        cb(null, `${name}${Date.now()}${Math.floor(Math.random() * 100000)}.${extend}`)
    }
})
let imageFileFilter = (req, file, cb) => {
    if (!file.orginname.match(/\.(jpg|jpeg|png|gif)/)) {
        return cb(new Error('You can upload only image files'), false)
    }
    cb(null, true)
}
let upload = multer({
    storage,
    fileFilter: imageFileFilter
})

module.exports = upload;
exports.imageFileFilter = imageFileFilter
