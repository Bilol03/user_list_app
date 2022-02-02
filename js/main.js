class UserSystem {
	confirmPassword = document.querySelector('#confirmPassword')
	fullNameInput = document.querySelector('#fullNameInput')
	usernameInput = document.querySelector('#usernameInput')
	newPassword = document.querySelector('#newPassword')
	emailInput = document.querySelector('#emailInput')
	tableBody = document.querySelector('#tableBody')
	bioInput = document.querySelector('#bioInput')
	page = 1
	limit = 10

	get users () {
		const users = window.localStorage.getItem('users')
		return JSON.parse(users) || mockUsers
	}

	get html () {
		return {
			usersEl
		}
	}

	save (data) {
		window.localStorage.setItem('users', JSON.stringify(data))
		
	}

	renderUsers ({ active, search, page }) {
		// filter
		let users = this.users.filter(user => {
			let act = typeof(active) == 'boolean' ? user.active == active : true
			let sea = search ? user.fullName.toLowerCase().includes(search.toLowerCase()) : true

			return act && sea
		})

		// pagination
		page = page || this.page
		users = users.slice(page * this.limit - this.limit, this.limit * page)

		// render users
		this.tableBody.innerHTML = null
		for(let user of users) {
			let htmlEl = this.html.usersEl(user)
			this.tableBody.innerHTML += htmlEl
		}
	}

	selectUser (element) {
		const userId = element.parentNode.parentNode.parentNode.dataset.userid
		const users = this.users
		const user = users.find(user => user.userId == userId)
		user.selected = element.checked
		this.save(users)
	}

	toggleUser (element) {
		const userId = element.parentNode.parentNode.dataset.userid
		const users = this.users
		const user = users.find(user => user.userId == userId)

		user.active = !user.active
		this.save(users)

		let elementClass = element.classList[4]
		if(elementClass == 'fa-toggle-on') {
			element.classList.remove('fa-toggle-on')
			element.classList.add('fa-toggle-off')
		}

		if(elementClass == 'fa-toggle-off') {
			element.classList.remove('fa-toggle-off')
			element.classList.add('fa-toggle-on')
		}
	}

	clearInput() {
		this.usernameInput.value = null
		this.fullNameInput.value = null	
	}

	editUser () {
		if( !this.fullNameInput.value || this.fullNameInput.value > 30 || !this.usernameInput.value || this.usernameInput.value > 20 || this.bioInput.value > 200 || !this.emailInput.value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
			return alert("Thomething is wrong with you")
		}
		
		if( !this.newPassword.value || this.newPassword.value.length < 8 || this.newPassword.value != this.confirmPassword.value) {
			return alert("Something is wrong with you")
		}


		
	}
	deleteUser () {}
	paginateUsers () {}
	createUser () {}
}

let saveChanges = document.querySelector('#saveChanges')

const userSystem = new UserSystem()
userSystem.renderUsers({})


// event handlers
function selectUser (html) {
	userSystem.selectUser(html)
}

function toggleUser (html) {
	userSystem.toggleUser(html)
}

function editUser() {
	userSystem.clearInput()
}

saveChanges.onclick = (el) => {
	el.preventDefault()
	userSystem.editUser()
}