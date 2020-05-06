const app = new Vue({
  el: '#app',
  data: {
    brand: 'Master of Puppets',
    product: 'Socks',
    description: 'Warm fuzzy socks, that hug your feet, and give them colour.',
    selectedVariant: 0,
    link: 'https://www.amazon.ca/s?k=socks&ref=nb_sb_noss_2',
    inventory: 20,
    onSale: true,
    details: ["80% cotton", "10% pineapple", "10% rabbit", "all-purpose"],
    variants: [
      {
        variantId: 2234,
        variantColour: 'green',
        variantImage: './socks.jpg',
      },
      {
        variantId: 2235,
        variantColour: "blue",
        variantImage: './blue-socks.jpg',
      }
    ],
    sizes: ["freakishly small", "small", "medium", "large", "sasquatch"],
    cart: 0
  },
  methods: {
    addToCart() {
      this.cart += 1
    },
    updateProduct(index) {
      this.selectedVariant = index
    },
    removeFromCart() {
      this.cart -= 1
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    }
  }
})