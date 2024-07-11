const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// to access clodinary storage from account details
cloudinary.config({
    cloud_name : 'dm69dbrn2',
    api_key : '591182382595983',
    api_secret : '5rRgp-WaRkrW3kFrRZ1W4phdm-k'
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderLustCloudinary_DEV',
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });

  module.exports = {cloudinary , storage};