const Discord = require('discord.js');
const client = new Discord.Client();
const figlet = require('figlet');
const fs = require('fs');
const irc = require('irc');


//process.argv.forEach((t) => console.log(t));

token = process.argv[2];
//console.log('Using token: ' + token);

client.on('ready', () => {
        console.log("BOT IS READY");
});

serverText = fs.readFileSync('servers.json');
var servers = JSON.parse(serverText);

const ircClient = new irc(servers.irc.hostname, servers.irc.nick, {
        channels: servers.irc.channels,
        secure: servers.irc.secure,
        port: servers.irc.port
});

executorsText = fs.readFileSync('executors.json');
const executors = JSON.parse(executorsText).list;

function getChannelFromID(server, id) {
        return server.channels.resolve(id);
}

client.on('message', (msg) => {

        const re = /\?(?<command>\w*)(?<args> (\w*)*)?( ?```(?<code>.*)```)?/gms;
        input = re.exec(msg.content);


        if(input) {

                command = input.groups.command;
                args = input.groups.args;
                code = input.groups.code;

                //console.dir(input);

                if (input.groups.command == "fig") {
                        if (input.groups.args == undefined) {
                                msg.channel.send("You need to give some text to figlet");
                                return;
                        }

                        figlet(args, (err, data) => {
                                if (err) {
                                        console.log("figlet broke?");
                                }
                                msg.channel.send("```" + data + "```")
                        });
                }

                if (command == "setdel") {
                        var channel = args;
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

                if (command == "execute") {
                        if (executors.includes(""+msg.author.id)) {
                                if(code != undefined) {
                                        try {
                                                msg.channel.send(eval(code.trim(/(javascript)|(js)/gm)));
                                        } catch (e) {
                                                msg.channel.send("Your code caused an error");
                                        }
                                } else {
                                        msg.channel.send("You have to send some code using ```[code]```");
                                }
                        } else {
                                msg.channel.send("You are not an approved executor");
                        }
                }

        }

        if (msg.channel.id == servers.irc.cid) {
                ircClient.say(servers.irc.channels[0], "<" + msg.member.displayName + ">: " + msg.content);
        }

});

client.on('messageDelete', (msg) => {
        if (servers[msg.guild.id]) {
                if (servers[msg.guild.id]["deletes"]) {
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

ircClient.addListener('message', (from, to, message) => {
        if (servers.irc.channels.includes(to)) {
                client.guild.resolve(servers.irc.sid).channels.resolve(servers.irc.cid).send(from + ": " + message);
        }
});

client.login(token);
