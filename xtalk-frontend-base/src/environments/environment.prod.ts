export const environment = {
  maxAudioFileSize:1024*1024*10,//10 mb
  production: false,
  appTitle:'Luck Telling',
  apiUrl:'https://admin.fortune-telling.co',
  socketUrl:'https://admin.fortune-telling.co',
  ccbill_mode:'TEST',
  baseUrl:"https://fortune-telling.co",
  ccbill_endpoint:'https://sandbox-api.ccbill.com/wap-frontflex/flexforms/',
  reCaptchaSiteKey:'6Lfn30wbAAAAADvXbFajQtV5dtTM416ID0kKR9RO',
  reCaptchaSecretKey:'6Lfn30wbAAAAAIDMLLWmL0EZWLcmG-1WCGCG8lyz',
  maxLenghtText:255,
  maxLenghtPhone:15,
  minLengthPass:8,
  uploadUrl:'https://admin.fortune-telling.co/api/v1/upload/',
  imageSize:{
    thumbnail:{
      width:200,
      height:250,
    },
    medium:{
      width:250,
      height:350,
    },
    big:{
      width:350,
      height:450,
    },
  }
};
