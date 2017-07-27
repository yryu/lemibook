<template>
  <div class="showLoading">
    <img width="30" height="30" src="static/img/loading.gif" alt="">
    <p class="text">正在加载...</p>
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
  @import '../../common/stylus/mixin.styl';

  .showLoading
    position: fixed
    top: 0
    left: 0
    z-index: $zIndex - 1
    width: 100%
    height: 100%
    background: #fff
    color: #fff
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    .text
      color: #999
      margin-top: 10px
</style>
