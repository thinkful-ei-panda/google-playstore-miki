const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const apps = require('../playstore-apps');

describe('GET /apps should return correct response with respect to query params', () => {
    it('should return apps array', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
            });
    });

    // If sort test suite contains a single test spec, extract that spec
    // Add test specs for no and invalid sort values
    describe('/apps should return proper response according to sort query', () => {
        it('should return sorted apps array', () => {
            return supertest(app)
                .get('/apps')
                .query({sort: 'rating'})
                .expect(200)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array');
                    // Two ways to do this
                    // Compare res.body to simulated array
                    // Loop through res.body

                    let sorted = true;
                    let i = 0;

                    while (i < res.body.length) {
                        if (res.body[i][sort] > res.body[i+1][sort]) {
                            sorted = false;
                            break;
                        };
                        i++;
                    };

                    expect(sorted).to.be.true;
                }); 
        });
    });

    // Add test suite for genres query
});
