const selectCategory = document.querySelectorAll('.categoryId');
const categoryForm = document.getElementById("categoryForm")
const categoryCard = document.querySelectorAll('.category')
const itemClassId = document.querySelectorAll('#item')
const addItemClass = document.querySelectorAll('.quantity--add')
const minusItemClass = document.querySelectorAll('.quantity--minus')

Array.from(selectCategory).forEach((el)=>{
  el.addEventListener('click', categorySelectionForm)
})
Array.from(categoryCard).forEach((el) => {
  el.addEventListener('click', categorySelect)
})
Array.from(addItemClass).forEach((el) => {
  el.addEventListener('click', addItemQuantity)
})
Array.from(minusItemClass).forEach((el) => {
  el.addEventListener('click', minusItemQuantity)
})

function categorySelectionForm(){
  const categoryId = this.dataset.id
  categoryForm.action = `/category/createItem/${categoryId}`;
  // Add when clicked the display should be darkened, else not 
}

function categorySelect(){
  const categoryId = this.dataset.id
  const arr = Array.from(itemClassId)
  arr.forEach(x => {
    if(x.dataset.item === categoryId){
      x.style.display = 'flex'
    }else{
      x.style.display = 'none'
    }
  })
}

function addItemQuantity(){
  console.log('add')
}

function minusItemQuantity(){
  console.log('minus')
}