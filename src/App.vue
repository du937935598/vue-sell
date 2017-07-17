<template>
  <div id="app">
    <!-- /header -->
    <v-header :seller="seller"></v-header>
    <!--/tab-->
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- keep-alive状态完全被保存，能减少消耗，减少后台的访问 -->
    <keep-alive>
    <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import {urlParse} from './common/js/util.js'
import header from './components/header/header.vue'
// 创建一个常量
const ERR_OK = 0

export default {
  name: 'app',
  data () {
    return {
      seller: {
        // 获取到链接里面的参数（比如说需要进入到这个页面需要在连接上面拼接这个页面的id和其他带入的参数）
        id: (() => {
          // urlParse()是使用了util.js中的方法
          let queryParam = urlParse()
          // 然后再返回id
          return queryParam.id
        })()
      }
    }
  },
  // 获取数据
  created () {
    // 这个调用了页面初始化的时候使用的urlParse()方法的出来的id
    this.$http.get('/api/seller?id=' + this.seller.id).then(response => {
      // 数据的格式化
      response = response.body
      if (response.errno === ERR_OK) {
        // this.seller = response.data
        // 当前数据源
        this.seller = Object.assign({}, this.seller, response.data)
      }
    })
  },
  // 这个是header模板
  components: {
    'v-header': header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mimin.styl"
  .header
    // background #000
    // color #fff
  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      text-align center
      &>a
        display block
        text-decoration none
        font-size 14px
        color rgb(77,85,93)
        &.router-link-active
          color rgb(240,20,20)
</style>
