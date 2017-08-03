<template>
  <div class="login paddingtop">
    <v-header :title="title"></v-header>
    <div class="login-wrapper">
      <div class="login-body">
        <div class="login-item border-1px">
          <i class="iconfont icon-user"></i>
          <input type="text" name="username" maxlength="30" placeholder="请输入手机号" class="txt"
                 v-model.number.trim="phone">
        </div>
        <div class="login-item">
          <i class="iconfont icon-lock"></i>
          <input type="text" name="text" maxlength="30" placeholder="请输入验证码" class="txt"
                 v-model.trim="code">
          <button class="getcode" :class="{gray: isCounting}" type="button" @click="sendCode">{{codeText}}</button>
        </div>
      </div>
      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header';
  import {checkPhone} from 'common/js/regexp';
  import httpRequest from 'common/js/util';
  import api from 'common/js/api';
  import config from 'common/js/config';

  export default {
    data() {
      return {
        title: '登录',
        phone: '',
        code: '',
        isCounting: false,
        count: 60,
        codeText: '获取验证码'
      };
    },
    components: {
      'v-header': header
    },
    activated() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.path = from.path;
      });
    },
    methods: {
      initData() {
        this.phone = '';
        this.code = '';
        this.isCounting = false;
        this.count = 60;
        this.codeText = '获取验证码';
      },
      sendCode() {
        if (this.isCounting) { // 重复点击获取验证码
          return;
        }
        if (this.phone.length <= 0) {
          this.$toasted.show('手机号不能为空', {duration: 2000});
          return;
        }
        this.count = 60;
        if (checkPhone(this.phone)) {
          httpRequest(api.sendCode, {phone: this.phone}, (res) => {
            if (res.success) {
              this.$toasted.show('验证码发送成功', {duration: 2000});
              this.isCounting = true;
              this.startTimer();
            } else {
              this.$toasted.show(res.message, {duration: 2000});
              self.isCounting = false;
            }
          });
        } else {
          this.$toasted.show('手机号不正确', {duration: 2000});
        }
      },
      startTimer() {
        this.intervalProcess = setInterval(() => {
          this.count--;
          if (this.count < 0) {
            clearInterval(this.intervalProcess);
            this.isCounting = false;
            this.codeText = '获取验证码';
          } else {
            this.codeText = '(' + this.count + 's)';
          }
        }, 1000);
      },
      login: function () {
        if (this.phone.length <= 0) {
          this.$toasted.show('手机号不能为空', {duration: 2000});
          return;
        }
        if (this.code.length <= 0) {
          this.$toasted.show('验证码不能为空', {duration: 2000});
          return;
        }
        if (checkPhone(this.phone)) {
          httpRequest(api.login, {
            phone: this.phone,
            smsCode: this.code
          }, (res) => {
            if (res.success) {
              this.$toasted.show('登录成功', {duration: 2000});
              let user = res.data;
              let jsonS = JSON.stringify(user);
              this.$cookie.set('user', jsonS, {expires: 7, domain: config.wexinData.domain});
              // 跳转回之前的页面
              this.$router.push(this.path);
            } else {
              this.$toasted.show(res.message, {duration: 2000});
              this.code = '';
            }
          });
        } else {
          this.$toasted.show('手机号不正确', {duration: 2000});
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .login
    .login-wrapper
      padding: 25px 10px 0
      .login-body
        height: $h44 * 2
        background: #fff;
        border-radius: 4px
        .login-item
          display: flex
          height: $h44
          line-height: $h44
          padding: 0 $padding
          position: relative
          &:first-child
            border-1px(#ccc)
          .iconfont
            width: 30px
            flex: 0 0 @width
            color: #999
          input
            flex: 1
            font-size: 14px
          .getcode
            width: 72px
            height: 32px
            padding: 0
            position: absolute
            top: (($h44 - @height) / 2)
            right: 10px
            background: $color
            border: none
            color: #fff
            text-align: center
            font-size: 12px
            &.gray
              background: #ccc
      .login-btn
        height: $h44
        line-height: $h44
        text-align: center
        border-radius: 4px
        font-size: 16px
        background: $green
        color: #fff
        margin: $padding 0 0
</style>
