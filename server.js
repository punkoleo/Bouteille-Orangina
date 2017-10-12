/**
 * Dépendances
 */
const express = require('express');
const compression = require('compression');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
/**
 *  Express
 */
const app = express();
app.set('host', process.env.WEBSITE_HOSTNAME  || 'localhost');
app.set('port', process.env.PORT || 8080);  
 
app.use(express.static(path.join(__dirname, ''), { maxAge: 25600000 }));

/**
 * Init.
 */
app.listen(app.get('port'), () => {
    console.log('http://localhost:%s démarré en mode %s ✓', app.get('port'), app.get('env'));
});

module.exports = app;