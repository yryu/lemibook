<template>
  <div class="bookdetail paddingtop">
    <v-header :title="title"></v-header>
    <v-loading v-if="showLoading"></v-loading>
    <div v-else>
      <div class="book">
        <div class="book-main border-1px">
          <div class="book-detail">
            <div class="book-img"><img width="78" height="105" :src="book.src" alt=""></div>
            <div class="book-info">
              <div class="name">{{book.name}}</div>
              <div class="author">{{book.author}}</div>
              <div class="createDate">发布时间：{{book.createDate}}</div>
              <div class="updateDate">更新时间：{{book.updateDate}}</div>
              <div class="status red">{{book.status}}</div>
            </div>
          </div>
          <div class="book-btn">
            <div class="btn bindRel" @click="addToBookShelf">{{book.bindRel}}</div>
            <router-link class="btn readCatelogId" :to="book.href">{{book.readCatelogText}}</router-link>
          </div>
        </div>
        <div class="book-abstracts border-1px">{{book.abstracts}}</div>
      </div>
      <div class="catalogs">
        <div class="subtitle">
          <div class="name">目录</div>
          <div class="more">更多</div>
        </div>
        <div class="content">
          <ul>
            <li v-for="(item, index) in catelogs">
              <a href="">第{{index + 1}}章：{{item.name}}</a>
              <span class="red">{{item.priceNum}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header';
  import loading from 'components/loading/loading';
  import httpRequest, {getUserId, formatDate} from 'common/js/util';
  import api from 'common/js/api';
  import storage from 'good-storage';

  export default {
    data () {
      return {
        title: '书籍详情',
        showLoading: true,
        params: {
          id: this.$route.params.bookId,
          userId: getUserId()
        },
        book: {},
        catelogs: [],
        comments: []
      };
    },
    components: {
      'v-header': header,
      'v-loading': loading
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.name = from.name;
      });
    },
    created() {
      this.$nextTick(() => {
        storage.set('bookId', this.$route.params.bookId);
        this.loadData();
      });
    },
    activated() {
      this.$nextTick(() => {
        if (storage.get('bookId') !== this.$route.params.bookId) {
          storage.set('bookId', this.$route.params.bookId);
          this.initData();
          this.loadData();
        } else if (this.name === 'login') {
          this.params.userId = getUserId();
          this.initData();
          this.loadData();
        }
      });
    },
    methods: {
      initData() {
        this.showLoading = true;
        this.params.id = this.$route.params.bookId;
        this.book = {};
        this.catelogs = [];
        this.comments = [];
      },
      loadData() {
        httpRequest(api.bookDetail, this.params, (res) => {
          if (res.success) {
            this.showLoading = false;
            let data = res.data;
            let {book, catelogs, comments} = data;
            book.createDate = formatDate(book.createDate);
            book.updateDate = formatDate(book.updateDate);
            if (book.status === 1) {
              book.status = '已完结';
            } else {
              book.status = '连载中';
            }
            if (book.bindRel === 1) {
              book.bindRel = '已在书架';
            } else {
              book.bindRel = '加入书架';
            }
            let bookId = this.$route.params.bookId;
            if (book.readCatelogId) {
              book.href = {name: 'bookreader', params: {bookId, catelogId: book.readCatelogId}};
              book.readCatelogText = '继续阅读';
            } else {
              book.href = {name: 'bookreader', params: {bookId, catelogId: catelogs[0].id}};
              book.readCatelogText = '免费阅读';
            }
            catelogs.forEach(function (val, index) {
              if (val.priceNum) {
                val.priceNum = val.priceNum + '书豆';
              } else {
                val.priceNum = '免费';
              }
            });
//            if (comments.length > 0) {
//              comments.forEach(function (val, index) {
//                val.createDate = formatDate(val.createDate);
//              });
//              _this.usrcomments = comments;
//            }
            this.book = book;
            this.catelogs = catelogs;
            this.comments = comments;
          } else {
            this.$toasted.show(res.message, {duration: 2000});
          }
        });
      },
      addToBookShelf() {
        if (!getUserId()) {
          this.$router.push({path: '/login'});
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .bookdetail
    background: #fff
    .book
      .book-main
        padding: $padding 10px
        border-1px(#ddd)
        .book-detail
          font-size: 0
          .book-img
            display: inline-block
            vertical-align: top
            margin-right: 15px
          .book-info
            display: inline-block
            font-size: 12px
            color: #999
            & > div
              margin-bottom: 9px
              &:last-child
                margin: 0
            .name
              font-size: 16px
              color: #000
              margin: 2px 0 10px
        .book-btn
          padding: 15px 0 0
          text-align: center
          font-size: 0
          & > .btn
            display: inline-block
            width: 86px
            height: 32px
            line-height: 32px
            font-size: 14px
            text-align: center
            border: $red 1px solid
            border-radius: 50px
          .bindRel
            color: $red
            margin: 0 100px 0 0
          .readCatelogId
            color: #fff
            background: $red
      .book-abstracts
        padding: $padding 10px
        border-1px(#ddd)
        line-height: 1.6
        text-align: justify
        text-indent: 2em
    .catalogs
      .subtitle
        display: flex
        padding: $padding 10px
        justify-content: space-between
        .name
          font-size: 15px
      .content
        padding: 0 10px $padding
        li
          display: flex
          justify-content: space-between
          line-height: 2
</style>
