const mongodb = require('mongodb');

const Client = mongodb.MongoClient;

let _db;

const connection = (callback) => {
    Client.connect('mongodb+srv://Sarthak:FPD7qmu91LeHl5L0@cluster0-llyzd.mongodb.net/main?retryWrites=true&w=majority').then(client => {
        _db = client.db();
        if(_db){
            callback(_db);
        }
    }).catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if(_db){
        return _db;
    }
    else{
        throw 'No database found'
    }
}
exports.connection = connection;
exports.getDb = getDb;


