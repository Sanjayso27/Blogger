const multer = require("multer");
const uuid = require("uuid").v1

// multer gives the mime type of the file in this format
const MIME_TYPE_MAP = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png",
}

// this is almost a middleware which we use in express middleware chain
// we can add configuration object to  it and use it
const fileUpload = multer({
    limits:  500000,
    storage: multer.diskStorage({
        destination:(req,file,cb)=>{
            // for deriving the path 
            // 2nd arg specifies the path for storing the images
            // path should be correct
            cb(null,"uploads/images")
        },
        filename:(req,file,cb)=>{
            const ext = MIME_TYPE_MAP[file.mimetype];
            // we cann also pass the error but here we are not passing aany error
            // generates random file name with extension 
            cb(null,uuid()+'.'+ext)
        },
    }),
    // we also need to validate the input file,we can't rely on the frontend because ot can be changed from developer console
    fileFilter: (req,file,cb)=>{
        // !! converts undefined to false and anything other to true
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error =isValid? null : new Error("Invalid mime type");
        // the second arg to the callback is to specify the file is right or not
        cb(error,isValid);
    },
});

module.exports=  fileUpload;