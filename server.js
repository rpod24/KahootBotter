var express = require('express');
require('dotenv').config();
const e = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var port = 8001;
const kahootJS = require("kahoot.js-updated");
const readline = require("readline");
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const pass = process.env.USER_PASS;
 
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
var MainBot;
var otherbots = [];

function wait(n) {
    n = n || 1;
    return new Promise(resolve => {
      setTimeout(resolve, n * 1000);
    });
}

var clients = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    clients[socket.id] = socket;
    socket.on('message_to_server', function (data) {

        if (data.pass != pass) {
            socket.emit("message_to_client", { message: "Incorrect Password" });
        }
        else {
            sendBots(data.pin, data.name, data.bots);
            socket.emit("message_to_client", { message: "Bots Sent!" });
            MainBot.on("quizEnd", e => {
                socket.emit("message_to_client", { message: "The quiz has ended!" });
                socket.emit("endConnection", { message: "Good Day!" });
            });
        }

    });
    socket.on('Password_Check', function (data) {
        var isTrue = false;
        if (data.message == pass) {
            isTrue = true;
        }
        socket.emit("IsTrue", isTrue);
    });
});

server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
});

async function sendBots(pin, name, amount) {
    for (let i = 0; i < amount; i++) {
      const bot = new kahootJS;
      if(name==""){
        var tmpname = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
        bot.join(pin, tmpname);
      }
      else{
        bot.join(pin, name + i);
      }
      if(i==0){
        MainBot=bot;
      }
      else{
        otherbots.push(bot);
      }
      
      bot.on("questionStart", question => {
        answer(question, i);
      });
      await wait(0.2);
    }
  }

async function answer(q, group) {
  var sendG = Math.floor(group/100);
  await wait(sendG+1);
  q.answer(Math.floor(Math.random() * 4));
}
