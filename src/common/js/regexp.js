/*
 * 验证手机号
 */
function checkPhone(str) {
  var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}

export {checkPhone};
