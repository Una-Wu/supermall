<template>
  <div class="recommend">
    <div class="recommend-item" v-for="item in recommends" :key="item.index">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeRecommend',
  props: {
    recommends:{
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
  .recommend {
    display: flex;
    text-align: center;
    font-size: 12px;
    padding-bottom: 10px;
  }
  .recommend-item {
    flex: 1;
  }
  .recommend-item img {
    width: 80%;
    margin: 5px 0 5px;
  }

</style>