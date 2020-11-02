const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'


const users = JSON.parse(localStorage.getItem('favoriteUsers'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


function renderUserList(data) {
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
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
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

function removeFromFavorite(id) {
  const userIndex = users.findIndex((user) => user.id === id)
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderUserList(users)