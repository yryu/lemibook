<template>
  <div class="header">
    <div class="head">
      <a href="javascript:history.go(-1);">返回</a>
      <div class="link">
        <router-link to="/">目录</router-link>
        <router-link to="/" class="home">首页</router-link>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
//    props: {
//      isLogin: {
//        type: Boolean
//      }
//    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .head
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: $h40
    line-height: @height
    padding: 0 $padding
    background: rgba(2, 2, 2, 0.89)
    display: flex
    justify-content: space-between
    & a
      color: #fff
      font-size: 14px
    .link
      font-size: 0
      height: $h40
      line-height: @height
      a
        display: inline-block
        padding: 0 0 0 12px
</style>

