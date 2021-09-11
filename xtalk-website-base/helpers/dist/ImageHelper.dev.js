'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Sharp = require('sharp');

var PathPattern = /(.*\/)?(.*)\/(.*)/;

var path = require('path');

var fs = require('fs');

var mkdirp = require('mkdirp');

var FileHelper = require('./FileHelper');

var config = require('../config/config');

var File = require('../models/file.model');

var ImageHelper =
/*#__PURE__*/
function () {
  function ImageHelper() {
    _classCallCheck(this, ImageHelper);
  }

  _createClass(ImageHelper, null, [{
    key: "resizeImage",
    value: function resizeImage(file, options) {
      var action = options.action ? options.action : 'cover';

      try {
        var width = options.width === 'AUTO' ? null : parseInt(options.width);
        var height = options.height === 'AUTO' ? null : parseInt(options.height);
        var fit; //const data = fs.readFileSync(file);

        switch (action) {
          case 'max':
            fit = 'inside';
            break;

          case 'min':
            fit = 'outside';
            break;

          default:
            fit = 'cover';
            break;
        }

        return Sharp(file, {
          failOnError: false
        }).resize(width, height, {
          withoutEnlargement: true,
          fit: fit
        }).rotate().toBuffer(); // return result;
        // await S3.putObject({
        //     Body: result,
        //     Bucket: BUCKET,
        //     ContentType: data.ContentType,
        //     Key: path,
        //     CacheControl: 'public, max-age=86400'
        // }).promise();
      } catch (e) {
        console.log(e.message);
        return false;
      }
    }
  }, {
    key: "saveAvatar",
    value: function saveAvatar(file, user) {}
  }, {
    key: "resizeStream",
    value: function resizeStream(path, format, width, height) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
        withoutEnlargement: false,
        fit: 'cover'
      };
      var readStream = fs.createReadStream(path);
      var transform = Sharp();

      if (format) {
        transform = transform.toFormat(format);
      }

      if (width || height) {
        transform = transform.resize(width, height, options);
      }

      return readStream.pipe(transform);
    }
  }, {
    key: "uploadAvatar",
    value: function uploadAvatar(req, res, callback) {
      console.log('call here');
      var mask = '0777';
      var fileName = new Date().getTime() + path.extname(req.files.avatar.originalFilename);
      var image = req.files.avatar;

      try {
        mkdirp(config.avatarPath + req.user._id, mask).then(function (made) {
          var imageSize = Object.values(config.imageSize);
          console.log(imageSize);
          var newpath = config.avatarPath + req.user._id + '/' + fileName;
          var pathFile = config.avatarPath + req.user._id + '/';
          console.log("path avatar:" + req.files.avatar.path);
          fs.readFile(req.files.avatar.path, function (err, data) {
            File.findOne({
              userId: req.user._id,
              type: 'avatar'
            }, function (err, file) {
              if (err) {
                console.log('updatedAvatar Error', err);
                return callback();
              }

              var oldpath = null;

              if (!file) {
                file = new File({
                  type: 'avatar',
                  userId: req.user._id,
                  fileName: fileName,
                  path: newpath,
                  mimeType: image.mimetype,
                  size: image.size
                });
              } else {
                oldpath = file.path;
                file.path = newpath;
                file.fileName = fileName;
                file.mimeType = image.mimetype;
                file.size = image.size;
              }

              file.save(function (err, file) {
                FileHelper.ensureDirectoryExistence(newpath);
                fs.writeFileSync(pathFile + fileName, data);
                imageSize.forEach(function (options) {
                  ImageHelper.resizeImage(data, options).then(function (image) {
                    fs.writeFileSync(pathFile + options.width + 'x' + options.height + '_' + fileName, image);
                  });
                });

                if (oldpath) {
                  ImageHelper.removeOldAvatar(oldpath);
                }

                return callback(null, file);
              });
            });
          });
        });
      } catch (error) {
        return callback(error, null);
      }
    }
  }, {
    key: "removeOldAds",
    value: function removeOldAds(paths) {
      fs.unlinkSync(paths);
      var dir = path.dirname(paths);
      var fileName = path.parse(paths).base;
      var imageSize = Object.values(config.adsSize);
      imageSize.forEach(function (options) {
        var delPath = dir + '/' + options.width + 'x' + options.height + '_' + fileName;
        fs.lstat(delPath, function (err, stats) {
          if (err) {
            //console.log(err);
            return;
          }

          if (stats.isFile()) {
            console.log('Remove image ', delPath);
            fs.unlinkSync(delPath);
          }
        });
      });
    }
  }, {
    key: "removeOldAvatar",
    value: function removeOldAvatar(paths) {
      var dir = path.dirname(paths);
      var fileName = path.parse(paths).base;
      var imageSize = Object.values(config.imageSize);
      imageSize.forEach(function (options) {
        var delPath = dir + '/' + options.width + 'x' + options.height + '_' + fileName;
        fs.lstat(delPath, function (err, stats) {
          if (err) {
            //console.log(err);
            return;
          }

          if (stats.isFile()) {
            console.log('Remove image ', delPath);
            fs.unlinkSync(delPath);
          }
        });
      });
    }
  }, {
    key: "uploadAvatartoUser",
    value: function uploadAvatartoUser(req, res, callback) {
      console.log('call here');
      var mask = '0777';
      var fileName = new Date().getTime() + path.extname(req.files.avatar.originalFilename);
      var image = req.files.avatar;

      try {
        mkdirp(config.avatarPath + req.body.user.id, mask).then(function (made) {
          req.body.user = JSON.parse(req.body.user);
          var imageSize = Object.values(config.imageSize);
          console.log(imageSize);
          var newpath = config.avatarPath + req.body.user._id + '/' + fileName;
          var pathFile = config.avatarPath + req.body.user._id + '/';
          fs.readFile(req.files.avatar.path, function (err, data) {
            File.findOne({
              userId: req.body.user.id,
              type: 'avatar'
            }, function (err, file) {
              if (err) {
                console.log('updatedAvatar Error', err);
                return callback();
              }

              var oldpath = null;

              if (!file) {
                file = new File({
                  type: 'avatar',
                  userId: req.body.user.id,
                  fileName: fileName,
                  path: newpath,
                  mimeType: image.mimetype,
                  size: image.size
                });
              } else {
                oldpath = file.path;
                file.path = newpath;
                file.fileName = fileName, file.mimeType = image.mimetype;
                file.size = image.size;
              }

              file.save(function (err, resFile) {
                FileHelper.ensureDirectoryExistence(newpath);
                fs.writeFileSync(pathFile + fileName, data);
                imageSize.forEach(function (options) {
                  ImageHelper.resizeImage(data, options).then(function (image) {
                    console.log('log path file in upload avartar for user');
                    console.log(pathFile);
                    fs.writeFileSync(pathFile + options.width + 'x' + options.height + '_' + fileName, image);
                  });
                });

                if (oldpath) {
                  ImageHelper.removeOldAvatar(oldpath);
                }

                return callback(null, file);
              });
            });
          });
        });
      } catch (error) {}
    }
  }]);

  return ImageHelper;
}();

module.exports = ImageHelper;