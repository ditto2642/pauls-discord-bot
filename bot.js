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

serverText = fs.readFileSync('servers.json');
var servers = JSON.parse(serverText);

executorsText = fs.readFileSync('executors.json');
const executors = JSON.parse(executorsText).list;

function getChannelFromID(server, id) {
        return server.channels.resolve(id);
}

client.on('message', (msg) => {

        const re = /\?(?<command>\w*)(?<args> (\w*)*)?( ```(?<code>.*)```)?/gm;
        input = re.exec(msg.content);


        if(input) {

                command = input.groups.command;
                args = input.groups.args.trim(" ");
                code = input.groups.code;

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
                                if(code) {
                                        msg.channel.send(exec(code.trim(/(javascript)|(js)/gm)));
                                } else {
                                        msg.channel.send("You have to send some code using ```[code]```");
                                }
                        } else {
                                msg.channel.send("You are not an approved executor");
                        }
                }

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

client.login(token);
