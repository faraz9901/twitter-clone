import multer from 'multer';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const filePath = path.join(__dirname, '..', 'uploads')
            cb(null, filePath)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})


export { upload }