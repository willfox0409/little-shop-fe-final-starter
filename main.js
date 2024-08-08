import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
// import './css/styles.css';
// import './images/turing-logo.png';
// import merchantsData from './data/merchants';
// import itemsData from './data/items';
console.log('heather')

import {fetchData, postData, deleteData, editData} from './apiCalls'

const itemsView = document.querySelector("#items-view")
const merchantsView = document.querySelector("#merchants-view")
const showingText = document.querySelector("#showing-text")
const merchantsNavButton = document.querySelector("#merchants-nav")
const itemsNavButton = document.querySelector("#items-nav")
const addNewButton = document.querySelector("#add-new-button")

//form elements
const merchantForm = document.querySelector("#new-merchant-form")
const newMerchantName = document.querySelector("#new-merchant-name")
const newItemName = document.querySelector("#new-item-name")
const submitMerchantButton = document.querySelector("#submit-merchant")
const submitItemButton = document.querySelector("#submit-item")
const successfulAdd = document.querySelector("#successful-add")


merchantsView.addEventListener('click', (event) => {
  handleMerchantClicks(event)
})

merchantsNavButton.addEventListener('click', showAllMerchants)
itemsNavButton.addEventListener('click', showAllItems)

addNewButton.addEventListener('click', addNew)
submitMerchantButton.addEventListener('click', submitMerchant)

let merchants;
let items;

Promise.all([fetchData('merchants'), fetchData('items')])
.then(responses => {
    merchants = responses[0].data
    items = responses[1].data
    displayMerchants(merchants)
  })
  .catch(err => {
    console.log('catch')
  })

function addNew() {
  if (addNewButton.dataset.state === "merchant") {
    show([merchantForm])
  } else if (addNewButton.dataset.state === "items") {
    // console.log('items')
  }
}

function deleteMerchant(event) {
  const id = event.target.closest("article").id.split('-')[1]
  deleteData(`merchants/${id}`)
    .then(response => {
      if (response.status === 204) {
        let deletedMerchant = findMerchant(id)
        let indexOfMerchant = merchants.indexOf(deletedMerchant)
        let deleted = merchants.splice(indexOfMerchant, 1)
        displayMerchants(merchants)
      }
    })
  //do i need to delete all the related items when a merchant is deleted?  FE story?
}

function editMerchant(event) {
  const article = event.target.closest("article")
  const h3Name = article.firstElementChild
  const editInput = article.querySelector(".edit-merchant-input")
  const submitEditsButton = article.querySelector(".submit-merchant-edits")
  const discardEditsButton = article.querySelector(".discard-merchant-edits")
  editInput.value = h3Name.innerText
  show([editInput, submitEditsButton, discardEditsButton])
}

function submitMerchantEdits(event) {
  const article = event.target.closest("article")
  const editInput = article.querySelector(".edit-merchant-input")
  const id = article.id.split('-')[1]

  const patchBody = { name: editInput.value }
  editData(`merchants/${id}`, patchBody)
    .then(patchResponse => {
      let merchantToUpdate = findMerchant(patchResponse.data.id)
      let indexOfMerchant = merchants.indexOf(merchantToUpdate)
      merchants.splice(indexOfMerchant, 1, patchResponse.data)
      displayMerchants(merchants)
    })
}

function discardMerchantEdits(event) {
  const article = event.target.closest("article")
  const editInput = article.querySelector(".edit-merchant-input")
  const submitEditsButton = article.querySelector(".submit-merchant-edits")
  const discardEditsButton = article.querySelector(".discard-merchant-edits")

  editInput.value = ""
  hide([editInput, submitEditsButton, discardEditsButton])
}

function handleMerchantClicks(event) {
  if (event.target.classList.contains("delete-merchant")) {
    deleteMerchant(event)
  } else if (event.target.classList.contains("edit-merchant")) {
    editMerchant(event)
  } else if (event.target.classList.contains("view-merchant-items")) {
    displayMerchantItems(event)
  } else if (event.target.classList.contains("submit-merchant-edits")) {
    submitMerchantEdits(event)
  } else if (event.target.classList.contains("discard-merchant-edits")) {
    discardMerchantEdits(event)
  }
}

function submitMerchant() {
  event.preventDefault()
  var merchantName = newMerchantName.value
  postData('merchants', { name: merchantName })
    .then(postedMerchant => {
      merchants.push(postedMerchant.data)
      displayAddedMerchant(postedMerchant.data)
      newMerchantName.value = ''
      show([successfulAdd])
      hide([merchantForm]) 
      setTimeout(() => {
        hide([successfulAdd])
      }, "1000")
    })
}

function showAllMerchants() {
  showingText.innerText = "All Merchants"
  addRemoveActiveNav(merchantsNavButton, itemsNavButton)
  addNewButton.dataset.state = 'merchant'
  show([merchantsView])
  hide([itemsView])
  displayMerchants(merchants)
}

function showAllItems() {
  console.log('is this working?')
  console.log('items: ', items)
  console.log('current text: ', showingText.innerText)
  console.log('state: ', addNewButton.dataset.state)
  showingText.innerText = "All Items"
  addRemoveActiveNav(itemsNavButton, merchantsNavButton)
  addNewButton.dataset.state = 'item'
  show([itemsView])
  hide([merchantsView])
  displayItems(items)
}

function filterByMerchant(merchantId) {
  const specificMerchantItems = items.filter(item => {
    return item.attributes.merchant_id === parseInt(merchantId)
  })
  return specificMerchantItems
}

function displayItems(items) {
  itemsView.innerHTML = ''
  items.forEach(item => {
    let merchant = findMerchant(item.attributes.merchant_id).attributes.name
    itemsView.innerHTML += `
     <article class="item" id="item-${item.id}">
          <img src="" alt="">
          <h2>${item.attributes.name}</h2>
          <p>${item.attributes.description}</p>
          <p>$${item.attributes.unit_price}</p>
          <p class="merchant-name-in-item">Merchant: ${merchant}</p>
          <button>ORDER</button>
        </article>
    `
  })
}

function findMerchant(id) {
  const result = merchants.find(merchant => {
    return parseInt(merchant.id) === parseInt(id)
  })
  return result
}

function displayMerchants(merchants) {
    merchantsView.innerHTML = ''
    merchants.forEach(merchant => {
        merchantsView.innerHTML += 
        `<article class="merchant" id="merchant-${merchant.id}">
          <h3 class="merchant-name">${merchant.attributes.name}</h3>
          <button class="edit-merchant icon">✎</button>
          <input class="edit-merchant-input hidden" name="edit-merchant" type="text">
          <button class="submit-merchant-edits hidden">
            Submit Edits
          </button>
          <button class="discard-merchant-edits hidden">
            Discard Edits
          </button>
          <button class="view-merchant-items">View Merchant Items</button>
          <button class="delete-merchant icon">🗑️</button>
        </article>`
    })
}

function displayAddedMerchant(merchant) {
      merchantsView.insertAdjacentHTML('beforeend', 
      `<article class="merchant" id="merchant-${merchant.id}">
          <h3 class="merchant-name">${merchant.attributes.name}</h3>
          <button class="edit-merchant icon">✎</button>
          <input class="edit-merchant-input hidden" name="edit-merchant" type="text">
          <button class="submit-merchant-edits hidden">
            Submit Edits
          </button>
          <button class="discard-merchant-edits hidden">
            Discard Edits
          </button>
          <button class="view-merchant-items">View Merchant Items</button>
          <button class="delete-merchant icon">🗑️</button>
        </article>`)
}

function displayMerchantItems(event) {
  let merchantId = event.target.closest("article").id.split('-')[1]
  const filteredMerchantItems = filterByMerchant(merchantId)
  toggleToMerchantItemsView(merchantId, filteredMerchantItems)
}


function toggleToMerchantItemsView(id, items) {
  showingText.innerText = `All Items for Merchant #${id}`
  show([itemsView])
  hide([merchantsView])
  addRemoveActiveNav(itemsNavButton, merchantsNavButton)
  addNewButton.dataset.state = 'item'
  displayItems(items)
}

function show(elements) {
  elements.forEach(element => {
    element.classList.remove('hidden')
  })
}

function hide(elements) {
  elements.forEach(element => {
    element.classList.add('hidden')
  })
}

function addRemoveActiveNav(nav1, nav2) {
  nav1.classList.add('active-nav')
  nav2.classList.remove('active-nav')
}


