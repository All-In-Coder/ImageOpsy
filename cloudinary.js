const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "punit",
  api_key: "366629647624329",
  api_secret: "lt43FTmnjkwDJ2O8fvw6G30CzAo",
});

exports.uploads = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.url,
          id: result.public_id,
        });
      },
      {
        resource_type: "auto",
        folder: folder,
      }
    );
  });
};
