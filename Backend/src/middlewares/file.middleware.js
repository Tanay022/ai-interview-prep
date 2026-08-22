const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024  //3 mb
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only PDF files are allowed for the resume"))
        }
        cb(null, true)
    }
})

module.exports = upload
