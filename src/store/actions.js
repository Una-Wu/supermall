import { 
  ADD_COUNTER, 
  ADD_TO_CART 
} from './mutation-types'

export default {
  addCart(context, payload) {      
    // 查找之前数组中是否含有该商品
    let product = context.state.cartList.find(item => item.iid === payload.iid)
    if (product) {
      // product.count += 1
      context.commit(ADD_COUNTER, product)
    } else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART, payload)
    }
  }
}