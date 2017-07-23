const qs = require('querystring');
const axios = require('axios');
const JsonDB = require('node-json-db');

const db = new JsonDB('users', true, false);

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
  'Namens '+process.env.GROOM+' &amp; '+process.env.BRIDE+' mag ik u hier van harte welkom heten',
  'Fijn om u hier te mogen ontvangen, welkom namens '+process.env.GROOM+' &amp; '+process.env.BRIDE,
  'Het doet mij deugd u te mogen verwelkomen namens het bruidspaar',
  'Dank dat u zich heeft aangemeld voor Slack, welkom namens het aanstaande echtpaar',
  'Leuk u hier te ontmoeten, van harte welkom namens '+process.env.GROOM+' &amp; '+process.env.BRIDE
];
const defaultInformation = "Typ `/welkomstbericht` voor alle belangrijke welkomst informatie en uitleg over onze Slack. Voor overige zaken kom ik op een later moment bij u terug."

const message = {
  token: process.env.SLACK_TOKEN,
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

const initialMessage = (userId) => {
  const getUserInfo = axios.post('https://slack.com/api/users.info', qs.stringify({token: process.env.SLACK_TOKEN, user: userId}));
  getUserInfo.then((result) => {
    let data = {};
    try { data = db.getData(`/${userId}`); } catch (error) {
      // console.error(error);
    }
    if (!data || !data.onboarded) {
      message.channel = 'algemeen';
      message.text = getText(result.data.user.profile.first_name);
      data.onboarded = true;
      db.push(`/${userId}`, data);
      const params = qs.stringify(message);
      const sendMessage = axios.post('https://slack.com/api/chat.postMessage', params);
      sendMessage.then(postResult);
    } else {
      console.log('Already onboarded');
    }
  });
};
module.exports = { initialMessage };
