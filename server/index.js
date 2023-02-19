/* eslint-disable no-multi-str */
const express = require('express')
const request = require('request');
const dotenv = require('dotenv');

const port = 5000

global.access_token = ''
global.refresh_token = ''

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var spotify_redirect_url = 'http://localhost:3000/auth/callback'

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var app = express();

app.get('/auth/login', (req, res) => {

    var scope = "streaming \
        user-read-private \
        user-read-email \
        user-read-playback-state \
        user-modify-playback-state \
        user-read-currently-playing \
        user-read-playback-position"
    
    var state = generateRandomString(16);

    var auth_query_params = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: spotify_redirect_url,
        state: state
    })

    res.redirect("https://accounts.spotify.com/authorize?" + auth_query_params.toString())
});


app.get('/auth/callback', (req, res) => {

    var code = req.query.code;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: spotify_redirect_url,
            grant_type: 'authorization_code'
        },
        headers: {
            Authorization: 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            res.redirect('/')
        }
    });
});

app.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token})
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
