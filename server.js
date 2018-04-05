const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// set port for heroku, but 3000 for local
const port = process.env.PORT || 3000;

// make new express app
const app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// set express middleware
  // set rendering engine 'handlebars'
  app.set('view engine', 'hbs');

  // custom middleware
  app.use( (request, response, next) => {
    // log time
    var now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;
    fs.appendFile('server.log', log + "\n", (err) => {
      if(err){
        console.log('Unable to append to file');
      }
    });
    // if next is never called, the rest of the code doesnt execute
    next();
  });

  // app.use( (request, response, next) => {
  //   response.render('maintenance.hbs');
  // });

  // use static serving
  app.use(express.static(__dirname + '/public'));



//register handler for GET request
app.get('/', (request, response) => {

  // request stores a ton of info about the request coming in
    // response.send('<h1>Hello Express!</h1>');

  // express will notice that this is JSON and send it as such (altering "Content-Type" header)
  // response.send({
  //   name : 'Andrew',
  //   likes : [
  //     'bowling',
  //     'working out'
  //   ]
  // })

  response.render('home.hbs', {
    title : 'Welcome',
    pageTitle : 'Hello!',
    welcome_message : 'Welcome Usa!',
  });


});

app.get('/about', (request, response) => {
  response.render('about.hbs', {
    pageTitle : 'About Page',
  });
});

app.get('/bad', (request, response) => {
  response.send({
    message : 'Unable to fulfill this request'
  });
})

app.get('/Projects', (request, response) => {
  response.render('projects.hbs', {
    welcome_message : 'Portfolio Page (Here)',
    pageTitle : 'Projects'
  });
});

// make app start listening on port 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
