<template>
  <div class="footer backTop">
    <a href="index.html">首页</a>
    <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=3460818362&site=qq&menu=yes">客服</a>
    <a href="pay.html">充值</a>
    <a href="javascript:;">回到顶部</a>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {};
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .footer
    width: 100%
    padding: 20px 0
    border-top: 2px $color solid
    background: #fff
    text-align: center
    a
      font-size: 14px
      padding: 0 12px
</style>
