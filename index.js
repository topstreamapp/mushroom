const express = require('express');
const app = express();

const RAMDB = {
    twitchChannels: [],
    queries: 0,
    errors: 0
};

app.get('/', () => {
    res.redirect('https://github.com/topstreamapp/mushroom');
});

app.get('/getStats', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send(RAMDB);
});

app.get('/addTwitchChannel', (req, res) => {
    RAMDB.queries++;

    res.set('Access-Control-Allow-Origin', '*');

    const result = {
        success: true
    };

    try {
        const channelData = {
            username: req.query.username,
            id: parseInt(req.query.id),
            partner: req.query.partner,
            followers: parseInt(req.query.followers)
        };

        for (let exChannelData of RAMDB.twitchChannels) {
            if (exChannelData.id === channelData.id) {
                result.success = false;
                result.msg = 'Channel already in DB!';
                res.json(result);
                return false;
            }
        }

        RAMDB.twitchChannels.push(channelData);

        if (RAMDB.twitchChannels.length > 4096)
            RAMDB.twitchChannels.splice(0, 1);

        res.json(result);
    } catch (err) {
        RAMDB.errors++;
        result.success = false;
        result.msg = 'Unable to add Twitch channel! Check your query.';
        res.json(result);
    }
});

module.exports = app;
