import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js';
//import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAmEbblz6fPZOlXf5_AYVOhJbmsIxqnzfY',
  authDomain: 'restaurant-73157.firebaseapp.com',
  databaseURL: 'https://restaurant-73157-default-rtdb.firebaseio.com',
  projectId: 'restaurant-73157',
  storageBucket: 'restaurant-73157.appspot.com',
  messagingSenderId: '1045477772607',
  appId: '1:1045477772607:web:d4a9f1dbe4dbca6b1d178a',
  measurementId: 'G-6T3HP4XMZC',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {
  getDatabase,
  ref,
  child,
  get,
  update,
  push,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js';

const foodTemplate = document.querySelector('#food-template');
const drinkTemplate = document.querySelector('#drink-template');
console.log(foodTemplate);
console.log(drinkTemplate);

var restaurant = location.search.split('restaurant=')[1];
console.log(restaurant);

var postKey = null;

//   Add products to the cart

function addToCart() {
  var db = getDatabase();
  var dbRef = ref(getDatabase());
  if (postKey == null) {
    postKey = push(child(ref(db), 'posts')).key;
  }

  var itemPostKey = push(child(ref(db), 'posts')).key;
  var updates = {};

  get(
    child(
      dbRef,
      '/carts/' + postKey + '/' + this.dataset.type + '/' + this.dataset.name
    )
  ).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      let amount = 1 + snapshot.val().amount;
      let postData = { price: this.dataset.price, amount: amount };
      updates[
        '/carts/' + postKey + '/' + this.dataset.type + '/' + this.dataset.name
      ] = postData;
      return update(ref(db), updates);
    } else {
      let postData = { amount: 1, price: this.dataset.price };
      updates[
        '/carts/' + postKey + '/' + this.dataset.type + '/' + this.dataset.name
      ] = postData;
      return update(ref(db), updates);
    }
  });
}

const dbRef = ref(getDatabase());
get(child(dbRef, `restaurants/` + restaurant))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const menu = snapshot.val();
      console.log(menu.food);

      for (let i = 1; i < menu.food.length; i++) {
        let newFood = foodTemplate.cloneNode(true);
        newFood.style.removeProperty('display');
        newFood.querySelector('.food-name').textContent = menu.food[i].name;
        newFood.querySelector('.food-description').textContent =
          menu.food[i].description;
        newFood.querySelector('.food-price').textContent = menu.food[i].price;

        let add_button = newFood.querySelector('.button-add');
        add_button.dataset.type = 'food';
        add_button.dataset.price = menu.food[i].price;
        add_button.dataset.name = menu.food[i].name;
        add_button.addEventListener('click', addToCart, false);

        foodTemplate.after(newFood);
      }

      for (let i = 1; i < menu.drinks.length; i++) {
        let newdrink = drinkTemplate.cloneNode(true);
        newdrink.style.removeProperty('display');
        newdrink.querySelector('.drink-name').textContent = menu.drinks[i].name;
        newdrink.querySelector('.drink-description').textContent =
          menu.drinks[i].description;
        newdrink.querySelector('.drink-price').textContent =
          menu.drinks[i].price;

        let add_button = newdrink.querySelector('.button-add');
        add_button.dataset.type = 'drink';
        add_button.dataset.price = menu.food[i].price;
        add_button.dataset.name = menu.drinks[i].name;
        add_button.addEventListener('click', addToCart, false);

        drinkTemplate.after(newdrink);
      }
    } else {
      console.log('No data available');
    }
  })
  .catch((error) => {
    console.error(error);
  });

const cart_box = document.querySelector('#cart-box');
const cart_template = document.querySelector('#item-template');
const no_cart_item = document.querySelector('#no-cart-item');
function openCart() {
  var remove_elements = document.getElementsByClassName('removable');

  while (remove_elements[0]) {
    remove_elements[0].parentNode.removeChild(remove_elements[0]);
  }

  if (postKey) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `carts/` + postKey)).then((snapshot) => {
      if (snapshot.exists()) {
        const cart = snapshot.val();
        console.log(cart);

        let total_price = 0;

        if (cart.food) {
          for (let i in cart.food) {
            let newitem = cart_template.cloneNode(true);
            newitem.classList.add('removable');
            // console.log(cart.food[i]);
            // console.log(i);

            newitem.querySelector('.name').textContent = i;
            newitem.querySelector('.amount').textContent = cart.food[i].amount;

            var perprice =
              parseInt(cart.food[i].amount) * parseInt(cart.food[i].price);
            newitem.querySelector('.price').textContent = perprice;

            total_price += perprice;

            cart_template.after(newitem);
          }
        }

        if (cart.drink) {
          for (let i in cart.drink) {
            let newitem = cart_template.cloneNode(true);
            newitem.classList.add('removable');
            // console.log(cart.drink[i]);
            // console.log(i);

            newitem.querySelector('.name').textContent = i;
            newitem.querySelector('.amount').textContent = cart.drink[i].amount;

            var perprice =
              parseInt(cart.drink[i].amount) * parseInt(cart.drink[i].price);
            newitem.querySelector('.price').textContent = perprice;
            total_price += perprice;

            cart_template.after(newitem);
          }
        }
        console.log(total_price);
        document.querySelector('#total-price').textContent = total_price;
      }
    });
  } else {
    no_cart_item.style.removeProperty('display');
  }
}

const open_cart_button = document.querySelector('#open-cart-button');
open_cart_button.addEventListener('click', openCart, false);

// Open shopping cart when clicked

const shopping_cart = document.querySelector('.cart-icon');
const cart = document.getElementsByClassName('CartContainer');
console.log(cart);

shopping_cart.onclick = function () {
  document.getElementById('cart-box').style.display = 'block';
};
