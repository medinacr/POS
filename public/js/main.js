(() => {
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
const placeOrder = document.querySelector('.place--order')
const expandOrderButton = document.querySelectorAll('.order-card-action')
const itemDropdownMenu = document.querySelector('.item-dropdown')
const itemDropdownContent = document.querySelector('.dropdown-content')
const categoryCards = document.querySelectorAll('.category-card')
const categoryName = document.querySelectorAll('.category-name')
const categoryDelete = document.querySelectorAll('.category-delete')
const categoryEdit = document.querySelectorAll('.category-edit')
const categoryButton = document.querySelector('.add-category-categories')
const addCategoryButton = document.querySelector('.add-category-categories');
const categoryCardContainer = document.querySelector('.category-card-container');

addCategoryButton.addEventListener('click', async () => {
  const categoryName = prompt('Enter category title:');
  if (!categoryName) return;

  const response = await fetch('category/createCategory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ category: categoryName })
  });

  const newCategory = await response.json();

  // Create a new category card and append it to the category card container
  const categoryCard = document.createElement('div');
  categoryCard.classList.add('category-card');
  categoryCard.id = newCategory._id;
  categoryCard.innerHTML = `
    <p class="category-name">${newCategory.category}</p>
    <button class="category-edit">EDIT</button>
    <button class="category-delete">DELETE</button>
  `;
  categoryCardContainer.appendChild(categoryCard);
});

const categorySearchInput = document.querySelector('.category-search-input');

categorySearchInput.addEventListener('input', () => {
  const searchQuery = categorySearchInput.value.toLowerCase();
  const categoryCards = categoryCardContainer.querySelectorAll('.category-card');
  categoryCards.forEach(categoryCard => {
    const categoryName = categoryCard.querySelector('.category-name').textContent.toLowerCase();
    if (categoryName.includes(searchQuery)) {
      categoryCard.style.display = '';
    } else {
      categoryCard.style.display = 'none';
    }
  });
});


Array.from(expandOrderButton).forEach((el) => {
  el.addEventListener('click', expandOrderInfo)
})
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

if(placeOrder) {
  placeOrder.addEventListener('click', order)
}

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

async function order() {
  const tableId = dropDownLabel.id
  const selectedTable = tables.find((table) => table._id === tableId);
  const subtotal = parseFloat(subTotalAmount.innerText.replace('$', ''))
  const tax = parseFloat(taxPriceAmount.innerText.replace('$', ''))
  const totalPriceBill = parseFloat(totalPriceAmount.innerText.replace('$', ''))

  if(tableId === 'table-dropdown' || tableId === '') {
    let timerInterval
    Swal.fire({
      title: 'Please Select a Table',
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        return
      }
    })
    return
  }else {
    const data = { 
      id: dropDownLabel.id, 
      tableNumber: selectedTable,
      subtotal: subtotal,
      tax: tax,
      totalPriceBill,
    };
    console.log(tableId)
    console.log(data)
    fetch("/post/placeOrder", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      window.location.reload()
    })
  }
}

function renderItems(){

    tableItemContainer.innerHTML = ""
    
    const currentTableId = dropDownLabel.id
    const items = tables.filter(ct => currentTableId === ct._id)[0].items

    items.forEach((item, i) =>{
      const itemTemplate = `<div class="table-item">
        <div class="text table-item--left">
          <p class="text table-item--number">${i + 1}</p>
          <p class="text table-item--name">${item.itemName}</p>
          <p class="text table-item--quantity">x${item.itemQuantity}</p>
        </div>
        <div class="empty"></div>
        <p class="text table-item--price">$ ${item.itemPrice * item.itemQuantity} </p>
      </div>`
      tableItemContainer.insertAdjacentHTML('beforeend', itemTemplate);
    })

    const subTotal = items.map(x => x.itemQuantity * x.itemPrice).reduce((a,c) => a + c, 0)
    subTotalAmount.innerText = `$${subTotal.toFixed(2)}`
    
    //const taxPrice = +((subTotal * .10).toFixed(2))
    const taxPrice = subTotal * .10
    // const taxPrice = Number(round.toFixed(2))
    taxPriceAmount.innerText = `$${taxPrice.toFixed(2)}`

    const totalPrice = subTotal + taxPrice
    totalPriceAmount.innerText = `$${totalPrice.toFixed(2)}`

}

function expandOrderInfo(event) {
  if (event.target.classList.contains('order-card-action')) {
    const date = event.target.id.replace('order-card-action-', '');
    const ordersInfoList = document.querySelectorAll(`.order-info-extended[id^="order-info-extended-${date}"]`);
    ordersInfoList.forEach(ordersInfo => {
      ordersInfo.classList.toggle('show');
    });
  }
}

// Define a click handler for the category-card-container
document.querySelector('.category-card-container').addEventListener('click', async (event) => {
  // Check if the clicked element is the edit button
  if (event.target.classList.contains('category-edit')) {
    const categoryId = event.target.closest('.category-card').id;
    const categoryNameElement = event.target.closest('.category-card').querySelector('.category-name');
    const oldCategory = categoryNameElement.innerText;
    event.target.closest('.category-card').querySelector('.category-delete').style.display = 'none';
    event.target.closest('.category-card').querySelector('.category-edit').style.display = 'none';

    // Replace edit button with confirm and cancel buttons
    const confirmButton = document.createElement('button');
    confirmButton.className = 'category-confirm';
    confirmButton.innerText = 'CONFIRM';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'category-cancel';
    cancelButton.innerText = 'CANCEL';
    
    event.target.parentNode.insertBefore(confirmButton, event.target.nextSibling);
    event.target.parentNode.insertBefore(cancelButton, event.target.nextSibling);

    // Replace category name with input field for editing
    categoryNameElement.innerHTML = `<input class="category-item" type="text" value="${oldCategory}" />`;
    const inputField = categoryNameElement.querySelector('.category-item');
    inputField.focus();

    // Handle cancel button click
    cancelButton.addEventListener('click', (event) => {

      // Replace input field with original category name
      categoryNameElement.innerHTML = oldCategory;

      // Remove cancel/confirm button 
      event.target.closest('.category-card').querySelector('.category-cancel').style.display = 'none';
      event.target.closest('.category-card').querySelector('.category-confirm').style.display = 'none';

      // Display delete/edit button
      event.target.closest('.category-card').querySelector('.category-delete').style.display = 'flex';
      event.target.closest('.category-card').querySelector('.category-edit').style.display = 'flex';
    });

    // Handle confirm button click
    confirmButton.addEventListener('click', (event) => {
      const newCategory = inputField.value;

      editCategory(categoryId, newCategory);
      // Update category name in DOM
      categoryNameElement.innerText = newCategory;


      // Replace cancel and confirm buttons with edit button
      event.target.closest('.category-card').querySelector('.category-cancel').style.display = 'none';
      event.target.closest('.category-card').querySelector('.category-confirm').style.display = 'none';

      // Display delete/edit button
      event.target.closest('.category-card').querySelector('.category-delete').style.display = 'flex';
      event.target.closest('.category-card').querySelector('.category-edit').style.display = 'flex';
    });
  }

  // Check if the clicked element is the delete button
  if (event.target.classList.contains('category-delete')) {
    const categoryId = event.target.closest('.category-card').id;
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error(error);
    }
  }
});




// let activeEditIndex = null;
// let activeEditToggle = false;
// const confirmButtons = [];

// Array.from(categoryEdit).forEach((el, index) => {
//   const tableId = el.parentNode.id;
//   const categoryDeleteButton = categoryDelete[index];
//   const categoryConfirmButton = document.createElement('button');
//   categoryConfirmButton.className = 'category-confirm';
//   categoryConfirmButton.innerText = 'CONFIRM';

//   confirmButtons.push(categoryConfirmButton);
//   el.addEventListener('click', () => {
//     const oldCategory = categoryName[index].innerText;

//     if (activeEditIndex !== null && activeEditIndex !== index) {
//       // Revert changes on previously active edit
//       categoryDelete[activeEditIndex].innerText = 'DELETE';
//       categoryEdit[activeEditIndex].innerText = 'EDIT';
//       categoryName[activeEditIndex].innerHTML = activeEditCategoryName;
//       confirmButtons[activeEditIndex].replaceWith(categoryDelete[activeEditIndex]);
//     }

//     if (activeEditIndex !== null && activeEditIndex === index) {
//       // Cancel edit
//       categoryConfirmButton.replaceWith(categoryDeleteButton);
//       el.innerText = 'EDIT';
//       categoryName[index].innerHTML = activeEditCategoryName;
//       activeEditIndex = null;
//     } else {
//       // Start edit
//       categoryDeleteButton.replaceWith(categoryConfirmButton);
//       el.innerText = 'CANCEL';
//       activeEditCategoryName = categoryName[index].innerHTML;
//       console.log(oldCategory)
//       categoryName[index].innerHTML = `<input class="category-item" type="text" value="${oldCategory}" />`;
//       const inputField = document.querySelector('.category-item');
//       inputField.focus();

//       inputField.addEventListener('keydown', (event) => {
//         if (event.key === 'Enter') {
//           editCategory(tableId, event.target.value);
//           categoryDelete[activeEditIndex].innerText = 'DELETE';
//           categoryEdit[activeEditIndex].innerText = 'EDIT';
//           categoryName[activeEditIndex].innerHTML = event.target.value;
//           categoryName[index].parentNode.id = tableId
//           activeEditCategoryName = inputField.value;
//           confirmButtons[activeEditIndex].replaceWith(categoryDelete[activeEditIndex]);
//         }
//       });

//       categoryConfirmButton.addEventListener('click', (event) => {
//         editCategory(tableId, inputField.value);
//         console.log( categoryName[index].parentNode.id)
//         categoryDelete[activeEditIndex].innerText = 'DELETE';
//         categoryEdit[activeEditIndex].innerText = 'EDIT';
//         categoryName[activeEditIndex].innerHTML = inputField.value;
//         categoryName[index].parentNode.id = tableId
//         activeEditCategoryName = inputField.value;
//         confirmButtons[activeEditIndex].replaceWith(categoryDelete[activeEditIndex]);
//       });

//       activeEditIndex = index;
//     }
//   });

//   categoryDeleteButton.addEventListener('click', (el) => {
//     if(!window.confirm('Are you sure you want to delete this category?')){
//       return
//     }else {
//        deleteCategory(tableId)
//        el.target.parentNode.remove()
//     } 
//   });
// });

// async function deleteCategory(tableId) {
//   const id = {tableId}
  

//     fetch('/deleteCategory', {
//       method: 'Delete',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(id)
//     })
  
// }

// async function editCategory(tableId, edit) {
//   const id = tableId

//   fetch(`/category/editItem`, {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({tableId, edit})
//   })

//   console.log('Editing...')
// }

async function deleteCategory(tableId) {
  const id = {tableId};
  if(!window.confirm('Are you sure you want to delete this category?')) {
    return
  }else {
    fetch('/deleteCategory', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id)
    });
    
    // Remove the category from the DOM
    const categoryElement = document.getElementById(tableId);
    if (categoryElement) {
      categoryElement.remove();
    }
  }
}

async function editCategory(tableId, edit) {
  const id = tableId;

  const response = await fetch(`/category/editItem`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({tableId, edit})
  });

  if (!response.ok) {
    throw new Error('Failed to edit category');
  }

  // Update the category name in the DOM
  const categoryElement = document.getElementById(tableId);
  if (categoryElement) {
    const categoryNameElement = categoryElement.querySelector('.category-name');
    if (categoryNameElement) {
      categoryNameElement.innerHTML = edit;
    }
  }
}


renderItems();
})()
