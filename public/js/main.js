const selectCategory = document.querySelectorAll('.categoryId');
const categoryForm = document.getElementById("categoryForm")
const categoryCard = document.querySelectorAll('.category')
const itemClassId = document.querySelectorAll('.item')
const addItemClass = document.querySelectorAll('.quantity--add')
const minusItemClass = document.querySelectorAll('.quantity--minus')
const itemName = document.querySelector('.item--title')
const itemPrice = document.querySelector('.item--price')
const itemQuantity = document.querySelector('.quantity--amount')
const tableDropdown = document.querySelectorAll('.dropdown--item')
const dropDownLabel = document.querySelector('.dropdown--table')
const tableItemContainer = document.querySelector('.table-item-container')

Array.from(selectCategory).forEach((el)=>{
  el.addEventListener('click', categorySelectionForm)
})
Array.from(categoryCard).forEach((el) => {
  const categoryId = el.dataset.id
  el.addEventListener('click', () => categorySelect(categoryId))
})
Array.from(addItemClass).forEach((el) => {
  const categoryId = el.parentNode.parentNode.dataset.item
  el.addEventListener('click', (e) => addItemQuantity(e,categoryId))
})
Array.from(minusItemClass).forEach((el) => {
  el.addEventListener('click', minusItemQuantity)
})
Array.from(tableDropdown).forEach((el) => {
  const tableId = el.querySelector('a').id
  const tableNumber = el.querySelector('a').innerHTML
  const parentNode = el.parentNode
  el.addEventListener('click',() => tableSelect(tableId, tableNumber, parentNode) )
})

function categorySelectionForm(){
  const categoryId = this.dataset.id
  categoryForm.action = `/category/createItem/${categoryId}`;
  // Add when clicked the display should be darkened, else not 
}

function categorySelect(categoryId){
  const arr = Array.from(itemClassId)
  arr.forEach(x => {
    if(x.dataset.item === categoryId){
      x.style.display = 'flex';
    }else{
      x.style.display = 'none';
    }
  })
}

async function addItemQuantity(e,categoryId){
  const $parent = e.target.parentNode.parentNode
  const itemName = $parent.querySelector('.item--title').innerText
  const itemPrice = $parent.querySelector('.item--price').innerText
  const itemQuantity = $parent.querySelector('.quantity--amount').innerText
  const itemId = $parent.id
  const tableId = dropDownLabel.id
  const data = {
    tableId, categoryId,itemId,itemName, itemPrice, itemQuantity
  };
  await fetch('/table/addItem', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const response = await fetch('/fetchData');
  const json = await response.json();
  tables = json.table;
  populateItems();
  // get info from clicked card, post request to table models, get table id
}

function minusItemQuantity(){
  console.log('minus')
}

function tableSelect(tableId, tableNumber, parentNode){
  dropDownLabel.textContent = tableNumber;
  dropDownLabel.id = tableId;
  populateItems()
  parentNode.blur()
}


function populateItems(){

    tableItemContainer.innerHTML = ""
    
    const currentTableId = dropDownLabel.id
    const items = tables.filter(ct => currentTableId === ct._id)[0].items
    items.forEach((item, i) =>{
      const itemTemplate = `<div class="table-item">
        <div class="table-item--left">
          <p class="table-item--number">${i}</p>
          <p class="table-item--name">${item.itemName}</p>
          <p class="table-item--quantity">x${item.itemQuantity}</p>
        </div>
        <div class="empty"></div>
        <p class="table-item--price">${item.itemPrice}</p>
      </div>`
      tableItemContainer.insertAdjacentHTML('beforeend', itemTemplate);
    })
}

populateItems();