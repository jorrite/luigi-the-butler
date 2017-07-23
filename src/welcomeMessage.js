const JsonDB = require('node-json-db');

const db = new JsonDB('users', true, false);

const message = {
  as_user: true,
  link_names: true,
  text: "Salve, nogmaals, ook namens het aanstaande echtpaar, een hartelijk welkom in onze Slack. Dit bericht is alleen zichtbaar voor u. Sta mij toe om het een en ander uit te leggen.",
  attachments: [
    {
      title: ':slack: Wat is Slack?',
      title_link: "https://get.slack.help",
      text: 'Slack is een communicatie-platform. Als dit de eerste keer is dat u Slack gebruikt kunt u de gebruikersdocumentatie bekijken op get.slack.help (Engels). Ook kunt u gewoon vragen stellen in dit algemene kanaal mocht u er niet uit komen, help elkaar!',
      color: '#8ABFE6',
      mrkdwn_in: ["text"]
    },
    {
      title: ':loudspeaker: Wat zijn kanalen?',
      title_link: "https://get.slack.help/hc/en-us/categories/200111606#channels-direct-messages",
      text: ' Kanalen zijn een belangrijk onderdeel van Slack. Kanalen kunt u zien als _gespreksonderwerpen_. Deze Slack ook opgedeeld in verschillende kanalen (zie ook de volgende onderwerpen). U bent vrij om deel te nemen aan elk kanaal of om zelf (al dan niet besloten) kanalen op te zetten. Als u dus een vraag heeft over bijvoorbeeld *accomodaties* kunt u deze stellen in het <#'+process.env.ACCOMODATION_CHANNEL_ID+'> kanaal.',
      color: '#e74c3c',
      mrkdwn_in: ["text", "footer"],
      footer: "Tip van Luigi: klik/druk op het blauwe kanaal woordjes om gelijk aan het kanaal deel te nemen!",
      footer_icon: "https://ca.slack-edge.com/T65QNL4CS-U6CA1NJ7P-c0bbe2ef8657-48"
    },
    {
      title: ':tophat: #algemeen',
      text: 'Het huidige kanaal, <#'+process.env.GENERAL_CHANNEL_ID+'>, hier zit standaard iedereen in en kan worden beschouwd als het algemene chat-kanaal.',
      color: '#3498db',
      mrkdwn_in: ["text"]
    },
    {
      title: ':airplane: #vliegticket',
      text: 'Vliegdata, prijzen, tips en waar moet u op vliegen. Stel uw vragen in het <#'+process.env.GENERAL_CHANNEL_ID+'> kanaal of deel informatie met elkaar.',
      color: '#f1c40f',
      mrkdwn_in: ["text"]
    },
    {
      title: ':hotel: #accomodatie',
      text: 'Op zoek naar een accomodatie in Taormina? Accomodatie gevonden, maar wellicht een leuk idee om samen te boeken? Alles kan worden besproken in het <#'+process.env.ACCOMODATION_CHANNEL_ID+'> kanaal.',
      color: '#DB0A5B',
      mrkdwn_in: ["text"]
    },
    {
      title: ':it: #sicilië',
      text: 'Voor alle conversatie over dit prachtige eiland. Plakt u een vakantie er aan vast? Wat is een Arancini? Alles wat te maken heeft met Sicilië kan worden besproken in het <#'+process.env.SICILY_CHANNEL_ID+'> kanaal.',
      color: '#9b59b6',
      mrkdwn_in: ["text"]
    },
    {
      title: ':dress: #gettingready',
      text: 'Say yes to the dress! Plaats in <#'+process.env.GETTING_READY_CHANNEL_ID+'> uw vragen over voorbereiding en kleding. Bonus: Alle instagramfoto\'s met de hashtag <https://www.instagram.com/explore/tags/'+process.env.INSTAGRAM_TAG+'/|#'+process.env.INSTAGRAM_TAG+'> worden automatisch in dit kanaal geplaatst!',
      color: '#1abc9c',
      mrkdwn_in: ["text"]
    },
    {
      title: ':dancers: #ceremoniemeester',
      text: '<@'+process.env.MASTERS_OF_CEREMONY_1+'> en <@'+process.env.MASTERS_OF_CEREMONY_2+'> zijn de ceremoniemeesters van het bruidspaar. Stel in <#'+process.env.MASTERS_OF_CEREMONY_CHANNEL_ID+'> al uw vragen aan de ceremoniemeesters. Het echtpaar zit zelf niet in dit kanaal, dus je kunt ook \'geheime zaken\' bespreken. Het kanaal is echter wel *open* voor alle gasten, dus mocht je zaak echt gevoelig liggen kan het altijd per privebericht naar <@'+process.env.MASTERS_OF_CEREMONY_1+'> of <@'+process.env.MASTERS_OF_CEREMONY_2+'>.',
      color: '#F1A9A0',
      mrkdwn_in: ["text"]
    }
  ]
};

const alreadyWelcomed = {
  "text": "U heeft het welkomstbericht al een keer gezien, maar mocht u het nogmaals willen zien, typ dan `/welkomstbericht nogeenkeer`."
};

const get = (userId, override) => {
    try { data = db.getData(`/${userId}`); } catch (error) {
      // console.error(error);
    }
    if (!data || !data.welcomed || override) {
      data.welcomed = true;
      db.push(`/${userId}`, data);
      return message;
    } else {
      return alreadyWelcomed;
    }
};

module.exports = { get };