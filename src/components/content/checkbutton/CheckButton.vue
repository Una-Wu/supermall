<template>
  <div class="check-button" :class="{checked: isChecked}">
    <img src="~assets/img/cart/tick.svg">
  </div>
</template>

<script>
export default {
  name:'CheckButton',
  props: {
    isChecked: false
  }

}
</script>

<style scoped>
  .check-button {
    border-radius: 50%;   
    border: 2px solid #aaa
  }
  .checked {
    border-color: red;
    background-color: red;
  }
</style>