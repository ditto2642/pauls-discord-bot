

// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = 'MjkxMjQ0Njk0MzgwMzQ3Mzky.C7LbIg.RSgBdtQwj0guNuCMsVZrxlcdpqo';

//var imgurGallery = require('imgurGallery');
const imgurSearch = require('imgur-search');
//var imgurServiceErrors = require('imgurServiceErrors');
const Window = require('window');

const window = new Window();

const div = window.document.createElement('div');
// HTMLDivElement

div instanceof window.HTMLElement
// true
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

});
var $ = require("jquery")(window);
// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
bot.on('ready', () => {
  console.log('I am ready!');
});

// create an event listener for messages
bot.on('message', message => {
 messageHandle(message);
});

function messageHandle(message) {
var content = message.content.toLowerCase();


// if the message is "ping",
  if (content.startsWith('ping') || content.startsWith('nut')) {
    // send "pong" to the same channel.
    message.channel.sendMessage('pong');
  }


//IMG command, searches imgur
if (content.startsWith('>img')){
var request = content.substring(">img ".length);
//message.channel.sendMessage(content);
message.channel.sendMessage(request);
 queryURL = "https://api.imgur.com/3/gallery/search/?q=" + request;
$.ajax({
      url: queryURL,
      type: 'GET',
      dataType: 'json',
      headers: {
      Authorization: 'Client-ID ' + '9720b6c75210077',
      },
      success: function(data) {message.channel.sendMessage(data.data[Math.floor(Math.random() * 100)].link);},
      error: function() { console.log("There was an error."); },});

    }


if(content.startsWith('>help')){
     message.channel.sendMessage("```Commands: >img <search term> (searches image on imgur) -- ping (responds with pong) -- >neko/>catgirl (Sends a catgirl) -- >meme {meme type} (topText) [bottom text] (use { for meme type, ( for top text and [ for bottom text (known memes: buzz, aliens, tenguy, cb, ants, facepalm, ggg, noidea, icanhas))```")
   }

//neko/catgirl command
   if (content.startsWith('>neko') || content.startsWith('>catgirl')){


 //message.channel.sendMessage(content);

    queryURL = "https://api.imgur.com/3/album/j83vM/images";
//looks for -nsfw and changes album if it exists
    //if(content.includes('-nsfw')) {queryURL = "https://api.imgur.com/3/album/j83vM/images"}
   $.ajax({
         url: queryURL,
         type: 'GET',
         dataType: 'json',
         headers: {
         Authorization: 'Client-ID ' + '9720b6c75210077',
         },
         success: function(data) {message.channel.sendMessage(data.data[Math.floor(Math.random() * 100)].link);},
         error: function() { console.log("There was an error."); },});}
if(content.startsWith(">meme")){
content = content.substring(">meme ".length);
   var n = content.indexOf('}');
    meme = content.substring(0, n != -1 ? n : content.length).split("{").pop().replace(/\s+/g, '-');
     n = content.indexOf(')');
     topText = content.substring(0, n != -1 ? n : content.length).split("(").pop().replace(/\s+/g, '-');
      n = content.indexOf(']');
      bottomText = content.substring(0, n != -1 ? n : content.length).split("[").pop().replace(/\s+/g, '-');
message.channel.sendMessage(meme + topText + bottomText);
if(meme == null || topText == null || bottomText == null){
  message.channel.sendMessage("You either did not enter a field or mis-entered one field.");
}
else{
  message.channel.sendMessage("http://memegen.link/" + meme + "/" + topText + "/" + bottomText + ".jpg");
}


}


}


bot.login(token);
