import multer from 'multer';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const filePath = path.join(__dirname, '..', 'uploads')
            cb(null, filePath)
        },
        filename: function (req, file, cb) {
            const fileExtension = file.mimetype.split('/')[1];
            cb(null, Date.now() + '-' + file.originalname + '.' + fileExtension)
        }
    })
})


export { upload }