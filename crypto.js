const crypto = require('crypto');
// console.log(crypto.getHashes());//creating hashes
// console.log(crypto.getCiphers());// for encryption

crypto.randomBytes(16, (err, buf) => {
    console.log(buf);  
})
console.log(Date.now())
console.log(new Date())