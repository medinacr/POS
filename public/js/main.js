const selectCategory = document.querySelectorAll('.categoryId');
const categoryForm = document.getElementById("categoryForm")
const categoryCard = document.querySelectorAll('.category')

Array.from(selectCategory).forEach((el)=>{
  el.addEventListener('click', categorySelectionForm)
})
Array.from(categoryCard).forEach((el) => {
  el.addEventListener('click', categorySelect)
})

function categorySelectionForm(){
  const categoryId = this.dataset.id
  categoryForm.action = `/category/createItem/${categoryId}`;
}

function categorySelect(){
  
}

