const express = require('express');
const app = express();
const statsPage = require('./statsPage.js');

const RAMDB = {
    twitchChannels: [],
    queries: 0,
    errors: 0,
    dupes: 0
};

app.get('/', (req, res) => {
    res.redirect('https://github.com/topstreamapp/mushroom');
});

app.get('/getStats', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json(RAMDB);
});

app.get('/viewStats', (req,res) => {
    res.send(
        statsPage(RAMDB)
    );
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
            views: parseInt(req.query.views)
        };

        for (let exChannelData of RAMDB.twitchChannels) {
            if (exChannelData.id === channelData.id) {
                RAMDB.dupes++;
                result.success = false;
                result.msg = 'Dupe.';
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
