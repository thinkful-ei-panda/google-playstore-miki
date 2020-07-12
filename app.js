const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const apps = require('./playstore-apps');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

const handleModifyResponseByQueries = (req, res, next) => {
    // The idea is to modify response as function handles each query
    // This function implements case insensitivity to handle all query formats
    // Sort options have been expanded to include all properties of app object

    let response = apps;

    const sort = req.query.sort ? req.query.sort.toLowerCase() : null;
    const genres = req.query.genres ? req.query.genres.toLowerCase() : null;

    if(!sort && !genres) {
        return res.status(200).send(response);
    };
    
    const allPossibleSortQueries = Object.keys(apps[0]).map(query => query.toLowerCase());
    const allPossibleGenresQueries = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];

    if(!allPossibleSortQueries.includes(sort)) {   
        return res.status(401).send('Invalid keyword');
    };

    if(allPossibleSortQueries.includes(sort)) {
        let caseInsensitiveKey;

        response.forEach(app => {
            for (let key in app) {
                if (key.toLowerCase() === sort) {
                    caseInsensitiveKey = key;
                    break;
                };
            };
        });

        response = response.sort((a, b) => {
            if(a[caseInsensitiveKey] > b[caseInsensitiveKey]) {
                return 1;
            } else {
                return -1
            };
        });
    };

    if(!allPossibleGenresQueries.includes(genres)) {
        response = response.filter(app => app.Genres.toLowerCase().includes(genres));
        return res.status(401).send('Acceptable keywords: \'action\', \'puzzle\', \'strategy\', \'casual\', \'arcade\', \'card\'');    };

    if(allPossibleGenresQueries.includes(genres)) {
        response = response.filter(app => app.Genres.toLowerCase().includes(genres));
    };

    res.json(response);
};

app.get('/apps', handleModifyResponseByQueries);

module.exports = app;