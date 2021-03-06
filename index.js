const client = require('request');
const fs = require('fs');
const utf8 = require('utf8');

const TELEGRAM_BASE_URL = "https://api.telegram.org/bot";

const SEND_MESSAGE = "sendMessage";
const SEND_VOICE = "sendVoice";
const SEND_PHOTO = "sendPhoto";
const SEND_LOCATION = "sendLocation";

let defaultToken = ""


function selectToken(token) {
    if(token) return token
    return defaultToken
}

/* type can be either SEND_PHOTO or SEND_VOICE */
function createFormData(type, chat_id, filepath){
    switch(type){
        case SEND_PHOTO:
            return {
                chat_id : chat_id,
                photo : fs.createReadStream(filepath)
            }
        case SEND_VOICE:
            return {
                chat_id : chat_id,
                voice : fs.createReadStream(filepath)
            }
    }
}


/* type can be either SEND_PHOTO or SEND_VOICE */
function sendMediaFile(type, chat_id, filepath, token){
    const myToken = selectToken(token)
    const formData = createFormData(type, chat_id, filepath)
    client.post({
      url: module.exports.getBaseUrl(myToken) + type,
      json : true,
      formData: formData },
      function (error, response, body){
        if(error)
            console.error(error)
      });
}

module.exports.sendMessage = function (chat_id, text, token){
    text = utf8.encode(text)
    var myToken = selectToken(token)

    var args ="?chat_id=" + chat_id + "&text=" + text
    client(module.exports.getBaseUrl(myToken) + SEND_MESSAGE + args,
        function( error, response, data) {
            if(error)
                console.error(error)
    });
}

module.exports.sendMarkdown = function(chat_id, text, token){
    var myToken = selectToken(token)
    var args ="?chat_id=" + chat_id + "&text=" + text +
         "&parse_mode=Markdown";
    client(module.exports.getBaseUrl(myToken) + SEND_MESSAGE + args,
      function( error, response, data) {
        if(error)
            console.error(error)
    });
}

module.exports.sendLocation = function(chat_id, lat, lon, token){
    var myToken = selectToken(token)
    var args ="?chat_id=" + chat_id + "&latitude=" + lat +
         "&longitude=" + lon;
    client(module.exports.getBaseUrl(myToken) + SEND_LOCATION + args,
      function( error, response, data) {
        if(error)
            console.error(error)
    });

}

module.exports.sendVoice = function (chat_id, filepath, token){
    sendMediaFile(SEND_VOICE, chat_id, filepath, token)
}

module.exports.sendPhoto = function (chat_id, filepath, token){
    sendMediaFile(SEND_PHOTO, chat_id, filepath, token)
}

module.exports.getBaseUrl = function (token){
return TELEGRAM_BASE_URL + token + '/'
}

module.exports.setDefaultToken = function (token){
    defaultToken = token
}
