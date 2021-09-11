'use strict'
const Sharp = require('sharp');
const PathPattern = /(.*\/)?(.*)\/(.*)/;
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
const FileHelper = require('./FileHelper');
const config = require('../config/config');
const File = require('../models/file.model');
class ImageHelper {
    static resizeImage(file, options) {
        var action = options.action ? options.action : 'cover';
        try {
            const width = options.width === 'AUTO' ? null : parseInt(options.width);
            const height = options.height === 'AUTO' ? null : parseInt(options.height);
            let fit;
            //const data = fs.readFileSync(file);
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
            return Sharp(file, { failOnError: false })
                .resize(width, height, { withoutEnlargement: true, fit })
                .rotate()
                .toBuffer();
            // return result;
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
    };

    static saveAvatar(file, user) {

    }

    static resizeStream(path, format, width, height, options = { withoutEnlargement: false, fit: 'cover' })  {
        const readStream = fs.createReadStream(path)
        let transform = Sharp()
        if (format) {
            transform = transform.toFormat(format,{quality: 85})
        }
        if (width || height) {
            transform = transform.resize(width, height,options);
        }
        return readStream.pipe(transform)
    }
   
    static uploadAvatar(req, res, callback) {
        console.log('call here');
        var mask = '0777';
        var fileName = (new Date().getTime()) + path.extname(req.files.avatar.originalFilename);
        var image = req.files.avatar;

        try {
            mkdirp(config.avatarPath + req.user._id, mask).then(made => {
                const imageSize = Object.values(config.imageSize);
                console.log(imageSize);
                var newpath = config.avatarPath + req.user._id + '/' + fileName;
                var pathFile = config.avatarPath + req.user._id + '/';
                console.log("path avatar:" + req.files.avatar.path);
                fs.readFile(req.files.avatar.path, (err, data) => {
                    File.findOne({ userId: req.user._id, type: 'avatar' }, function (err, file) {
                        if (err) {
                            console.log('updatedAvatar Error', err);
                            return callback();
                        }
                        let oldpath = null;

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
                            file.fileName =  fileName;
                            file.mimeType = image.mimetype;
                            file.size = image.size;
                        }
                        file.save((err, file) => {
                            FileHelper.ensureDirectoryExistence(newpath);
                            fs.writeFileSync(pathFile + fileName, data);
                            imageSize.forEach(options => {
                                ImageHelper.resizeImage(data, options).then(image => {
                                    fs.writeFileSync(pathFile + options.width + 'x' + options.height + '_' + fileName, image)
                                })
                            })

                            if (oldpath) {
                                ImageHelper.removeOldAvatar(oldpath)
                            }
                            return callback(null, file);
                        })

                    });
                });

            });
        } catch (error) {
            return callback(error, null);
        }
    }
    static removeOldAds(paths) {
        fs.unlinkSync(paths)
        let dir = path.dirname(paths);
        var fileName = path.parse(paths).base;
        const imageSize = Object.values(config.adsSize);
        imageSize.forEach(options => {
            let delPath = dir + '/' + options.width + 'x' + options.height + '_' + fileName;
            fs.lstat(delPath, function (err, stats) {
                if (err) {
                    //console.log(err);
                    return;
                }
                if (stats.isFile()) {
                    console.log('Remove image ', delPath);
                    fs.unlinkSync(delPath)
                }
            });

        })

    };
    static removeOldAvatar(paths) {

        let dir = path.dirname(paths);
        var fileName = path.parse(paths).base;
        const imageSize = Object.values(config.imageSize);
        imageSize.forEach(options => {
            let delPath = dir + '/' + options.width + 'x' + options.height + '_' + fileName;
            fs.lstat(delPath, function (err, stats) {
                if (err) {
                    //console.log(err);
                    return;
                }
                if (stats.isFile()) {
                    console.log('Remove image ', delPath);
                    fs.unlinkSync(delPath)
                }
            });

        })

    };

    static uploadAvatartoUser(req, res, callback) {
        console.log('call here');
        var mask = '0777';
        var fileName = (new Date().getTime()) + path.extname(req.files.avatar.originalFilename);
        var image = req.files.avatar;
        try {
            mkdirp(config.avatarPath + req.body.user.id, mask).then(made => {
                req.body.user = JSON.parse(req.body.user);
                const imageSize = Object.values(config.imageSize);
                console.log(imageSize);
                var newpath = config.avatarPath + req.body.user._id + '/' + fileName;
                var pathFile = config.avatarPath + req.body.user._id + '/';
                fs.readFile(req.files.avatar.path, (err, data) => {
                    File.findOne({ userId: req.body.user.id, type: 'avatar' }, function (err, file) {
                        if (err) {
                            console.log('updatedAvatar Error', err);
                            return callback();
                        }
                        let oldpath = null;

                        if (!file) {
                            file = new File({
                                type: 'avatar',
                                userId: req.body.user.id,
                                fileName:  fileName,
                                path: newpath,
                                mimeType: image.mimetype,
                                size: image.size
                            });
                        } else {
                            oldpath = file.path;
                            file.path = newpath;
                            file.fileName = fileName,
                            file.mimeType = image.mimetype;
                            file.size = image.size;
                        }
                        file.save((err, resFile) => {
                            FileHelper.ensureDirectoryExistence(newpath);
                            fs.writeFileSync(pathFile + fileName, data);
                            imageSize.forEach(options => {
                                ImageHelper.resizeImage(data, options).then(image => {
                                    console.log('log path file in upload avartar for user');
                                    console.log(pathFile);
                                    fs.writeFileSync(pathFile + options.width + 'x' + options.height + '_' + fileName, image)
                                })
                            })

                            if (oldpath) {
                                ImageHelper.removeOldAvatar(oldpath)
                            }
                            return callback(null, file);
                        })

                    });
                });

            });
        } catch (error) {

        }

    }
}
module.exports = ImageHelper;
