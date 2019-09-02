<template>
  <div></div>
</template>

<script>
import axios from "axios";
import utils from "./assist";
import qs from "qs";
import crypto from "crypto";
import { log } from "util";

export default {
  name: "httpClient",
  data() {
    return {
      key: "ZLWWWEIXINCUSTOM",
      secret: "kiedshsd0xs3f2",
      baseURL: process.env.baseURL
    };
  },
  methods: {
    // md5加密
    md5(text) {
      return crypto
        .createHash("md5")
        .update(text)
        .digest("hex");
    },
    //get请求方法
    get: function(path, params, onSuccess, onError) {
      var token = JSON.parse(unescape(utils.getCookie("token")));
      var time = Date.parse(new Date());
      var sign = this.md5(this.key + this.secret + time + token);
      var instance = axios.create({
        baseURL: this.baseURL,
        headers: { key: this.key, time: time, token: token, sign: sign }
      });
      var getRequest = instance.get(path, {
        params: params,
        ran: Math.random()
      });
      if (onSuccess || onError) {
        getRequest
          .then(response => {
            var code = response.data.code;
            if ([1].includes(code)) {
              console.log("接口回调成功");
              onSuccess(response.data);
            } else {
              setTimeout(() => {
                this.$dialog.toast({
                  mes: response.data.msg,
                  timeout: 1200
                });
              }, 500);
            }
          })
          .catch(error => {
            onError(error);
          });
      }
      return getRequest;
    },
    // post请求方法
    post: function(path, params, onSuccess, onError) {
      var token = JSON.parse(unescape(utils.getCookie("token")));
      var params = qs.stringify(params);
      var time = Date.parse(new Date());
      var sign = this.md5(this.key + this.secret + time + token);
      var instance = axios.create({
        baseURL: this.baseURL,
        headers: { token: token, key: this.key, time: time, sign: sign }
      });
      var postRequest = instance.post(path, params);
      if (onSuccess) {
        postRequest
          .then(response => {
            var code = response.data.code;
            if ([1].includes(code)) {
              console.log("接口回调成功");
              onSuccess(response.data);
            } else {
              setTimeout(() => {
                this.$dialog.toast({
                  mes: response.data.msg,
                  timeout: 1200
                });
              }, 500);
            }
          })
          .catch(error => {
            onError(error);
          });
      }
      return postRequest;
    }
  }
};
</script>

<style scoped>
</style>