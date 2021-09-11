const fs = require('fs');
const path = require('path');
class FileHelper {
  static ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    fs.mkdirSync(dirname);
  }

  static removeFile(paths) {
    fs.lstat(paths, function (err, stats) {
      if (err) {
        //console.log(err);
        return;
      }
      if (stats.isFile()) {
        console.log('Remove image ', paths);
        fs.unlinkSync(paths);
      }
    });
  };

  static convertFileName(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '_');
  };

  static isImage(path) 
  {
   
  }
}
module.exports = FileHelper;