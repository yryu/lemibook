<template>
  <div class="header">
    <div class="logo">
      <a class="logo-link" href="index.html">
        <img width="30" height="30" src="static/img/favicon.ico" alt=""/>
        <span class="logo-txt">夜读小说</span>
      </a>
    </div>
    <div class="login">
      <div v-if="isLogin">
        <a class="btn bookshelf-btn" href="bookshelf.html">书架</a>
        <a class="btn user-btn" href="user/index.html">我的</a>
      </div>
      <div v-else>
        <router-link class="btn login-btn" to="/login">登录</router-link>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      isLogin: {
        type: Boolean
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  $h30 = 30px
  .header
    width: 100%
    height: $h44
    background: $color
    padding: 0 $padding
    display: flex
    .logo
      flex: 1
      .logo-link
        display: block
        height: $h30
        line-height: $h30
        margin-top: (($h44 - $h30) / 2)
        color: #fff
        font-size: 0
        .logo-txt
          font-size: 16px
          vertical-align: top
          margin-left: 8px
    .login
      flex: 1
      text-align: right
      font-size: 0
      .btn
        display: inline-block
        width: 50px
        height: $h30
        line-height: ($h30 - 2)
        border: 1px solid #fff
        text-align: center
        color: #fff
        font-size: 14px
        margin-top: (($h44 - $h30) / 2)
        &.bookshelf-btn
          margin-right: -1px
</style>
