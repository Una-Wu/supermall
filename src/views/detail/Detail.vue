<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" 
                    @navItemClick="navItemClick" 
                    ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type = "3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :commentInfo="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from './childComponents/DetailNavBar'
import DetailSwiper from './childComponents/DetailSwiper'
import DetailBaseInfo from './childComponents/DetailBaseInfo'
import DetailShopInfo from './childComponents/DetailShopInfo'
import DetailGoodsInfo from './childComponents/DetailGoodsInfo'
import DetailParamInfo from './childComponents/DetailParamInfo'
import DetailCommentInfo from './childComponents/DetailCommentInfo'
import DetailBottomBar from './childComponents/DetailBottomBar'


import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import { getDetailData, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
import { debounce } from 'common/untils'
import { itemListenerMixin, backTopMixin } from 'common/mixin'
import { BACK_POSITIONG } from 'common/const'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      offsetTops: [],
      getOffsetTops: [],
      currentIndex: 0
    }
  },
  mixins: [itemListenerMixin, backTopMixin],
  created() {
    // 1.保存存入的id
    this.iid = this.$route.query.iid
    
    // 2.根据存入的id请求详细的数据
    getDetailData(this.iid).then(res =>{
      // console.log(res);
      const data = res.data.result

      // 1.获取顶部轮播图数据
      this.topImages = data.itemInfo.topImages
      // console.log(this.topImages);
    
      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 6.获取评论信息
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      // 7.请求推荐的数据
      getRecommend().then(res => {
        this.recommends = res.data.data.list
        // console.log(this.recommends);
      })
    })
  },
  mounted() {},
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)

  },
  methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getOffsetTops = debounce(() => {
          this.offsetTops.push(0)
          this.offsetTops.push(this.$refs.params.$el.offsetTop)
          this.offsetTops.push(this.$refs.comment.$el.offsetTop)
          this.offsetTops.push(this.$refs.recommend.$el.offsetTop)
          this.offsetTops.push(Number.MAX_VALUE)
        })
        this.getOffsetTops() 
        // console.log(this.offsetTops);      
      },
      navItemClick(index) {
        this.$refs.scroll.scrollTo(0, -this.offsetTops[index], 100)
      },
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > BACK_POSITIONG
        const positionY = -position.y
        const length = this.offsetTops.length
        for (let i = 0; i < length-1; i++) {
          if (this.currentIndex !== i && (positionY >= this.offsetTops[i] && positionY < this.offsetTops[i+1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      },
      addToCart() {
        console.log('----');
        // 获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.newPrice
        product.iid = this.iid
        
        // 将商品添加到购物车
        this.$store.dispatch('addCart',product)
      }
      
    }
}
</script>
  
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
</style>