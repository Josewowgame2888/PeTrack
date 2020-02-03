//modules
const FileIterator = require('fs');
const http = require('http');
const ping = require('./utils/PElib');
const fetch = require("node-fetch");
const logger = require('./utils/logger');

//vars and configd
var Config = JSON.parse(FileIterator.readFileSync('./config.json','utf8'));
var staff = JSON.parse(FileIterator.readFileSync('./staff.json','utf8'));
var body;
//web
const HTML_HEADER_CODE = FileIterator.readFileSync('./web/web_header.track','utf8');
const HTML_RESPONSE_CLEAR = HTML_HEADER_CODE.replace("[CSS_STYLE_JSON]",FileIterator.readFileSync('./web/web_css.track','utf8'));
const HTML_CARD1 = FileIterator.readFileSync('./web/template_card1.track','utf8');
const HTML_CARD2 = FileIterator.readFileSync('./web/template_card2.track','utf8');
const HTML_CARD3 = FileIterator.readFileSync('./web/template_card3.track','utf8');
const HTML_CARD_ERROR = FileIterator.readFileSync('./web/template_error.track','utf8');
const HTML_STAFF_CARD = FileIterator.readFileSync('./web/template_contact.track','utf8');

 new logger().start(Config);

function onRequest(request, response) 
{
    response.writeHead(200,{"Content-type" : "text/html"});
    body = HTML_RESPONSE_CLEAR.replace("[NETWORK_NAME_JSON]",Config.network_name);
    var cards = '';
    var staffs = '';
    ping(Config.server_ip,Config.server_port, function(err, res) {

        if(err)
        {
            var card_1 = HTML_CARD_ERROR+"\n";
            card_1 = card_1.replace('[INFO_1]',Config.network_name);
            card_1 = card_1.replace('[INFO_4]',Config.server_ip+' || '+Config.server_port);
            card_1 = card_1.replace('[IMG]',Config.img_card_error);
            cards = cards+card_1;

            var card_2 = HTML_CARD_ERROR+"\n";
            card_2 = card_2.replace('[INFO_1]',Config.network_name);
            card_2 = card_2.replace('[INFO_4]',Config.server_ip+' || '+Config.server_port);
            card_2 = card_2.replace('[IMG]',Config.img_card_error);
            cards = cards+card_2;

            
            var card_3 = HTML_CARD_ERROR+"\n";
            card_3 = card_3.replace('[INFO_1]',Config.network_name);
            card_3 = card_3.replace('[INFO_4]',Config.server_ip+' || '+Config.server_port);
            card_3 = card_3.replace('[IMG]',Config.img_card_error);
            cards = cards+card_3;

            body = body.replace('[HTML_CARDS]',cards);
            response.write(body);
            response.end();
        } else {
            playing = res.currentPlayers;
            maxplayers = res.maxPlayers;
            //add cards
            var card_1 = HTML_CARD1+"\n";
            card_1 = card_1.replace('[INFO_1]',Config.network_name);
            card_1 = card_1.replace('[INFO_2]',playing+' PLAYING IN THE SERVER');
            card_1 = card_1.replace('[INFO_3]',getScoreValue(maxplayers,playing));
            card_1 = card_1.replace('[INFO_4]',Config.server_ip+' || '+Config.server_port);
            card_1 = card_1.replace('[IMG]',Config.img_card_1);
            cards = cards+card_1;

            var card_2 = HTML_CARD2+"\n";
            card_2 = card_2.replace('[INFO_1]',Config.network_name);
            card_2 = card_2.replace('[INFO_2]',maxplayers+' MAXIMUM CAPACITY');
            card_2 = card_2.replace('[INFO_3]',getScoreValue(maxplayers,playing));
            card_2 = card_2.replace('[INFO_4]',Config.server_ip+' || '+Config.server_port);
            card_2 = card_2.replace('[IMG]',Config.img_card_2);
            cards = cards+card_2;

            
            var card_3 = HTML_CARD3+"\n";
            card_3 = card_3.replace('[INFO_1]',Config.network_name);
            card_3 = card_3.replace('[INFO_2]',getScoreValue(maxplayers,playing)+' - 100% AVERAGE');
            card_3 = card_3.replace('[INFO_3]',getScoreValue(maxplayers,playing));
            card_3 = card_3.replace('[INFO_4]',Config.server_ip+' || '+Config.server_port);
            card_3 = card_3.replace('[IMG]',Config.img_card_3);
            cards = cards+card_3;

            if(Object.keys(staff).length > 0)
            {
                Object.keys(staff).forEach((value) => {
                    var card_staff = HTML_STAFF_CARD+"\n";
                    object = staff[value];
                    card_staff = card_staff.replace('[INFO_1]',object.name);
                    card_staff = card_staff.replace('[INFO_2]',object.rol);
                    card_staff = card_staff.replace('[INFO_3]',object.description);
                    card_staff = card_staff.replace('[INFO_4]',object.img);
                    card_staff = card_staff.replace('[INFO_5]',object.contact);
                    staffs = staffs+card_staff;
                })
            }

            body = body.replace('[HTML_CARDS]',cards);
            body = body.replace('[STAFF_CARDS]',staffs);
            response.write(body);
            response.end();
        }
    }, 3000);
}

function getScoreValue(max, min)
{
    var total = (min * 100) / max;
    return total.toFixed(0) + '%';
}

function DiscordSendWebHook() 
{
    ping(Config.server_ip,Config.server_port, function(err, res)
    {
        if(err)
        {
            fetch(Config.discord_webhook, {
                "method":"POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify({
                   "content": "👥 0/0 Players on the server! \n🤠 "+Config.server_ip+" || "+Config.server_port+ "\n🔰 Track: "+Config.web_ip,
                   "username": Config.network_name+" Track"
               })
           
               })
               .catch(err => console.error(err));
        } else {
            fetch(Config.discord_webhook, {
             "method":"POST",
             "headers": {"Content-Type": "application/json"},
             "body": JSON.stringify({
                "content": "👥 "+res.currentPlayers+"/"+res.maxPlayers+" Players on the server! \n🤠 "+Config.server_ip+" || "+Config.server_port+ "\n🔰 Track: "+Config.web_ip,
                "username": Config.network_name+" Track"
            })
        
            })
            .catch(err => console.error(err));
        }
    }, 3000)
}

if(Config.discord_enable === true)
{
    setInterval(DiscordSendWebHook,2400000);
}

var server = http.createServer(onRequest);
 
server.listen(Config.web_port);



