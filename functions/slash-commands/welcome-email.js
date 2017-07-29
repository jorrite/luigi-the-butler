const functions = require('firebase-functions');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Mailgun = require('mailgun-js');
var mailgun = new Mailgun({apiKey: functions.config().mailgun.config.api_key, domain: functions.config().mailgun.config.domain});
const db = require('../firebase-database').db;

const notAllowed = {
  "text": "U heeft niet de bevoegdheden om deze opdracht uit te voeren, helaas."
};

const invalidArgs = {
  "text": "Ongeldige invoer, graag e-mail en naam meegeven aan de opdracht."
};

const alreadySent = {
  "text": "U heeft dit e-mail adres al eens een welkomstmail gestuurd."
};

const sentMessage = {
  "text": "Dank, ik heb de postduiven op pad gestuurd!"
};

const errorMessage = {
  "text": "Ik vrees dat er iets is mis gegaan! De mail is niet verstuurd."
};

const send = (commandKey, command) => {
  if(command.user_id != functions.config().people.ids.admin_1)
  {
    db.ref().child('slash-commands').child(commandKey).set(null);
    return axios.post(command.response_url, notAllowed).then(() => console.log('Completed command'));
  }

  var args = command.text.split(" ");
  if(args.length < 2)
  {
    db.ref().child('slash-commands').child(commandKey).set(null);
    return axios.post(command.response_url, invalidArgs).then(() => console.log('Completed command'));
  }

  var cleanEmail = args[0].replace(/\./g, ',');

  let ref = db.ref(`welcome-email/${cleanEmail}`);
  return ref.once('value').then(function(snapshot){
    let data = snapshot.val();
    if (!data || args[2] === 'nogeenkeer') {
      ref.set(true);
      let email = '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>  <title></title>  <!--[if !mso]><!-- -->  <meta http-equiv="X-UA-Compatible" content="IE=edge">  <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style type="text/css">  #outlook a { padding: 0; }  .ReadMsgBody { width: 100%; }  .ExternalClass { width: 100%; }  .ExternalClass * { line-height:100%; }  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }  table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }  p { display: block; margin: 13px 0; }</style><!--[if !mso]><!--><style type="text/css">  @media only screen and (max-width:480px) {    @-ms-viewport { width:320px; }    @viewport { width:320px; }  }</style><!--<![endif]--><!--[if mso]><xml>  <o:OfficeDocumentSettings>    <o:AllowPNG/>    <o:PixelsPerInch>96</o:PixelsPerInch>  </o:OfficeDocumentSettings></xml><![endif]--><!--[if lte mso 11]><style type="text/css">  .outlook-group-fix {    width:100% !important;  }</style><![endif]--><!--[if !mso]><!-->    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">    <style type="text/css">       @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);</style>  <!--<![endif]--><style type="text/css">  @media only screen and (min-width:480px) {    .mj-column-per-100 { width:100%!important; }  }</style></head><body>    <div class="mj-container"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:125px;"><img alt="" title="" height="auto" src="http://s3.eu-central-1.amazonaws.com/cdn.elfferi.ch/wedding/email/welcome-email/img/logo.png" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="125"></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]-->      <!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="background:#fff url(http://s3.eu-central-1.amazonaws.com/cdn.elfferi.ch/wedding/email/welcome-email/img/background.png) top center / cover no-repeat;font-size:0px;width:100%;" border="0" background="http://s3.eu-central-1.amazonaws.com/cdn.elfferi.ch/wedding/email/welcome-email/img/background.png"><tbody><tr><td><div style="margin:0px auto;max-width:600px;"><!--[if mso | IE]>      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;">        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="http://s3.eu-central-1.amazonaws.com/cdn.elfferi.ch/wedding/email/welcome-email/img/background.png" />        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:50px 30px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="width:600px;" class="border-wrapper-outlook">      <![endif]--><div style="margin:0px auto;max-width:600px;background:#fff;" class="border-wrapper"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#fff;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;border-left:1px solid #ededed;border-right:1px solid #ededed;border-top:1px solid #ededed;direction:ltr;font-size:0px;padding:20px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:30px;" align="center"><div style="cursor:auto;color:#75ACDA;font-family:\'Helvetica Neue\', Open Sans, Arial;font-size:20px;font-weight:lighter;line-height:22px;letter-spacing:5px;text-align:center;text-transform:uppercase;">yes, i do</div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>        </td>      </tr>      <tr>        <td style="width:600px;">      <![endif]--><div style="margin:0px auto;max-width:600px;background:#fff;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#fff;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;border-bottom:1px solid #ededed;border-left:1px solid #ededed;border-right:1px solid #ededed;direction:ltr;font-size:0px;padding:20px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:20px;" align="left"><div style="cursor:auto;color:#000000;font-family:\'Helvetica Neue\', Open Sans, Arial;font-size:13px;font-weight:lighter;line-height:22px;text-align:left;">Lieve {{name}},</div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:20px;" align="left"><div style="cursor:auto;color:#000000;font-family:\'Helvetica Neue\', Open Sans, Arial;font-size:13px;font-weight:lighter;line-height:22px;text-align:left;"><span style="font-style:italic;">Fantastico</span>, je gaat mee naar Sicilië! Wij vinden het echt fantastisch dat je ons huwelijksweekend mee wilt vieren. We kunnen niet wachten om met jou het glas te heffen op ons huwelijk en dit bijzondere moment samen te delen.</div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:20px;" align="left"><div style="cursor:auto;color:#000000;font-family:\'Helvetica Neue\', Open Sans, Arial;font-size:13px;font-weight:lighter;line-height:22px;text-align:left;">Helaas, het is nog even wachten tot het zo ver is. Voor alle voorbereiding, informatie en overige leuke onderwerpen met betrekking tot 20-5-2018 gebruiken we een app genaamd Slack. Hiervoor ontvang je separaat een uitnodiging per e-mail. Als je Slack niet wil gebruiken (niets is verplicht!) of je hebt vragen tussendoor dan kun je ons altijd nog bereiken.</div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:20px;" align="left"><div style="cursor:auto;color:#000000;font-family:\'Helvetica Neue\', Open Sans, Arial;font-size:13px;font-weight:lighter;line-height:22px;text-align:left;">Veel liefs,</div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:20px;" align="left"><div style="cursor:auto;color:#000000;font-family:\'Helvetica Neue\', Open Sans, Arial;font-size:13px;font-weight:lighter;line-height:22px;text-align:left;">Het bruidspaar, {{names}}</div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>        </td>      </tr>      <tr>        <td style="width:600px;">      <![endif]--><div style="margin:0px auto;max-width:600px;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:30px;"><img alt="" title="" height="auto" src="http://cdn.elfferi.ch.s3.amazonaws.com/wedding/email/welcome-email/img/instagram-logo.png" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="30"></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center"><div style="cursor:auto;color:#75ACDA;font-family:\'Helvetica Neue\', \'Open Sans\', Arial;font-size:13px;font-weight:bold;line-height:22px;letter-spacing:2px;text-align:center;text-transform:uppercase;">#{{instagramtag}}</div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>          </td>        </tr>      </table>      <![endif]--></td></tr></tbody></table><!--[if mso | IE]>        </v:textbox>      </v:rect>      <![endif]--></div></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></body></html>';
      email = email.replace("{{name}}", args[1]);
      email = email.replace("{{names}}", functions.config().people.names.groom+" &amp; "+functions.config().people.names.bride;
      email = email.replace("{{instagramtag}}", functions.config().tags.instagram;
      let emailData = {
        from: functions.config().mailgun.config.name_from + " <" + functions.config().mailgun.config.email_from + ">",
        to: args[1] + " <" + args[0] + ">",
        subject: "Huwelijksweekend Sicili&euml;",
        html: email
      }
      mailgun.messages().send(emailData, function(err, body){
        messageToSend = sentMessage;
        if(err) messageToSend = errorMessage;
        db.ref().child('slash-commands').child(commandKey).set(null);
        return axios.post(command.response_url, messageToSend).then(() => console.log('Completed welkomstbericht command'));
      });
    } else {
      messageToSend = alreadySent;
      db.ref().child('slash-commands').child(commandKey).set(null);
      return axios.post(command.response_url, messageToSend).then(() => console.log('Completed welkomstbericht command'));
    }
  });
};

module.exports = { send };