const CryptoJS = require("crypto-js");

export function base64UrlEncode(str: string) {
    var encodedSource = CryptoJS.enc.Base64.stringify(str);
    var reg = new RegExp('/', 'g');
    encodedSource = encodedSource.replace(/=+$/,'').replace(/\+/g,'-').replace(reg,'_');
    return encodedSource;
}
//解析jwt令牌，获取用户信息
export function my_decode(jwt: string) {
   let strings = jwt.split("."); //截取token，获取载体
   var userinfo = JSON.parse(decodeURIComponent(escape(window.atob(strings[1].replace(/-/g, "+").replace(/_/g, "/")))));
   return userinfo
}
export function can_do_something(jwt: string | undefined, optype: string){
    var userinfo = my_decode(jwt);
    var now_time = new Date().getTime();
	console.log(now_time);
	if(now_time<userinfo.nbf){
        if(optype === 'login'){
            if(userinfo.sub === 1){
		        console.info('permit!');
                return 1;
            }
            return 0;
        }
	}
	else {
		console.info('never!');
        return 0;
	}
}
export function generateToken(secretSalt: string, sub: number) {
   let header = JSON.stringify({
   "alg": "HS256",
   "typ": "JWT"
   })
   var iat = new Date().getTime()
   var nbf = iat + 2*60*60*1000
   console.log(iat);
   console.log(nbf);
   let payload =JSON.stringify({
       "sub": sub,
       "iat": iat,
       "nbf": nbf,
   })
   let before_sign = base64UrlEncode(CryptoJS.enc.Utf8.parse(header)) + '.' + base64UrlEncode(CryptoJS.enc.Utf8.parse(payload));
   let signature =CryptoJS.HmacSHA256(before_sign, secretSalt);
   signature = base64UrlEncode(signature);
   let final_sign = before_sign + '.' + signature;
   return final_sign;
}
//loginJson就是用户登录时的账号和密码{"username" : "admin", "password" : "ant.design"},返回权限种类
export function authAccess(loginJson: {username: string, password: string}) {
   var username = loginJson.username;
   var password = loginJson.password;
   if(username === "admin" && password == 'ant.design') {
       //权限设置为1
       return 1;
   }
   else if(username === "user" && password == 'ant.design'){
       return 2;
   }
   return 0;
}
           
export function makeJwt(loginJson: {username: string, password: string}){
   var sub = authAccess(loginJson);
   let retJwt = generateToken("itistrulysafe", sub);
   return retJwt;
}

