const BASE_URL = "https://user-list.alphacamp.io/api/v1/users/"
let userList = JSON.parse(localStorage.getItem("favoriteUser")) || []
let card_container = document.querySelector(".card-container") //從儲存庫撈資料

//________【 組人物並且印出 】________
function renderUserList(userList) {
  card_container.innerHTML = ""
  let cardStr = ""
  userList.forEach((userdata) => {
    cardStr += `<!--No${userdata.id} card-->
       <div class="col-lg-3 col-md-4 col-sm-6 mb-4 p-2">
         <div class="card">
           <img src="${userdata.avatar}" class="card-img-top" alt="User Avatar"/>
           <div class="card-body">
             <h5 class="card-title text-center">${userdata.name} ${userdata.surname}</h5>
           </div>
           <div class="card-footer">   
              <button 
                class="btn btn-primary btn-show-user" 
                data-bs-toggle="modal" 
                data-bs-target="#user-modal${userdata.id}">
                More
              </button>
              <button 
                  class="btn btn-danger btn-remove-favorite"
                  data-id="${userdata.id}">
                  X
              </button>
           </div>
         </div>
       </div>

       <!-- User Modal by No ${userdata.id} card -->
       <div class="modal fade" id="user-modal${userdata.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
         <div class="modal-dialog modal-lg d-md-flex">
             <div class="modal-content">
               <div class="modal-header">
                 <h5 class="modal-title" id="user-modal-title">${userdata.name} ${userdata.surname}</h5>
                 <button 
                    type="button" 
                    class="btn-close" 
                    data-bs-dismiss="modal" 
                    aria-label="Close">
                  </button>
               </div>

               <div class="user-modal-body d-flex flex-md-row flex-column">
                 <img src="${userdata.avatar}" alt="modal-${userdata.id}">
                 <ul class="modal-content-list mt-2 ">
                   <li class="mt-2">age: ${userdata.name}${userdata.surname}</li>
                   <li class="mt-2">gender: ${userdata.gender}</li>
                   <li class="mt-2">region: ${userdata.region}</li>
                   <li class="mt-2">birthday: ${userdata.birthday}</li>
                   <li class="mt-2">email: ${userdata.email}</li>
                 </ul> 
               </div>

               <div class="modal-footer">
                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
               </div>
             </div>
           </div>
         </div>
       </div>
     `
  })
  card_container.innerHTML += cardStr
}

//________【 移除人物 】________
function removeFromFavorite(id) {
  // 從儲存庫獲取最新的人物列表
  let updatedList = JSON.parse(localStorage.getItem("favoriteUser")) || []
  // 在收藏人物列表中查找要移除的人物的序列
  const index = updatedList.findIndex((user) => user.id === id)

  // 如果找到了要移除的人物,刪掉她
  if (index !== -1) {
    updatedList.splice(index, 1)
    // 更新儲存庫的人物列表
    localStorage.setItem("favoriteUser", JSON.stringify(updatedList))
    // 更新畫面
    renderUserList(updatedList)
  }
}

//btn________【 移除最愛 - 】________
card_container.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderUserList(userList)
//第一次進來時先渲染畫面
