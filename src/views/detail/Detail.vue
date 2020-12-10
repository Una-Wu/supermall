<template>
  <div>
    <detail-nav-bar/>
    <detail-swiper/>
  </div>
</template>

<script>
import DetailNavBar from './childComponents/DetailNavBar'
import DetailSwiper from './childComponents/DetailSwiper'

import { getDetailData } from 'network/detail.js'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper
  },
  data() {
    return {
      iid: null,
      topImages: [],
    }
  },
  created() {
    // 1.保存存入的id
    this.iid = this.$route.params.iid
    // 2.根据存入的id请求详细的数据
    getDetailData(this.iid).then(res =>{
      console.log(res);
      // 获取顶部轮播图数据
      this.topImages = res.data.result.itemInfo.topImages
      console.log(this.topImages);
    })
  }
}
</script>

<style scoped>

</style>