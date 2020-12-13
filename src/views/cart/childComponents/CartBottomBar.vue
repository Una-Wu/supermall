<template>
  <div class="bottom-bar">
      <div class="checked-content">
        <check-button class="checked-button" :is-checked="isSelectAll"/>
        <span>全选</span>
      </div>
      <div class="total">
        合计 :  {{totalPrice}}
      </div>
      <div class="calculate" @click="calculateClick">
        去计算({{checkedLength}})
      </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkbutton/CheckButton'

export default {
  name:'CartBottomBar',
  components: {
    CheckButton
  },
  computed: {
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkedLength() {
      return this.$store.state.cartList.filter(item => {
        return item.checked
      }).length
    },
    isSelectAll() {
      if (this.$store.state.cartList.length === 0) return false
      else return !(this.$store.state.cartList.find(item => {
        return !item.checked }))
    }
  },
  methods: {
    calculateClick() {
      if (this.isSelectAll == false) {
        this.$toast.show('请选择购买的商品', 1500)
      }
    }
  }
  
}
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    position: relative;
    height: 40px;
    background-color: #eee;
    
  }
  .checked-content {
    display: flex;
    flex: 0 0 25%;
    font-size: 14px;
    align-items: center;
    
  }
  .checked-button {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    margin-right: 5px;
  }
  .total {
    flex: 1;
    line-height: 40px;
    font-size: 14px;
  }
  .calculate {
    flex: 0 0 30%;
    line-height: 40px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    background-color: orangered;
  }
</style>