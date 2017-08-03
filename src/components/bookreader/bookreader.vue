<template>
  <div class="bookreader">
    <v-loading v-if="showLoading"></v-loading>
    <div v-else>
      <div class="free">
        <div class="addToBookShelf" @click="addToBookShelf">加入书架</div>
        <div class="free-wrap" @click="showHeadWrap">
          <div class="free-title" :style="{fontSize: (fontSize + 8) + 'px'}">
            第{{read.indexinfo}}章<span>{{read.name}}</span>
          </div>
          <div v-show="chapter_content" :style="{fontSize: fontSize + 'px'}" class="free-content"
               v-html="chapter_content"></div>
          <!--<div v-if="showRecommend">-->
          <!--<div class="free-recommend" v-if="recommend.href != undefined">-->
          <!--<a :href="recommend.href">【{{recommend.bookName}}】-->
          <!--{{recommend.bookRecommend}}</a>-->
          <!--</div>-->
          <!--</div>-->
        </div>
        <!--<div class="free-chapter clearfix" :class="{hide:read.url == undefined}">-->
        <!--<a v-if="this.read.previousId" class="prev fl" href="javascript:;" @click="prev">上一章</a>-->
        <!--<a v-if="this.read.nextId" class="next fr" href="javascript:;" @click="next">下一章</a>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import loading from 'components/loading/loading';
  import httpRequest, {httpRequest2, getUserId} from 'common/js/util';
  import api from 'common/js/api';
  import storage from 'good-storage';

  export default {
    data () {
      return {
        params: {
          book_id: this.$route.params.bookId,
          catelog_id: this.$route.params.catelogId,
          userId: getUserId()
        },
        showLoading: true,
        chapter_content: '',
        fontSize: 20
      };
    },
    components: {
      'v-loading': loading
    },
    created() {
      this.$nextTick(() => {
        storage.set('catelogId', this.$route.params.catelogId);
        this.getReaderContent();
      });
    },
    activated() {
      this.$nextTick(() => {
        if (storage.get('catelogId') !== this.$route.params.catelogId) {
          storage.set('catelogId', this.$route.params.catelogId);
          this.initData();
          this.getReaderContent();
        }
      });
    },
    methods: {
      addToBookShelf() {

      },
      initData() {
        this.showLoading = true;
        this.params.book_id = this.$route.params.bookId;
        this.params.catelog_id = this.$route.params.catelogId;
        this.chapter_content = '';
        this.fontSize = 20;
      },
      getReaderContent() { // 获取阅读内容
        httpRequest(api.read, this.params, (res) => {
          if (res.success) { // 免费章节
            this.showLoading = false;
            // this.getRecommendData();
            this.getReaderDetail(res.data);
          } else { // 该章节为付费章节，请先购买书籍
            console.log('该章节为付费章节，请先购买书籍');
//            this.showBuyCont = true;
//            res.data.indexinfo = numConvert(res.data.indexinfo);
//            this.chapter = res.data;
//            if (getLoginUser() == null) { // 未登录
//              this.isLogin = false;
//            } else {
//              this.isLogin = true;
//              this.getUserLeaveNum();
//            }
          }
        });
      },
      getReaderDetail(data) {
        // this.showBuyCont = false;
        // this.showFixed = false;
        this.read = data;
        httpRequest2(data.url, (res) => {
          if (res.status === 200) { // 免费章节
            let array = res.data.split('\r\n');
            let str = '';
            for (let i = 0; i < array.length; i++) {
              str += '<p>' + array[i] + '</p>';
            }
            this.chapter_content = str;
            // 滚动到顶部
            // $('html,body').animate({scrollTop: 0}, 5);
          } else {
            this.$toasted.show(res.message, {duration: 2000});
          }
        });
      },
      showHeadWrap() {

      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .bookreader
    background: #fff
    .free
      .addToBookShelf {
        position: fixed
        right: -50px
        bottom: 110px
        background: rgba(0, 0, 0, 0.6)
        width: 120px
        height: 36px
        line-height: 36px
        padding: 0 0 0 14px
        color: #fff
        border-radius: 20px
      }
      .free-wrap {
        padding: 0 $padding 80px
        .free-title {
          padding: 40px 0 22px
          font-size: 22px
          text-align: center
          color: #000
          font-weight: bold
          span {
            margin: 0 0 0 15px
          }
        }
        .free-content {
          font-size: 18px
          p {
            margin: 18px 0 0
            line-height: 1.7
            text-indent: 2em
            color: #333
            text-align: justify
            letter-spacing: 1px
          }
        }
        .free-recommend {
          padding: 20px 0
          a {
            color: #bb884b
            display: block
            font-size: 14px
            text-align: justify
          }
        }
      }
</style>
