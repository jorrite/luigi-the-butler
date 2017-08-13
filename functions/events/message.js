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

  if(sendMessage){
    const params = qs.stringify(message);
    const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
    sendMessage.then(postResult);
  }
};
module.exports = { respondTo };
