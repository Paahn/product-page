const app = new Vue({
  el: '#app',
  data: {
    product: 'Socks',
    description: 'Warm fuzzy socks, that hug your feet, and give them colour.',
    image: './socks.jpg',
    link: 'https://www.amazon.ca/s?k=socks&ref=nb_sb_noss_2',
    inventory: 50,
    onSale: true,
    details: ["80% cotton", "10% pineapple", "10% rabbit", "all-purpose"]
  }
})