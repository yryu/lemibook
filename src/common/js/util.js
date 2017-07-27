import config from 'common/js/config';
import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';

/**
 * axios封装
 * @url url
 * @params 参数
 * @callback 回调
 */
function httpRequest(url, params, callback) {
  axios.defaults.baseURL = config.Host;
  axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded;'
  };
  let token = getLoginToken();
  if (token) params.token = token;
  axios.post(url, qs.stringify(params)).then((res) => {
    callback(res.data);
  }).catch((error) => {
    console.log(error);
  });
}

/**
 * axios封装get请求
 * @url url
 * @params 参数
 * @callback 回调
 */
function httpRequest2(url, callback) {
  axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded;'
  };
  axios.get(url).then((res) => {
    callback(res);
  }).catch((error) => {
    console.log(error);
  });
}

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}

/**
 * add a zero in front of numbers < 10
 */
function checkTime(i) {
  if (i < 10) i = '0' + i;
  return i;
}

/**
 * 格式化时间 yyyy-mm-dd
 */
function formatDate(value) {
  var today = new Date(value);
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  month = checkTime(month);
  date = checkTime(date);
  return [year, month, date].join('-');
}

/**
 * 用户信息 user
 */
function getLoginUser() {
  let user = Vue.cookie.get('user');
  if (user !== null && user !== '') {
    let parseUser = JSON.parse(user);
    return parseUser;
  }
  return null;
}

/**
 * 令牌 token
 */
function getLoginToken() {
  let user = getLoginUser();
  if (user === null || user === 'undefined') {
    return null;
  } else {
    return user.token;
  }
}

/**
 * 用户 userId
 */
function getUserId() {
  var user = getLoginUser();
  if (user === null || user === 'undefined') {
    return null;
  }
  return user.id;
}

export default httpRequest;
export {httpRequest2, urlParse, formatDate, getLoginUser, getUserId};
