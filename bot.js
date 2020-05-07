const Discord = require('discord.js');
const client = new Discord.Client();
const figlet = require('figlet');

//process.argv.forEach((t) => console.log(t));

token = process.argv[2];
//console.log('Using token: ' + token);

client.on('ready', () => {
        figlet('BOT IS READY', (err, data) => {
                if (err) {
                        console.log('figlet broke?');
                        return;
                }
                console.log(data);
        });
});

client.on('message', (msg) => {
        if(msg.content.startsWith('fig')) {
                text = msg.substring(3);
                figlet(text, (err, data) => {
                        if(err) {
                                console.log("figlet broke?");
                        }
                        msg.channel.send(data)
                });
        }
});

client.login(token);
