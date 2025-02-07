const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const Crypto = require('crypto');
const fs = require('fs');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "." + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "." + uniqueSuffix + path.extname(file.originalname))

    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    }
    else {
        cb(
            new Error("Unsupported Format")
        , false)
        
    }
}


const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 2000000}
})

const productImgResize = asyncHandler(async (req, res, next) => {
    try {
         const { id } = req.params;
        const findProduct = await Product.findOne({ _id: id }); 
        console.log(req.files);
    if (!req.files) return next();
    let duplicates = [];
    await Promise.all(
        req.files.map(async (file) => {
            const isDuplicate = await checkForDuplicates(file.path, findProduct);
            const outputPath = path.join(__dirname, "../public/images/products", file.filename);
            console.log("good");
            if (!isDuplicate) {
                await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(outputPath)
                fs.unlinkSync(outputPath);
            }
            else {
                fs.unlinkSync(file.path);
                duplicates.push(file);
            }
            
        })
         
    )
        if (duplicates.length > 0) {
            req.files = req.files.filter((file) => !duplicates.includes(file))
            
        }
    next()
        
    }
    catch (error) {
        throw new Error(error);
    }
   
}
)

const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/blogs/${file.filename}`)
    }))
    next()
}





const hashFile = (path) => {
    return new Promise((resolve, reject) => {
        const hash = Crypto.createHash('md5');
        const stream = fs.createReadStream(path);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')))
        stream.on('error', () => reject() )
    })
}

const checkForDuplicates = async (pathFile, allFiles) => {
    // console.log(allFiles['images']);
    // console.log(allFiles['images']);
    const hashes = allFiles['images'].map((hashed) => hashed.localHash) || []; 
    // console.log(hashes);
    const hashedFile = await hashFile(pathFile);
    return hashes.includes(hashedFile);
}


module.exports = { uploadPhoto, productImgResize, blogImgResize,  hashFile };