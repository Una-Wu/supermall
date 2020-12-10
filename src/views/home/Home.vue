<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                  @tabClick="tabClick"
                  ref="tabControl1"
                  class="tab-control1"
                  v-show="isShowTab"/>

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            :pull-up-load="true"        
             @scroll="contentScroll"
             @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"/>
      <home-recommend class="home-recommend" :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" 
                  @tabClick="tabClick"
                  ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/common/tabcontrol/TabControl'
  import Scroll from 'components/common/scroll/Scroll'

  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backtop/BackTop'

  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecommend from './childComps/HomeRecommend'
  import FeatureView from './childComps/FeatureView'

  import { getHomeMultidata,getHomeGoods } from 'network/home'
  import { debounce } from 'common/untils.js'

  export default {
    name: "Home",
    components: {
      NavBar,
      TabControl,
      Scroll,
      GoodsList,
      BackTop,
      HomeSwiper,
      HomeRecommend,
      FeatureView
    },
    data(){
      return {
        // result: {},
        banners: [],
        recommends: [],
        goods: {
          'pop': { page:0, list:[] },
          'new': { page:0, list:[] },
          'sell': { page:0, list:[] }
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isShowTab: false
      }
    },
    created() {
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      const refresh = debounce(this.$refs.scroll.refresh, 50)
      this.$bus.$on('itemImgLoad', () => {
        refresh()
      })
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY*1, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    methods: {
      // 事件监听相关的方法
      tabClick(index) {
        switch(index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > 1000
        this.isShowTab = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
        // console.log('1');
      },
      swiperImgLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        // console.log(this.tabOffsetTop);
      },

      // 网络请求相关的方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.data.banner.list;
          this.recommends = res.data.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          console.log(res);
          this.goods[type].list.push(...res.data.data.list);
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      }    
    }
  }
</script>

<style scoped>
#home {
  position: relative;
  height: 100vh;
}
/* 原生浏览器滚动
.home-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-tint);
  z-index: 99;
} */
.home-nav {
  background-color: var(--color-tint);
  z-index: 99;
}
.content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
}
.home-recommend {
  border-bottom: 10px solid #eee;
}
.tab-control1 {
  position: relative;
  background-color: #fff;
  z-index: 99;
}
/* 原生浏览器 */
/* .tab-control {
  position: sticky;
  top: 44px;
  background-color: #fff;
  z-index: 999;
} */
</style>
