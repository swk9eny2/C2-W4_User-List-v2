//https://user-list.alphacamp.io/api/v1/users 可撈到全部資料
const BASE_URL = "https://user-list.alphacamp.io/api/v1/users/"
let userList = [] // 放所有取得的人物資料
let filteredUser = [] // 搜尋用
const user_pagetotal = 16 // 單頁顯示最大人數

let card_container = document.querySelector(".card-container") // 放卡片
const searchForm = document.querySelector("#search-form") // 搜尋欄位
const searchInput = document.querySelector("#search-input") // 取得輸入的搜尋內容
const paginator = document.querySelector("#paginator") // 獲取分頁器

// ★函式區★

//________【 組人物並且印出 】________
function renderUserList(userList) {
  //清空後重新渲染
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
                  class="btn btn-info btn-add-favorite"
                  data-id="${userdata.id}">
                  +
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

//________【 分頁器 】________
function getUserListByPage(page) {
  //判斷data現在是原始的人物清單還是搜尋的清單
  const data = filteredUser.length ? filteredUser : userList

  //計算起始 index
  const startIndex = (page - 1) * user_pagetotal
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + user_pagetotal)
}

//________【 分頁器-取得總頁數(x) 】________
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / user_pagetotal) // 計算總頁數
  let rawHTML = "" // 製作 template
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  } // 動態產生頁數

  paginator.innerHTML = rawHTML //放回 HTML
}

//________【 新增喜愛人物 】________
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUser")) || []
  const likeUser = userList.find((userList) => userList.id === id)

  //----------阻止重複添加同人物的判斷----------
  if (list.some((userList) => userList.id === id)) {
    //some幫忙檢查陣列中是否有重複的方法回傳對與錯.
    return alert("此人物已經在收藏清單中！")
  }
  list.push(likeUser) //推進去"list最愛清單"
  localStorage.setItem("favoriteUser", JSON.stringify(list))
  //把資料轉成JSON隔事後,設定進去localStorage
  console.log(likeUser)
}

// ★按鈕區★

//________【 新增最愛 + 】________
card_container.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
    //dataset獲取該標籤data-相關的屬性
  }
})

//________【 分頁器的頁數按鈕 】________
paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return //如果被點擊的不是 a 標籤，結束
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page) //str轉num
  renderUserList(getUserListByPage(page)) //更新畫面
})

//________【 搜尋的按鈕 】________
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  //清空card_container的內容(為了重新渲染搜尋後結果)
  card_container.innerHTML = ""
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase() //取輸入的值且轉小寫

  //---將輸入的值與角色做比對(因為有分姓跟名,所以先做組合不然搜尋全名找不到)---
  filteredUser = userList.filter((searchUser) => {
    const fullName = `${searchUser.name} ${searchUser.surname}`.toLowerCase()
    return fullName.includes(keyword)
  })

  //----------找不到相符的跳出提示框----------
  if (filteredUser.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的角色`)
  }

  renderPaginator(filteredUser.length) //重製分頁器
  renderUserList(getUserListByPage(1)) //預設顯示第 1 頁的搜尋結果
})

axios
  .get(BASE_URL)
  .then((response) => {
    userList.push(...response.data.results) // 將response.results資料全部推入到userList陣列中
    renderPaginator(userList.length)
    renderUserList(getUserListByPage(1)) // 02. 呼叫渲染人物清單這個方法
  })
  .catch((err) => console.log(err))
