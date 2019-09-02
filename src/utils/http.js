/**
 * Created by yuppy on 2017/11/10.
 */
import axios from 'axios'
import utils from './assist'
import qs from 'qs';
import crypto  from 'crypto'

var key = 'ZLWWWEIXINCUSTOM'
var secret = 'kiedshsd0xs3f2'
// md5加密
function md5 (text) {
    return crypto.createHash('md5').update(text).digest('hex')
  };
export default{
    /**
     * get请求
     * @param path
     * @param params
     * @param onSuccess
     * @param onError
     */
    get:function(path, params, onSuccess, onError){
        var token = JSON.parse(unescape((utils.getCookie('token'))));
        var time = Date.parse(new Date())
        var sign = md5(key+secret+time+token)
        var instance = axios.create({
          headers: {'key':key,'time':time,'token':token,'sign':sign}
        });
        var getRequest = instance.get(path, {params :params});
        if (onSuccess || onError) {
            getRequest.then(function (response) {
                var code = response.data.code
                debugger;
                if(code=='1011'){
                    utils.delCookie('token')
                    window.location.href = "http://iot.m.zlwwtech.com/login"
                }else if(!(code=='0000'||code=='0007')){
                    this.$dialog.toast({
                        mes: response.data.msg,
                      })
                }else{
                    onSuccess(response.data);
                }
            }).catch(function (error) {
                onError(error);
            });
        }
        return getRequest;
    },
    /**
     * post请求
     * @param path
     * @param params
     * @param onSuccess
     * @param onError
     * @returns {*|AxiosPromise}
     */
    post:function(path, params, onSuccess, onError) {
        var token = JSON.parse(unescape((utils.getCookie('token'))));
        var params = qs.stringify(params);
        var time = Date.parse(new Date())
        var sign = md5(key+secret+time+token)
        var instance = axios.create({
            headers: {'token': token,'key':key,'time':time,'sign':sign}
          });
        var postRequest = instance.post(path, params);
        if (onSuccess) {
            postRequest.then(function (response) {
                var code = response.data.code
                if(code=='1011'){
                    utils.delCookie('token')
                    window.location.href = "http://iot.m.zlwwtech.com/login"
                }else if(!(code=='0000'||code=='0007')){
                    this.$dialog.toast({
                        mes: response.data.msg,
                      })
                }else{
                    onSuccess(response.data);
                }
            })
        }
        if (onError) {
            postRequest.catch(function (error) {
                onError(error);
            });
        }
        return postRequest;
    },
}
