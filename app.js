const express = require('express');
const morgan = require('morgan');
const apps = require('./playstore-apps');

const app = express();

app.use(morgan('dev'));

app.listen(8000, () => {
    console.log('Server meowing on PORT 8000');
});

app.get('/apps', (req, res) => {
    let response = apps;

    const sort = req.query.sort ? req.query.sort : null;
    const genres = req.query.genres ? req.query.genres.toLowerCase() : null;

    if(!sort && !genres) {
        return res.status(200).send(response);
    };

    if(sort && !['Rating', 'App'].includes(sort)) {
        return res.status(401).send('Strictly \'Rating\' and \'App\' keywords only')
    }

    if(sort && ['Rating', 'App'].includes(sort)) {
        response = response.sort((a, b) => {
            if(a[sort] > b[sort]) {
                return 1;
            } else {
                return -1
            };
        });
        return res.status(200).send(response);
    }

    if(genres && ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres)) {
        response = response.filter(app => app.Genres.toLowerCase().includes(genres));
        return res.status(200).send(response);
    };

    res.status(401).send('All available keywords: \'action\', \'puzzle\', \'strategy\', \'casual\', \'arcade\', \'card\'');

});