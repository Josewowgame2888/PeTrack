const Color = require('./TerminalColor');
const dateTime = require('node-datetime');

class logger
{

    start(config)
    {
        var now = dateTime.create();
        now.format('m/d/Y H:M:S');
        var date = new Date(now.now());
        console.log(Color.DARK_AQUA + '['+date+']'+'[PeTrack] ' + Color.DARK_GRAY + 'Starting services...');
        console.log(Color.DARK_AQUA + '['+date+']'+'[PeTrack] ' + Color.DARK_GRAY + 'Starting server in port: ' + config.web_port);
        if(config.discord_enable === true)
        {
            console.log(Color.DARK_AQUA + '['+date+']'+'[PeTrack] ' + Color.DARK_GRAY + 'Discord service has been enabled');
        } else {
            console.log(Color.DARK_AQUA + '['+date+']'+'[PeTrack] ' + Color.DARK_GRAY + 'Discord service has been disabled');
        }
        console.log(Color.DARK_AQUA + '['+date+']'+'[PeTrack] ' + Color.DARK_GRAY + 'Track: ' + config.server_ip + ' : ' + config.server_port);
        console.log(Color.DARK_AQUA + '['+date+']'+'[PeTrack] ' + Color.DARK_GRAY + 'Services started successfully [127.0.0.1]');
        var stdin = process.openStdin();
        stdin.addListener("data", function(d) {
            
            switch(d.toString().trim())
            {
                case 'stop':
                    console.log(Color.DARK_AQUA + '['+date+']'+'[PeTrack] ' + Color.DARK_GRAY + 'Services stopped correctly...');
                    process.exit(0);
                break;
                case 'kill':
                    console.log(Color.DARK_AQUA + '['+date+']'+'[PeTrack] ' + Color.DARK_GRAY + 'Services stopped correctly...');
                    process.exit(0);
                break;
            }

          });
    }

}

module.exports = logger;
