import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const filePath = path.join(__dirname, '..', 'uploads')

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }

            cb(null, filePath)
        },
        filename: function (req, file, cb) {
            const fileExtension = file.mimetype.split('/')[1];
            cb(null, Date.now() + '-' + file.originalname + '.' + fileExtension)
        }
    })
})


export { upload }