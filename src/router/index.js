import Vue from 'vue';
import Router from 'vue-router';
import VueCookie from 'vue-cookie';
import Toasted from 'vue-toasted';
import index from 'components/index/index';
import login from 'components/login/login';
import ranking from 'components/ranking/ranking';
import bookdetail from 'components/bookdetail/bookdetail';
import bookreader from 'components/bookreader/bookreader';

Vue.use(Router);
Vue.use(VueCookie);
Vue.use(Toasted);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: ranking
    },
    {
      path: '/bookdetail/:bookId',
      name: 'bookdetail',
      component: bookdetail
    },
    {
      path: '/bookreader/:bookId/:catelogId',
      name: 'bookreader',
      component: bookreader
    }
  ]
});
