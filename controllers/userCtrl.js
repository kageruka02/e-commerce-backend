const User = require('../models/userModel');

const createUser = async (req, res) => {
    const { firstName, lastName, email, mobile, password } = req.body;
    if (!firstName || !lastName || !email || !mobile || !password) {
              return res.status(400).send("Missing required fields: tel, email, or address");
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
        const newUser =  await User.create({ firstName, lastName, email, mobile, password });
        res.json(newUser)

    }
    else { 
        res.json({
            msg: "User already exist",
            status: "failed"
        })
    }
}
module.exports = {createUser};