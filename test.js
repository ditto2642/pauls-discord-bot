// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = '';

//var imgurGallery = require('imgurGallery');
//const imgurSearch = require('imgur-search');
//var imgurServiceErrors = require('imgurServiceErrors');
/*const Window = require('window');

const window = new Window();

const div = window.document.createElement('div');
// HTMLDivElement

div instanceof window.HTMLElement
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

});
var $ = require("jquery")(window);
// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.*/
bot.on('ready', () => {
  console.log('I am ready!');
});
bot.on('message', message => {
 messageHandle(message);
});

function messageHandle(message) {
  if(message.author.id != 183098358154526720 && message.author.id != 221091577391480832 && message.author.id != 275679293575528450 && message.author.id != 298970897312776202 && message.author.id !=224435221343240192){
    message.delete();

  }
}
bot.login(token);
