# tgbots

Simple javascript framework for telegram bots


## Longpolling API

This library supports longpolling for receiving updates. Each time an update is
received, the library will call an appropiate function of your bot. To start the
long polling, first add your bot, and then call the `start()` method like this:

```javascript
const longPoll = require('tgbots/longpoll');
const myBot = require('./testBot.js');

longPoll.addBot(myBot)
longPoll.start(1000)
```

The `start()` method receives the interval duration as an optional parameter.
The default value is 2000 ms.
Your bot should be a javascript object that responds to the following methods:

#### Process Text Command

```
bot.processTextCommand(cmd, str, message)
```

Called when your bot received a command message. `cmd` is the command string
without the '/' prefix. `str` is the rest of the message and `message` is the
complete message object received from Telegram.

##### Example

If an user sends: "/start hello bot", the function will be called with the
following parameters:

| argument  | value   |
|---|---|
| `cmd`  | "start"  |
| `str`  | "hello bot"  |
| `message`  | [Message Object](https://core.telegram.org/bots/api#message)  |

#### Process Text Message

```
bot.processTextMessage(message)
```

Called when your bot received a message without a command. The function will be
called with the raw string as the only parameter.

##### Example

If an user sends: "Hello bot, how you doing", the function will be called with the
following parameters:

| argument  | value   |
|---|---|
| `message`  | "Hello bot, how you doing"  |

#### Get Token

```
bot.getToken()
```
To request updates from the telegram API, it is necessary to have the Token
received from The Botfather. It must be exposed through this method, all you
have to do is return the token string. The function is called with no
parameters.

### Update Offset

```
bot.updateOffset
```

The telegram API uses an offset number to keep track of updates. This library
will store that number in an `updateOffset` attribute inside your bot object.
The value is updated everytime an update is received. Try to not mess with that
attribute.

Here is an example of a module that exports a bot object implementing all of
these methods:

```javascript
module.exports = {
   processTextCommand: function (cmd, text, message) {
     console.log(`User sent command: ${cmd} with text: ${text}`);
   },

   processTextMessage: function (message) {
     console.log(`User sent message: ${message}`);
   },

   getToken: function () {
     return process.env.SECRET_TOKEN;
   },

   updateOffset: 0,
};

```

## Telegram API

Now that you have your bot and are able to listen to updates, it's time to talk
back. This module exposes various methods that you can use to send messages to a
Telegram chat using the HTTP API. All methods execute non-blocking networking.
Here is a list of the available methods:

#### Send Message

```
tgbots.sendMessage(chat_id, text, token);
```

Sends a text message to a telegram chat.

| argument  | value   |
|---|---|
| `chat_id`  | (Required) A string with id of the chat that will receive the message |
| `text`  | (Required) A string with the text to send to the chat  |
| `token`  | (Optional) Your bot's token. If no token is specified, the default token is used.|

#### Send Markdown

```
tgbots.sendMarkdown(chat_id, text, token);
```

Sends a text message with markdown to a telegram chat.

| argument  | value   |
|---|---|
| `chat_id`  | (Required) A string with id of the chat that will receive the message |
| `text`  | (Required) A string with the markdown text to send to the chat  |
| `token`  | (Optional) Your bot's token. If no token is specified, the default token is used.|

#### Send Location

```
tgbots.sendLocation(chat_id, lat, lon, token);
```

Sends a message with a geographical location to a telegram chat.

| argument  | value   |
|---|---|
| `chat_id`  | (Required) A string with id of the chat that will receive the message |
| `lat`  | (Required) A number with the latitude of the location |
| `lon`  | (Required) A number with the longuitud of the location |
| `token`  | (Optional) Your bot's token. If no token is specified, the default token is used.|

#### Send Voice

```
tgbots.sendVoice(chat_id, filepath, token);
```

Sends a message with a voice note to a telegram chat. Please note that the
Telegram API only supports the .ogg format encoded with OPUS. File size limit
currently is 50 MB.

| argument  | value   |
|---|---|
| `chat_id`  | (Required) A string with id of the chat that will receive the message |
| `filepath`  | (Required) A string with the path to the voice note file to send |
| `token`  | (Optional) Your bot's token. If no token is specified, the default token is used.|

#### Send Photo

```
tgbots.sendPhoto(chat_id, filepath, token);
```

Sends a message with a photo to a telegram chat.

| argument  | value   |
|---|---|
| `chat_id`  | (Required) A string with id of the chat that will receive the message |
| `filepath`  | (Required) A string with the path to the photo file to send |
| `token`  | (Optional) Your bot's token. If no token is specified, the default token is used.|


#### Set Default Token

```
tgbots.setDefaultToken(token)
```

As you can see all methods take a token as last argument. This is useful if you
have various bots sending messages. If you only have one bot, you may want to
set a default token, so that you can omit the token in your function calls.
Every method will use the default token instead.
