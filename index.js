const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const multer = require("multer");
const cloudinary = require("cloudinary");
const fs = require("fs");
const publicPath = path.resolve(__dirname, "public");
const deepai = require("deepai");
// <========================================================================================>

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

/* ------------------------------ <============ ----------------------------- */

cloudinary.config({
  cloud_name: "punit",
  api_key: "366629647624329",
  api_secret: "lt43FTmnjkwDJ2O8fvw6G30CzAo",
});
// <========================================================================================>
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "hbs");
deepai.setApiKey("f884cef0-fbd7-4e75-a349-f3480cffecca");
hbs.registerPartials(__dirname + "/views/partials", function (err) {});

cloudinary.config({
  cloud_name: "punit",
  api_key: "366629647624329",
  api_secret: "lt43FTmnjkwDJ2O8fvw6G30CzAo",
});

// <=========================================================================================>

/* --------------------------------- Routes --------------------------------- */

app.get("/", (req, res) => {
  res.render(__dirname + "/views/pages/" + "home.hbs");
});

app.get("/content-moderation", (req, res) => {
  res.render(__dirname + "/views/pages/" + "contentModeration.hbs");
});

app.get("/nudity", (req, res) => {
  res.render(__dirname + "/views/pages/" + "nudity.hbs");
});

app.get("/celebrity-recognition", (req, res) => {
  res.render(__dirname + "/views/pages/" + "celebrityRecognition.hbs");
});

app.get("/facial-expression", (req, res) => {
  res.render(__dirname + "/views/pages/" + "facialExpression.hbs");
});

app.get("/image-similarity", (req, res) => {
  res.render(__dirname + "/views/pages/" + "imageSimilarity.hbs");
});

app.get("/cnnmrf", (req, res) => {
  res.render(__dirname + "/views/pages/" + "CNNMRF.hbs");
});

app.get("/colorizer", (req, res) => {
  res.render(__dirname + "/views/pages/" + "colorizer.hbs");
});

app.post("/colorizer", upload.single("image"), (req, res, next) => {
  const file = req.file;
  cloudinary.uploader
    .upload(__dirname + "/uploads/" + file.filename, { tags: "basic_sample" })
    .then(function (image) {
      async function check() {
        try {
          var resp = await deepai.callStandardApi("colorizer", {
            image: image.url,
          });
          res.render(__dirname + "/views/pages/" + "colorizer.hbs", {
            img: resp.output_url,
          });
        //   console.log(JSON.stringify(resp));
        } catch (e) {
          console.log("Error" + e);
          res.render(__dirname + "/views/pages/" + "colorizer.hbs");
        }
      }
      check();
    })
    .catch(function (err) {
      console.log();
      console.log("** File Upload (Promise)");
      if (err) {
        console.warn(err);
      }
      res.render(__dirname + "/views/pages/" + "colorizer.hbs", {
        err: "Error",
      });
    });
});
/* <=========================End of Routes =============================> */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Started"));
