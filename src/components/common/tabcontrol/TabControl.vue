<template>
  <div class="tab-control">
    <div  class="tab-control-item"
          v-for="(item,index) in titles"
          :key="item.index"
          :class="{active: index === currentIndex}"
          @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabControl',
  props: {
    titles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index
      this.$emit('tabClick', index)
    }
  }
}
</script>

<style scoped>
  .tab-control {
    display: flex;
    height: 40px;        
  }
  .tab-control-item {
    flex: 1;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
  .active {
    color: var(--color-high-text);
  }
  .active span {
    padding: 5px;
    border-bottom: 3px solid var(--color-high-text);
  }

</style>