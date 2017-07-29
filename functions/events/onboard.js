const functions = require('firebase-functions');  
const qs = require('querystring');
const axios = require('axios');
const db = require('../firebase-database').db;

const postResult = result => console.log(result.data);

const hello = [
'Ciao,', 
'Salve,', 
'Che piacere vederti,', 
'Goededag,', 
'Hallo,'
];
const messages = [
'Wat geweldig om u hier welkom te mogen heten', 
'Het is mij een plezier om u hier welkom te mogen heten', 
'Het huwelijksstel is ontzettend dankbaar en verheugd om u hier te verwelkomen',
'Namens het huwelijksstel, heet ik u hier van harte welkom',
'Namens '+functions.config().people.names.groom+' &amp; '+functions.config().people.names.bride+' mag ik u hier van harte welkom heten',
'Fijn om u hier te mogen ontvangen, welkom namens '+functions.config().people.names.groom+' &amp; '+functions.config().people.names.bride,
'Het doet mij deugd u te mogen verwelkomen namens het bruidspaar',
'Dank dat u zich heeft aangemeld voor Slack, welkom namens het aanstaande echtpaar',
'Leuk u hier te ontmoeten, van harte welkom namens '+functions.config().people.names.groom+' &amp; '+functions.config().people.names.bride
];
const defaultInformation = "Typ `/welkomstbericht` voor alle belangrijke welkomst informatie en uitleg over onze Slack. Voor overige zaken kom ik op een later moment bij u terug."

const message = {
  token: functions.config().slack.tokens.app,
  as_user: true,
  link_names: true,
  attachments: JSON.stringify([
  {
    text: messages[Math.floor(Math.random() * messages.length)] + '. ' + defaultInformation,
    color: '#8ABFE6',
    mrkdwn_in: ["text"]
  }])
};

const getText = (name) => {
  return hello[Math.floor(Math.random() * hello.length)] + ' ' + name + '!';
}

const initialMessage = (user) => {
  const ref = db.ref(`users/${user.id}`);
  ref.once("value", function(snapshot) {
    let data = snapshot.val();
    if (!data || !data.onboarded) {
      message.channel = 'algemeen';
      message.text = getText(user.profile.first_name);
      ref.child('slack_profile').set(user.profile);
      ref.child('onboarded').set(true);
      const params = qs.stringify(message);
      const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
      sendMessage.then(postResult);
    } else {
      console.log('Already onboarded');
    }
  });
};
module.exports = { initialMessage };
