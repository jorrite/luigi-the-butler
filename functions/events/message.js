const functions = require('firebase-functions');  
const qs = require('querystring');
const axios = require('axios');
const db = require('../firebase-database').db;

const postResult = result => console.log(result.data);

const message = {
  token: functions.config().slack.tokens.app,
  as_user: true,
  link_names: true
};

const hello = [
'Ciao', 
'Salve', 
'Hallo'
];

const dresscodeKeywords = ['dresscode', 'kleding'];
const dresscodeMessage = "De dresscode voor de bruiloft is 'summer chic' oftewel zomers chique in pastel-kleuren. Voor inspiratie: <"+functions.config().links.men_dresscode+"|dresscode voor mannen> en <"+functions.config().links.women_dresscode+"|dresscode voor vrouwen>. De hoofdkleur van de bruiloft is pastelblauw, net als het thema op de door u ontvangen uitnodiging."

const programKeywords = ['huwelijksweekend'];
const programMessage = "Maar natuurlijk!\n\n<@channel>, waarde gasten, het is mij een genoegen u het programma van het huwelijksweekend te presenteren. U kunt deze bekijken door <"+functions.config().links.program+"|hier op te klikken>. De festiviteiten beginnen op zaterdag 19 mei, tot dan!";
const respondTo = (event) => {
  
  message.channel = event.channel;
  message.text = hello[Math.floor(Math.random() * hello.length)] + " <@" + event.user + ">.";

  let sendMessage = false;
  if (dresscodeKeywords.some(function(v) { return event.text.replace(/ /g,'').toLowerCase().indexOf(v) >= 0; })) {
    message.attachments = JSON.stringify([
    {
      text: dresscodeMessage,
      color: '#8ABFE6',
      mrkdwn_in: ["text"]
    }]);
    sendMessage = true;
  }

  if (programKeywords.some(function(v) { return event.text.replace(/ /g,'').toLowerCase().indexOf(v) >= 0; })) {
    if(event.user == functions.config().people.ids.admin_1){
      message.text += programMessage;
    }
  }

  if(sendMessage){
    const params = qs.stringify(message);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  }
};
module.exports = { respondTo };
