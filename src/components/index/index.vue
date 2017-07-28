<template>
  <div class="index">
    <v-indexHeader :isLogin="isLogin"></v-indexHeader>
    <!-- 最近阅读 -->
    <div v-show="showLately" class="lately border-1px">
      <div class="red">最近阅读</div>
      <a class="text" :href="latelyList.href">{{latelyList.bookName}}</a>
    </div>
    <!-- 轮播 -->
    <div class="swiper">
      <img width="100%" height="150" src="./ban1.jpg" alt="">
    </div>
    <!-- 导航 -->
    <div class="nav-wrapper">
      <ul class="nav">
        <li class="nav-item" v-for="(item,index) in navList">
          <router-link class="nav-link" :to="item.href">
            <p class="nav-icon"><img width="30" height="30" :src="item.src" alt=""></p>
            <p>{{item.name}}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 搜索 -->
    <div class="search-wrapper">
      <a class="search" href="javascript:;">
        <i class="iconfont icon-search"></i>
        <input class="search-input" type="text" placeholder="书名、作者"/>
      </a>
    </div>
    <div class="main">
      <!-- 主编力荐 -->
      <div class="hot" v-for="category in bookList1">
        <div class="hot-title">
          <strong class="title">{{category.name}}</strong>
          <a class="change" href="javascript:;" @click="replace(category.id)">
            <i class="iconfont icon-refresh" :class="{rotate:rotate[category.id]}"></i>换一换
          </a>
        </div>
        <div class="hot-box" v-for="item in bookList1_book">
          <router-link class="hot-content" :to="item.href">
            <div class="content-img"><img class="img" width="90" height="120" :src="item.src" alt=""></div>
            <div class="content-body">
              <div class="name">{{item.name}}</div>
              <div class="desc">
                <span v-show="item.bookTag" class="booktag">{{item.bookTag}}</span>
                <span class="author">{{item.author}}</span>
                <span class="status" :class="item.status === '已完结' ? 'orange' : 'green'">{{item.status}}</span>
              </div>
              <p class="abstract">{{item.abstracts}}</p>
            </div>
          </router-link>
          <div class="hot-list">
            <div class="list" v-for="item in bookList1_books">
              <router-link :to="item.href">
                <div class="list-img">
                  <img width="90" height="120" :src="item.src" alt=""/>
                </div>
                <div class="list-name">{{item.name}}</div>
              </router-link>
            </div>
          </div>
        </div>
        <a class="hot-more" :href="'free.html?categoryId='+category.id">更多<i class="iconfont icon-right"></i></a>
      </div>
      <!-- 万人在读、直播专区、免费热书、新书尝鲜 -->
      <div class="hot recommend" v-for="category in bookList2">
        <div class="hot-title">
          <div class="title">{{category.name}}</div>
          <a class="change" href="javascript:;" @click="replace(category.id)">
            <i class="iconfont icon-refresh" :class="{rotate:rotate[category.id]}"></i>换一换
          </a>
        </div>
        <div class="hot-box" v-for="item in category.books">
          <router-link class="hot-content" :to="item.href">
            <div class="content-img"><img width="70" height="93" :src="item.src" alt=""></div>
            <div class="content-body">
              <div class="name">{{item.name}}</div>
              <div class="desc">
                <span v-show="item.bookTag" class="booktag">{{item.bookTag}}</span>
                <span class="author">{{item.author}}</span>
                <span class="status" :class="item.status === '已完结' ? 'orange' : 'green'">{{item.status}}</span>
              </div>
              <p class="abstract">{{item.abstracts}}</p>
            </div>
          </router-link>
        </div>
        <a class="hot-more" :href="'free.html?categoryId='+category.id">更多<i class="iconfont icon-right"></i></a>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import indexHeader from 'components/header/indexHeader';
  import footer from 'components/footer/footer';
  import httpRequest, {getLoginUser} from 'common/js/util';
  import api from 'common/js/api';

  const navList = [
    {
      href: 'free.html?categoryId=1',
      src: require('./home.png'),
      name: '精选'
    },
    {
      href: 'free.html?categoryId=2',
      src: require('./bookshelf.png'),
      name: '限免'
    },
    {
      href: 'ranking',
      src: require('./paihang.png'),
      name: '排行'
    },
    {
      href: 'bookshop.html',
      src: require('./shuku.png'),
      name: '书库'
    },
    {
      href: 'pay.html',
      src: require('./chongzhi.png'),
      name: '充值'
    }
  ];
  export default {
    data() {
      return {
        banner: [],
        categories: [],
        bookList1: [],
        bookList1_book: [],
        bookList1_books: [],
        bookList2: [],
        bookList2_books: [],
        navList: navList,
        isLogin: false,
        username: '',
        showLoading: true,
        latelyList: [],
        showLately: false,
        rotate: {},
        DetailHost: 'detail.html'
      };
    },
    components: {
      'v-indexHeader': indexHeader,
      'v-footer': footer
    },
    computed: {
      bookList3: function () {
        return this.categories.slice(0, 1);
      }
    },
    created() {
      this.$nextTick(() => {
        this.getBookList();
      });
    },
    methods: {
//      initPage: function () {
//        this.bookList1_book = [];
//        this.bookList1_books = [];
//      },
      getBookList: function () {
        let user = getLoginUser;
        if (user) {
          this.isLogin = true;
          httpRequest(api.userInfo, {
            userId: user.id
          }, (res) => {
            if (res.success) {
              this.showLoading = false;
              let data = res.data;
              let apiUser = data.user;
              let bookId = apiUser.bookId;
              let tempArr = [];
              if (bookId) {
                let bookName = apiUser.bookName;
                let catelogId = apiUser.catelogId;
                this.showLately = !this.showLately;
                let temp = {
                  bookId: bookId,
                  bookName: bookName,
                  catelogId: catelogId,
                  href: 'bookreader.html?book_id=' + bookId + '&catalog_id=' + catelogId
                };
                tempArr.push(temp);
              }
              this.latelyList = tempArr;
            } else {
              console.log(res.message);
            }
          });
        }
        httpRequest(api.bookMain, {}, (res) => {
          if (res.success) {
            this.showLoading = false;
            let {banner, categories} = res.data;
            // 轮播图banner
            if (banner.length > 0) {
              banner.forEach((val, index) => {
                val.href = this.DetailHost + '?book_id=' + val.id;
              });
              this.banner = banner;
            }
            // 书籍列表
            let categoriesLen = categories.length;
            if (categoriesLen > 0) {
              for (let i = 0; i < categoriesLen; i++) {
                let books = categories[i].books;
                books.forEach((val, index) => {
                  val.href = {name: 'bookdetail', params: {bookId: val.id}};
                  val.status = (val.status === 1) ? '已完结' : '连载中';
                  val.abstracts = val.abstracts.substring(0, 40) + '...';
                });
                if (i === 0) { // 精选书籍
                  this.bookList1.push(categories[i]);
                  for (let j = 0; j < books.length; j++) {
                    if (j === 0) {
                      this.bookList1_book.push(books[j]);
                    } else if (j < 4) {
                      this.bookList1_books.push(books[j]);
                    }
                  }
                } else { // 万人在读、直播专区、免费热书、新书尝鲜
                  this.bookList2.push(categories[i]);
                }
              }
            }
          } else {
            console.log('error');
          }
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .lately
    height: $h40
    line-height: $h40
    padding: 0 $padding
    background: #fff
    display: flex
    font-size: 14px
    border-1px($color)
    .red
      flex: 0 0 70px
      width: 70px
    .text
      flex: 1
      ofh()

  .nav-wrapper
    background: #fff;
    padding: 12px 0 13px
    .nav
      display: flex
      .nav-item
        flex: 1
        text-align: center
        .nav-link
          display: block
          .nav-icon
            margin-bottom: 5px

  .search-wrapper
    padding: 0 20px 12px
    background: #fff;
    .search
      position: relative
      display: block
      width: 100%
      height: $h40
      border: #ddd 1px solid;
      font-size: 0
      .icon-search
        position: absolute
        top: (($h40 - 14) / 2)
        left: 40%
        font-size: 14px
      .search-input
        width: 100%
        height: $h40 - 2
        line-height: @height
        font-size: 12px
        padding-left: 46%

  .main
    .hot
      margin-top: 10px
      background: #fff
      padding: 20px 0
      .hot-title
        display: flex
        justify-content: space-between
        padding: 0 10px 10px
        line-height: 16px
        .title
          height: 16px
          font-size: 16px
          color: $red
          border-left: $red 3px solid
          padding-left: 6px
        .change
          font-size: 12px
          .icon-refresh
            font-size: 14px
            vertical-align: middle
            margin-right: 3px
      .hot-box
        padding: 10px
        .hot-content
          display: flex
          .content-img
            flex: 0 0 90px
            width: 90px
          .content-body
            flex: 1
            position: relative
            padding-left: 18px
            overflow: hidden
            .name
              font-size: 16px
              color: #000
              margin: 2px 0 10px
              ofh()
            .desc
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
            .abstract
              position: absolute
              left: @padding-left
              bottom: 0
              line-height: 1.4
              text-align: justify

        .hot-list
          display: flex
          justify-content: space-between
          padding-top: 20px
          .list
            width: 90px
            .list-name
              margin-top: 6px

      .hot-more
        display: block
        margin: 12px auto 0
        text-align: center
        width: 70px
        height: 26px
        line-height: 24px
        border: #ccc 1px solid
        border-radius: 4px
        color: #78787
        .icon-right
          font-size: 12px
      &.recommend
        .hot-box
          .hot-content
            .content-img
              flex: 0 0 70px
              width: 70px
</style>
