<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            :pull-up-load="true"        
             @scroll="contentScroll"
             @pullingUp="loadMore">
      <home-swiper :banners="banners"/>
      <home-recommend class="home-recommend" :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control"
                  :titles="['流行','新款','精选']" 
                  @tabClick="tabClick"/>
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
        isShowBackTop: false
      }
    },
    created() {
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      this.$bus.$on('itemImgLoad', () => {
        this.$refs.scroll.refresh()
      })
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
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > 1000 ? true : false
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
        // console.log('1');
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
.home-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
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
.tab-control {
  position: sticky;
  top: 44px;
  background-color: #fff;
  z-index: 999;
}

</style>
