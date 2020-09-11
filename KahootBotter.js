const kahootJS = require("kahoot.js-updated");
const readline = require("readline");
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
 
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
var MainBot;
var otherbots = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function wait(n) {
  n = n || 1;
  return new Promise(resolve => {
    setTimeout(resolve, n * 1000);
  });
}
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
  console.log("Bots sent!");
}
commands();
function commands() {
  sendbots();
}

function sendbots() {
  rl.question("What is the pin? ", function (gamePin) {
    rl.question("What will be the name? ", function (nameOfBots) {
      rl.question("How many? ", function (amountOfBots) {
        sendBots(gamePin, nameOfBots, amountOfBots);
        MainBot.on("quizEnd", e => {
          console.log("The quiz has ended!");
          commands();
        });
        rl.close();
      });
    });
  });
}

async function answer(q, group) {
  var sendG = Math.floor(group/100);
  await wait(sendG+1);
  q.answer(Math.floor(Math.random() * 4));
}
