/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


exports.response = function (res, status, data) {
  if(data.error && status == 500){

  }
  return res.status(status).json(data);
};
