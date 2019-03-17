module.exports = function(db) {
    var output = '<html><head><title>TopStream Mushroom Stats</title><style>body {margin: 0; font-family: Arial;}</style></head><body><div style="margin: 0 20px; margin-top: 10px;"><h1>TopStream Mushroom Stats</h1>';

    output += `<h3>Queries: ${db.queries} (${db.errors} errors, ${db.dupes} dupes)</h3><p>Since last deployment.</p>`;

    for (let channel of db.twitchChannels) {
        output += `<p><a href="https://www.twitch.tv/${channel.username}" target="_blank">${channel.username}</a> - ${channel.views} (${channel.partner.length < 1 ? 'regular' : channel.partner})</p>`;
    }

    output += `</div></body></html>`;

    return output;
};
