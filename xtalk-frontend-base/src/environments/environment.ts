// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  maxAudioFileSize:1024*1024*10,//10 mb
  production: true,
  appTitle:'Xtalk',
  apiUrl:'http://localhost:9110',
  socketUrl:'http://localhost:9110',
  ccbill_mode:'TEST',
  baseUrl:"http://localhost:4200",
  ccbill_endpoint:'https://api.ccbill.com/wap-frontflex/flexforms/',
  reCaptchaSiteKey:'6LcDV8oZAAAAACAXKcAwfiBbfLTj7_w2z6eqWV82',
  reCaptchaSecretKey:'6LcDV8oZAAAAAKENXTjopthvmHatOz7G_HTVX5Lv',
  maxLenghtText:255,
  maxLenghtPhone:15,
  minLengthPass:8,
  uploadUrl:'http://localhost:9110/api/v1/upload/',
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
