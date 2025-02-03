const mongoose = require('mongoose');
const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        res.status(401)
        throw new Error("This id is not valid or not Found");
    }
        
}
module.exports = validateMongoDbId;