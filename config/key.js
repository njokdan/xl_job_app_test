require('dotenv').config();

module.exports = {
    MongoURI: process.env.JOBAPPDBURL,
    NODE_ENV:'production' 
};
