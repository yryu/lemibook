<template>
  <div class="header">
    <a href="javascript:history.go(-1);" class="icon">
      <i class="iconfont icon-back"></i>
    </a>
    <div class="title">{{title}}</div>
    <router-link to="/" class="icon right">
      <i class="iconfont icon-home"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .header
    position: fixed
    top: 0
    left: 0
    z-index: $zIndex
    display: flex
    flex-direction: row
    justify-content: space-between
    width: 100%
    height: $h44
    line-height: $h44
    background: $color
    padding: 0 $padding
    color: #fff
    .icon
      width: 50px
      color: #fff
      .icon-home
        font-size: 17px
    .title
      font-size: 16px
</style>
