const express = require('express');
const app = express();
const hbs = require('hbs');
const path  = require('path');

// <========================================================================================>
const publicPath = path.resolve(__dirname, "public");

// <========================================================================================>
app.use(express.static(publicPath));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {});

// <=========================================================================================>

/* --------------------------------- Routes --------------------------------- */

app.get('/',(req,res)=>{
    res.render(__dirname+'/views/pages/'+'home.hbs');
})

app.get('/content-moderation', (req,res)=>{
    res.render(__dirname+'/views/pages/'+'contentModeration.hbs');
})

app.get('/nudity', (req,res)=>{
    res.render(__dirname+'/views/pages/'+'nudity.hbs');
})

app.get('/celebrity-recognition', (req,res)=>{
    res.render(__dirname+'/views/pages/'+'celebrityRecognition.hbs');
})

app.get('/facial-expression', (req,res)=>{
    res.render(__dirname+'/views/pages/'+'facialExpression.hbs');
})

app.get('/image-similarity', (req,res)=>{
    res.render(__dirname+'/views/pages/'+'imageSimilarity.hbs');
})

app.get('/cnnmrf', (req,res)=>{
    res.render(__dirname+'/views/pages/'+'CNNMRF.hbs');
})

app.get('/colorizer', (req,res)=>{
    res.render(__dirname+'/views/pages/'+'colorizer.hbs');
})

/* <=========================End of Routes =============================> */
const port = process.env.PORT || 3000
app.listen(port, ()=>console.log("Started"));