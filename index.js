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

app.get("/nudity", (req, res) => {
  res.render(__dirname + "/views/pages/" + "nudity.hbs");
});
app.post("/nudity", upload.single("image"), (req, res, next) => {
  const file = req.file;
  cloudinary.uploader
    .upload(__dirname + "/uploads/" + file.filename, { tags: "basic_sample" })
    .then(function (image) {
      async function check() {
        try {
          var resp = await deepai.callStandardApi("nsfw-detector", {
            image: image.url,
          });
          console.log(resp.output.nsfw_score);
          const nudeDetector = (resp.output.nsfw_score * 100).toFixed(2);
          res.render(__dirname + "/views/pages/" + "nudity.hbs", {
            nudeDetector: nudeDetector,
          });
        } catch (e) {
          console.log("Error" + e);
          res.render(__dirname + "/views/pages/" + "nudity.hbs");
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
      res.render(__dirname + "/views/pages/" + "nudity.hbs", {
        err: "Error",
      });
    });
});

app.get("/celebrity-recognition", (req, res) => {
  res.render(__dirname + "/views/pages/" + "celebrityRecognition.hbs");
});

app.post("/celebrity-recognition", upload.single("image"), (req, res, next) => {
  const file = req.file;
  cloudinary.uploader
    .upload(__dirname + "/uploads/" + file.filename, { tags: "basic_sample" })
    .then(function (image) {
      async function check() {
        try {
          var resp = await deepai.callStandardApi("celebrity-recognition", {
            image: image.url,
          });
          var ans = JSON.stringify(resp);
          console.log(ans);
          var output = resp.output.celebrities[0]["name"].toUpperCase();
          res.render(__dirname + "/views/pages/" + "celebrityRecognition.hbs", {
            celebrity: output,
          });
          //   console.log(JSON.stringify(resp));
        } catch (e) {
          console.log("Error" + e);
          res.render(__dirname + "/views/pages/" + "celebrityRecognition.hbs");
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
      res.render(__dirname + "/views/pages/" + "celebrityRecognition.hbs", {
        err: "Error",
      });
    });
});

app.get("/facial-expression", (req, res) => {
  res.render(__dirname + "/views/pages/" + "facialExpression.hbs");
});

app.post("/facial-expression", upload.single("image"), (req, res, next) => {
  const file = req.file;
  console.log(file.filename);
  cloudinary.uploader
    .upload(__dirname + "/uploads/" + file.filename, { tags: "basic_sample" })
    .then(function (image) {
      async function check() {
        try {
          var resp = await deepai.callStandardApi(
            "facial-expression-recognition",
            {
              image: image.url,
            }
          );
          console.log(resp);

          const output = "Can't Decide";
          if (resp.output.expressions.length)
            output = resp.output.expressions[0].emotion.toUpperCase();
          res.render(__dirname + "/views/pages/" + "facialExpression.hbs", {
            emotions: output,
          });
          //   console.log(JSON.stringify(resp));
        } catch (e) {
          console.log("Error" + e);
          res.render(__dirname + "/views/pages/" + "facialExpression.hbs");
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
      res.render(__dirname + "/views/pages/" + "facialExpression.hbs", {
        err: "Error",
      });
    });
});

app.get("/cnnmrf", (req, res) => {
  res.render(__dirname + "/views/pages/" + "CNNMRF.hbs");
});

app.post("/cnnmrf", upload.array("image", 2), (req, res, next) => {
  const file = req.files;
  // console.log(file);
  var first_image = file[0].filename;
  var second_image = file[1].filename;
  // console.log(first_image, second_image);
  cloudinary.uploader
    .upload(__dirname + "/uploads/" + first_image, { tags: "basic_sample" })
    .then(function (image) {
      // console.log(image);
      first_image = image.url;
    });
  cloudinary.uploader
    .upload(__dirname + "/uploads/" + second_image, { tags: "basic_sample" })
    .then(function (image) {
      // console.log(image);
      second_image = image.url;
      async function check() {
        try {
          console.log("H");
          var resp = await deepai.callStandardApi("CNNMRF", {
            content: first_image,
            style: second_image,
          });
          console.log(resp);
    
          
          res.render(__dirname + "/views/pages/" + "CNNMRF.hbs",{img: resp.output_url,});
          //   console.log(JSON.stringify(resp));
        } catch (e) {
          console.log("Error" + e);
          res.render(__dirname + "/views/pages/" + "CNNMRF.hbs",{err:"Some Error Occured!!!!"});
        }
      }
      check();
      
    }).catch(function (err) {
      console.log();
      console.log("** File Upload (Promise)");
      if (err) {
        console.warn(err);
      }
      res.render(__dirname + "/views/pages/" + "CNNMRF.hbs", {
        err: "Error",
      });
    });
  console.log(first_image, second_image);
  
});

/* <=========================End of Routes =============================> */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Started"));
