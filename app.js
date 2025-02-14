require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi ({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

app.get('/', (req, res) => {
    res.render('home',)
})

// Our routes go here:

app.get("/artist-search", (req, res) => {
  const artist = req.params.artist
  console.log(req.query);
    spotifyApi
    .searchArtists('artist', artist)
    .then((data) => { console.log("The received data from the API: ", data.body.artists.items[0]);
    res.render("artist-search-result", {data});
    })
    .catch((err) => console.log("The error while searching artists occured: ",err));
});


app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
  spotifyApi
    .getArtist(artistId)
    .then((artist) => {
    res.render('albums', {data, artist});
    });
  })
  .catch((err) => console.log('The error while searching for the albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId, {limit: 5, offset: 1})
    .then((data) => {console.log(data.body);
    res.render('tracks', { data});
    })
    .catch((err) => console.log('Something went wrong!', err));
});





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));