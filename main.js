Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
  <ul>
    <li v-for="detail in details"> {{ detail }} </li>
  </ul>
  `
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">
        <div class="product-image">
          <img :src="image" alt="socks">
        </div>
        <h1>
          {{ title }}
        </h1>
        <p v-if="inventory > 10">In Stock</p>
        <p v-else-if=" inventory <= 10 && inventory > 0">Few items left!</p>
        <p v-else :class="{outStock: inventory<=0}">Out of Stock</p>
        <span v-if="onSale">On Sale!!!</span>
        <p>Shipping: {{ shipping }} </p>

        <product-details :details="details"></product-details>

        <div v-for="(variant, index) in variants"
             :key="variant.variantId"
             class="color-box"
             :style="{backgroundColor: variant.variantColour}"
             @mouseover="updateProduct(index)">
        </div>
        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>
        <p>
          {{ description }}
        </p>
        <a :href="link" target="_blank">More products like this</a>
        <button @click="addToCart"
        v-if="inventory>0">Add to cart</button>
        <button @click="removeFromCart"
        v-if="inventory>0">Remove from cart</button>
      </div>
  `,
  data() {
    return {
      brand: 'Master of Puppets',
      product: 'Socks',
      description: 'Warm fuzzy socks, that hug your feet, and give them colour.',
      selectedVariant: 0,
      link: 'https://www.amazon.ca/s?k=socks&ref=nb_sb_noss_2',
      onSale: true,
      details: ["80% cotton", "10% pineapple", "10% rabbit", "all-purpose"],
      variants: [
        {
          variantId: 2234,
          variantColour: 'green',
          variantImage: './socks.jpg',
          variantQuantity: 23
        },
        {
          variantId: 2235,
          variantColour: "blue",
          variantImage: './blue-socks.jpg',
          variantQuantity: 0
        }
      ],
      sizes: ["freakishly small", "small", "medium", "large", "sasquatch"]
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct(index) {
      this.selectedVariant = index
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inventory() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "Free"
      }
      return '$4.00'
    }
  }
})



const app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateAddingToCart(id) {
      this.cart.push(id)
    }, 
    updateRemovingFromCart(id) {
      const index = this.cart.indexOf(id);
      if (index > -1) {
        this.cart.splice(index, 1);
      }
    }
  }
})