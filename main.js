const eventBus = new Vue();

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: false
    }
  },
  template: `
  <div>
    <div>
      <span class="tab"
            :class="{ activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="selectedTab = tab"> {{ tab }}</span>
    </div>
  
    <div v-show="selectedTab === 'Reviews'">
            <h2>Reviews</h2>
            <p v-if="reviews.length==0">There are no reviews yet</p>
            <ul>
              <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review}}</p>
                <p v-if="review.recommend">Recommends: {{ review.recommend }}</p>
              </li>
            </ul>
    </div>
    <div>
      <product-review v-show="selectedTab === 'Make a Review'"></product-review>
    </div>
  </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
  
    <p v-if="errors.length">
      <b>The following errors have occured:</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>

    <p>
      <label for="name">Name: </label>
      <input id="name" v-model="name">
    </p>

    <p>
      <label for="name">Review: </label>
      <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
      <label for="rating">Rating: </label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>
      <label for="recommend">Would you recommend this product?</label>
      <select id="recommend" v-model="recommend">
        <option>Yes</option>
        <option>No</option>
      </select>
    </p>

    <p>
      <input type="submit" value="Submit">
    </p>
  </form>

  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating,
        recommend: this.recommend
      }
      eventBus.$emit('review-submitted', productReview)
      // reset the values after submitting the form
      this.name = null
      this.review = null
      this.rating = null
      this.recommend = null
      } else {
        if (!this.name) this.errors.push("Name required.")
        if (!this.review) this.errors.push("You need to write a review.")
        if (!this.name) this.errors.push("Rate your experience.")
      }
    }
  }
})

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
      <product-tabs :reviews="reviews"></product-tabs>
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
      sizes: ["freakishly small", "small", "medium", "large", "sasquatch"],
      reviews: []
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
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
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