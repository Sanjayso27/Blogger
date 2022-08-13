class HttpError extends Error {
    constructor (message,errorCode) {
        super(message); //calls the constructor of the base class with message and also adds message properety to all instances
        this.code =errorCode;  
    }
}

module.exports = HttpError;