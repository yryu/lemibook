<template>
  <div class="ranking">
    <v-header :title="title"></v-header>
    <v-loading v-if="showLoading"></v-loading>
    <div v-else class="ranking-body">
      <ul class="tabs">
        <li @click="changeTab(2)" class="tab" :class="{cur:params.searchType==2}">人气榜</li>
        <li @click="changeTab(3)" class="tab" :class="{cur:params.searchType==3}">热销榜</li>
        <li @click="changeTab(4)" class="tab" :class="{cur:params.searchType==4}">收藏榜</li>
      </ul>
      <div class="list" ref="listWrapper">
        <ul>
          <li v-for="item in rankingList">
            <router-link :to="item.href" class="list-item">
              <div class="item-img"><img width="70" height="93" :src="item.src" alt=""></div>
              <div class="item-body">
                <div class="item-name">{{item.bookName}}</div>
                <div class="item-desc">
                  <span v-show="item.bookTag" class="booktag">{{item.bookTag}}</span>
                  <span class="author">{{item.author}}</span>
                  <!--<span class="status" :class="item.status === '已完结' ? 'orange' : 'green'">{{item.status}}</span>-->
                </div>
                <p class="item-abstract">{{item.abstracts}}</p>
              </div>
            </router-link>
          </li>
        </ul>
        <div v-show="noData">数据已加载完</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header';
  import loading from 'components/loading/loading';
  import BScroll from 'better-scroll';
  import httpRequest from 'common/js/util';
  import api from 'common/js/api';

  export default {
    data() {
      return {
        title: '排行榜',
        rankingList: [],
        params: {
          pageSize: 5,
          pageNo: 1,
          searchType: 2
        },
        noData: false,
        showLoading: true,
        pageTotal: 1
      };
    },
    components: {
      'v-header': header,
      'v-loading': loading
    },
    created() {
      this.$nextTick(() => {
        this.loadData();
      });
    },
    activated() {
      this.$nextTick(() => {
        if (this.params.searchType !== 2) {
          this.initData();
          this.loadData();
        }
      });
    },
    methods: {
      initData() {
        this.rankingList = [];
        this.params.pageNo = 1;
        this.params.searchType = 2;
        this.noData = false;
        this.showLoading = true;
        this.scroll = false;
      },
      _initData() {
        this.rankingList = [];
        this.params.pageNo = 1;
        this.noData = false;
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.listWrapper, {
            click: true,
            probeType: 3
          });
          this.scroll.on('scrollEnd', () => {
            // 滚动到底部
            if (this.params.pageNo < this.pageTotal) {
              if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                this.params.pageNo++;
                this.loadData();
              }
            } else {
              this.noData = true;
            }
          });
        } else {
          this.scroll.refresh();
        }
      },
      loadData() {
        httpRequest(api.bookSearch, this.params, (res) => {
          if (res.success) {
            this.showLoading = false;
            let data = res.data;
            let content = data.content;
            this.pageTotal = data.pageTotal;
            if (content.length > 0) {
              let totalData = [];
              content.forEach(function (val, index) {
                let {bookId, src, bookName, bookTag, author, abstracts} = val;
                let temp = {
                  href: {
                    name: 'bookdetail',
                    params: {
                      bookId
                    }
                  },
                  src,
                  bookName,
                  bookTag,
                  author,
                  abstracts
                };
                totalData.push(temp);
              });
              this.rankingList = this.rankingList.concat(totalData);
              this.$nextTick(() => {
                this._initScroll();
              });
            } else {
              console.log('error');
            }
          }
        });
      },
      changeTab(type) { // 人气榜、热销榜、收藏榜切换
        this._initData();
        this.params.searchType = type;
        this.loadData();
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  html, body
    height: 100%

  .container
    height: 100%
    .ranking
      height: 100%
      background: #fff
      padding-top: $h44 * 2
      .ranking-body
        background: #fff
        .tabs
          position: fixed
          top: $h44
          left: 0
          z-index: $zIndex
          display: flex
          width: 100%
          height: $h44
          line-height: $h44
          background: #fff
          border-bottom: #ccc 1px solid
          padding: 0 15px
          .tab
            flex: 1
            font-size: 14px
            text-align: center
            margin: 0 10px
            &.cur
              height: 44px
              border-bottom: $color 2px solid
        .list
          position: fixed
          top: $h44 * 2
          bottom: 0
          width: 100%
          background: #fff
          overflow: hidden
          .list-item
            display: flex
            padding: 15px 10px
            border-bottom: #eee 1px solid
            .item-img
              flex: 0 0 90px
              width: 90px
            .item-body
              flex: 1
              position: relative
              padding-left: 0
              overflow: hidden
              .item-name
                font-size: 16px
                color: #000
                margin: 2px 0 10px
                ofh()
              .item-desc
                position: relative
                font-size: 0
                .booktag, .author
                  display: inline-block
                  font-size: 12px
                .booktag
                  position: relative
                  margin-right: 10px
                  padding-right: @margin-right
                  &:before
                    content: ''
                    position: absolute
                    top: 1px
                    right: 0
                    width: 1px
                    height: 12px
                    background: #ccc
                .status
                  position: absolute
                  top: 0
                  right: 0
                  font-size: 12px
              .item-abstract
                position: absolute
                left: @padding-left
                bottom: 0
                height: 32px
                line-height: 1.4
                text-align: justify
                overflow: hidden
</style>
