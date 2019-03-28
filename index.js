const express = require('express');
const app = express();
const statsPage = require('./statsPage.js');

const RAMDB = {
    twitchChannels: [],
    queries: 0,
    errors: 0,
    dupes: 0,
    started: new Date().getTime()
};

console.log('Mushroom server started at:', new Date().toISOString());

app.get('/', (req, res) => {
    res.redirect('https://github.com/topstreamapp/mushroom');
});

app.get('/getStats', (req, res) => {
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

        if (isNaN(channelData.id) || isNaN(channelData.views) || channelData.id < 0 || channelData.views < 0) {
            console.log('Bad ID or views count!', channelData);

            RAMDB.errors++;
            result.success = false;
            result.msg = 'Bad ID or views count! Check your query.';
            res.json(result);
            return false;
        }

        if (!/^[A-z0-9_]+$/.test(channelData.username) || !/^[A-z0-9_]+$/.test(channelData.partner)) {
            console.log('Bad username or partner status!', channelData);

            RAMDB.errors++;
            result.success = false;
            result.msg = 'Bad username or partner status! Check your query.';
            res.json(result);
            return false;
        }
        
        if (channelData.length > 15 || channelData.partner.length > 9) {
            console.log('Username or partner status is too long!', channelData);

            RAMDB.errors++;
            result.success = false;
            result.msg = 'Username or partner status is too long! Check your query.';
            res.json(result);
            return false;
        }

        if (channelData.id > Number.MAX_SAFE_INTEGER || channelData.views > Number.MAX_SAFE_INTEGER) {
            console.log('ID or views count is too big!', channelData);

            RAMDB.errors++;
            result.success = false;
            result.msg = 'ID or views count is too big! Check your query.';
            res.json(result);
            return false;
        }

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
        console.log('Internal Server Error!', err);

        RAMDB.errors++;
        result.success = false;
        result.msg = 'Unable to add Twitch channel! Wrong query or server error.';
        res.json(result);
    }
});

module.exports = app;
