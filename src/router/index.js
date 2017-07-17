// ����·��ģ�鲢ʹ����
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// ����·��ʵ��������·��ӳ��
// path:'*',redirect:'/home'  �ض���path��/home��ӳ��
const router = new VueRouter({
  routes: [{
    path: '/goods',
    component: require('../components/goods/goods.vue')
  }, {
    path: '/ratings',
    component: require('../components/ratings/ratings.vue')
  }, {
    path: '/seller',
    component: require('../components/seller/seller.vue')
  }, {
    path: '*',
    redirect: '/goods'
  }]
})

// ���router
export default router

