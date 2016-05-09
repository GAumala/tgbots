
const async = require('async');
const client = require('request');

const telegram = require("./index.js")

const bots = []
const GET_UPDATES = "getUpdates";

var botIndex = 0

function processInlineQuery(inlineQuery, myBot){
    console.log("inline query: " + inlineQuery.query);
}

function isACommandMessage(text){
    return text.charAt(0) == '/';
}

function extractCommand(string){
    var index = string.indexOf('@')
    string = string.toLowerCase()    
    if( index == -1)
        return string
    else 
        return string.substring(0,index)
}
        
/*
 * This message object is guaranteed to hace a text attribute
 */ 
function processMessageText(message, myBot){
    //console.log("message text: " + text);
    if(isACommandMessage(message.text)){
        var spaceIndex = message.text.indexOf(' ');
        var cmd;
        if(spaceIndex != -1) {
            cmd = message.text.substring(1, spaceIndex);
            cmd = extractCommand(cmd)
            let str = message.text.substr(spaceIndex + 1);
            myBot.processTextCommand(cmd, str, message);
        } else {
            cmd = message.text.substr(1)
            cmd = extractCommand(cmd)
            myBot.processTextCommand(cmd, "", message);
        }
   } else
       myBot.processTextMessage(message)
}

function processMessage(message, myBot){
    //console.log("message: " + message);
    if(message.text)
	processMessageText(message, myBot);
}

function processUpdate(update, myBot) {
    
    var newOffset = update.update_id + 1;
    if(newOffset > myBot.updateOffset){
        myBot.updateOffset = newOffset
        if(update.inline_query)
            processInlineQuery(update.inline_query, myBot);
        if(update.message)
            processMessage(update.message, myBot);
    }
}

function getUpdates(){
    //console.log("offset: " + updateOffset);
    const selectedBot = bots[botIndex%bots.length]
    client({
        url: telegram.getBaseUrl(selectedBot.getToken()) + GET_UPDATES + 
            "?offset=" + selectedBot.updateOffset,
        json: true
    }, function( error, response, data) {
        if(!error && response.statusCode == 200) {
            console.log(response.body);
            if(response.body.ok){
                let messages = response.body.result;
                for(let i = 0; i < messages.length; i++){
                    processUpdate(messages[i], selectedBot);
                }
            }
        } else {
            console.log(error);
        }
    });
    botIndex++;
}

module.exports = {
    

    addBot : function (bot){
        bots.push(bot)
    },

    start : function(){
        async.whilst(
            function () { return true; },
            function (callback) {
                getUpdates()
                setTimeout(function () {
                    callback(null)
                }, 2000);
            },
            function (err, n) {
            })
    }

};
