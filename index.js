const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const USER_PER_PAGE = 18

const users = []
let filteredUsers = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const switchPanel = document.querySelector("#switch-mode")

let mode = "card";
let page = 1;

function renderUserMode(data) {
  mode === "card" ? switchToCardMode(data) : switchToListMode(data);
}

function switchToCardMode(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `
    <div class="col-4 col-sm-3 col-lg-2">
      <div class="mb-2">
        <div class="card">
          <img src="${item.avatar}" class="card-img-top" alt="User Poster">
          <div class="card-body bg-light">
            <h5 class="card-title">${item.name}</h5>
          </div>
          <div class="card-footer d-flex justify-content-around">
          <button class="btn btn-dark btn-show-user" data-toggle="modal" 
          data-target="#user-modal" data-id="${item.id}">more</button>
          <i class="fa fa-heart fa-2x" id="heartstyle" data-id="${item.id}" aria-hidden="true"></i>
</i>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function switchToListMode(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `
          <table class="table">
            <tbody>
              <tr>
                <td class="d-flex justify-content-between">
<span><img src="${item.avatar}" style="width:80px;">
                  ${item.name} ${item.surname}</span>

                  <div class="cardButton">
                    <button class="btn btn-dark btn-show-user" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
<i class="fa fa-heart fa-2x" id="heartstyle" data-id="${item.id}" aria-hidden="true"></i>
</i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>  
        `
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link text-dark" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USER_PER_PAGE
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

function showUserModal(id) {
  const userName = document.querySelector('#user-modal-name')
  const userEmail = document.querySelector('#user-modal-email')
  const userGender = document.querySelector('#user-modal-gender')
  const userAge = document.querySelector('#user-modal-age')
  const userRegion = document.querySelector('#user-modal-region')
  const userBirthday = document.querySelector('#user-modal-birthday')
  const userImage = document.querySelector('#user-modal-image')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    userName.innerText = data.name + '  ' + data.surname
    userEmail.innerText = 'email: ' + data.email
    userGender.innerText = 'gender: ' + data.gender
    userAge.innerText = 'age: ' + data.age
    userRegion.innerText = 'region: ' + data.region
    userBirthday.innerText = 'birthday: ' + data.birthday
    userImage.innerHTML = `<img src="${data.avatar}" alt="user-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)

  if (list.some((user) => user.id === id)) {
    return alert('此使用者已經在我的最愛中!')
  }

  list.push(user)

  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-heart')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

switchPanel.addEventListener("click", function onSwitchPanelClicked(event) {
  if (event.target.matches("#card-mode")) {
    mode = "card";
    renderUserMode(getUsersByPage(page));
  } else if (event.target.matches("#list-mode")) {
    mode = "list";
    renderUserMode(getUsersByPage(page));
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)

  renderUserMode(getUsersByPage(page))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()


  filteredUsers = users.filter((user) => user.name.toLowerCase().includes(keyword))

  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的使用者`)
  }

  renderPaginator(filteredUsers.length)
  renderUserMode(getUsersByPage(1))
})

axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  renderUserMode(getUsersByPage(1))
})