const selectCategory = document.querySelectorAll('.categoryId');
const categoryForm = document.getElementById("categoryForm")
const categoryCard = document.querySelectorAll('.category')
const itemClassId = document.querySelectorAll('.item')
const addItemClass = document.querySelectorAll('.quantity--add')
const minusItemClass = document.querySelectorAll('.quantity--minus')
const minusDisable = document.querySelector('.quantity--minus-disabled')
const itemName = document.querySelector('.item--title')
const itemPrice = document.querySelector('.item--price')
const itemQuantity = document.querySelector('.quantity--amount')
const tableDropdown = document.querySelectorAll('.dropdown--item')
const dropDownLabel = document.querySelector('.dropdown--table')
const tableItemContainer = document.querySelector('.table-item-container')
const subTotalAmount = document.querySelector('.subtotal--price')
const taxPriceAmount = document.querySelector('.tax--price')
const totalPriceAmount = document.querySelector('.total--price')

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
  // e.preventDefault()

  //update backend
  fetch('/table/addItem', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  //update frontend
  for(let i = 0; i < tables.length; i++){
    if(tables[i]._id === tableId){
      const items = tables[i].items;
      const foundItem = items.find((item) => {
        return item.itemName === itemName;
      });

      if(foundItem){
        foundItem.itemQuantity++;
        renderItems();
      }
      else{
        const newItem = {
          _id: "",
          itemName: itemName,
          itemQuantity: 1,
          itemPrice: itemPrice,
        }
        tables[i].items.push(newItem);
        renderItems();
      }
    }
  }
};

async function minusItemQuantity(e,categoryId){
  // If item quanity < 0 then remove the css disable tag,
  const $parent = e.target.parentNode.parentNode

  const itemName = $parent.querySelector('.item--title').innerText
  const itemPrice = $parent.querySelector('.item--price').innerText
  const itemId = $parent.id
  const tableId = dropDownLabel.id

  const selectedTable = tables.find((table) => table._id === tableId);
  const foundItem = selectedTable.items.find((item) => item.itemName === itemName);

  if(foundItem){
    const data = {
      tableId, categoryId,itemId,itemName, itemPrice, itemQuantity: foundItem.itemQuantity
    };

    //Update backend
    fetch('/table/removeItem', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    //Update front end
    if(foundItem.itemQuantity - 1 > 0){
      foundItem.itemQuantity--;
      renderItems();
    }
    else {
      console.log("REMOVING ITEM");
      //Remove item from html
      const itemIndex = selectedTable.items.findIndex((item) => {
        return item.itemName === foundItem.itemName;
      });
      selectedTable.items.splice(itemIndex, 1);
      renderItems();
    }
  }

}

function tableSelect(tableId, tableNumber, parentNode){
  dropDownLabel.textContent = tableNumber;
  dropDownLabel.id = tableId;
  renderItems()
  parentNode.blur()
}

function renderItems(){

    tableItemContainer.innerHTML = ""
    
    const currentTableId = dropDownLabel.id
    const items = tables.filter(ct => currentTableId === ct._id)[0].items

    items.forEach((item, i) =>{
      const itemTemplate = `<div class="table-item">
        <div class="table-item--left">
          <p class="table-item--number">${i + 1}</p>
          <p class="table-item--name">${item.itemName}</p>
          <p class="table-item--quantity">x${item.itemQuantity}</p>
        </div>
        <div class="empty"></div>
        <p class="table-item--price">$ ${item.itemPrice * item.itemQuantity} </p>
      </div>`
      tableItemContainer.insertAdjacentHTML('beforeend', itemTemplate);
    })

    const subTotal = items.map(x => x.itemQuantity * x.itemPrice).reduce((a,c) => a + c, 0)
    subTotalAmount.innerText = subTotal
    
    //const taxPrice = +((subTotal * .10).toFixed(2))
    const round = subTotal * .10
    const taxPrice = Number(round.toFixed(2))
    taxPriceAmount.innerText = taxPrice

    const totalPrice = subTotal + taxPrice
    totalPriceAmount.innerText = totalPrice

}

renderItems();