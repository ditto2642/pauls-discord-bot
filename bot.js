const Discord = require('discord.js');
const client = new Discord.Client();
const figlet = require('figlet');
const fs = require('fs');

//process.argv.forEach((t) => console.log(t));

token = process.argv[2];
//console.log('Using token: ' + token);

client.on('ready', () => {
        console.log("BOT IS READY");
});

serverText = fs. readFileSync('servers.json');
var servers = JSON.parse(serverText);

function getChannelFromID(server, id) {
        return server.channels.resolve(id);
}

client.on('message', (msg) => {
        if (msg.content.startsWith('fig')) {
                text = msg.content.substring(3);
                figlet(text, (err, data) => {
                        if (err) {
                                console.log("figlet broke?");
                        }
                        msg.channel.send("```" + data + "```")
                });
        }

        if (msg.content.startsWith('set delete')) {
                var channel = msg.content.substring(11);
                if (!servers[msg.guild.id]) {
                        servers[msg.guild.id] = {}
                }
                servers[msg.guild.id]["deletes"] = channel;

                let newServer = JSON.stringify(servers);

                fs.writeFile('servers.json', newServer, (err) => {
                        if (err) throw err;
                        console.log("delete prefs updated for " + msg.guild.name);
                });

                msg.channel.send("Delete channel preference set.")
        }
});

client.on('messageDelete', (msg) => {
        if (servers[msg.guild.id]) {
                if(servers[msg.guild.id]["deletes"]) {
                        chan = getChannelFromID(msg.guild, servers[msg.guild.id]["deletes"]);

                        let delEmbed = new Discord.MessageEmbed()
                                .setColor('#992020')
                                .setTitle("Deleted Message from " + msg.author.tag)
                                .addFields(
                                        {name: "Message", value: msg.content},
                                        {name: "Channel", value: msg.channel.name},
                                        {name: "Timestamp", value: msg.createdAt}
                                );
                        try {
                                chan.send(delEmbed);
                        } catch (e) {
                                console.log("error sending deleted message log");
                        }

                        console.log("sent deleted message log to " + msg.guild.name);

                }
        }
});

client.login(token);
