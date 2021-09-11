/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var crypto = require('crypto-js');
const cryptoDefault = require('crypto');


class HashDataHelper {
  static genRandomString(length) {
    return cryptoDefault.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
  }

  static sha512(string, salt) {
    var hash = cryptoDefault.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(string);
    var value = hash.digest('hex');
    return {
      salt: salt,
      passwordHash: value
    };
  }
  static saltHash(string) {
    var salt = this.genRandomString(16); /** Gives us salt of length 16 */
    var result = this.sha512(string, salt);
    return result;
  }

  static make(data, status = true, error, msg) {
    var res = {};
    res.status = status;
    res.msg = msg;

    res.data = data;
    if (data && data.token) {
      res.token = data.token;
    }
    res.error = error;
    return res;
  }
  static makebk(data, status = true, error, msg) {
    var res = {};
    res.status = status;
    res.msg = msg;
    var encrypt = crypto.AES.encrypt(JSON.stringify(data), '(H+MbQeThWmZq3t6w9z$C&F)J@NcRfUj');

    res.data = data;
    // res.test = data;
    res.error = error;
    return res;
  }

  static makeDataTable(data, query) {

    var res = {};
    res.data = data.results;
    res.draw = query.draw;
    res.recordsFiltered = data.total;
    res.recordsTotal = data.total;

    return res;
  }
  static makeError(data) {

    var res = {};
    res.status = data.status ? data.status : 500;
    res.msg = data.msg ? data.msg : 'Lỗi hệ thống';
	

    if (data.error ) {
	
		for (var errName in data.error.errors) {
			if(errName == 'message'){
				
			}
			console.log('data.error[errName]',typeof data.error[errName]);
			if(typeof data.error.errors[errName] =='object'){
				res.msg = data.error.errors[errName].message;
			}
		
      }
       
     
    }
     if(data.status == 500){
     
    }
    res.data = null;
    res.error = data.error;
    return res;
  }
  static decode(response) {
    return response.requestBody;
  }
}
;
module.exports = HashDataHelper;