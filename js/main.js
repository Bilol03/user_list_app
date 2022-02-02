class UserSystem {
	usersStatusDisabled = document.querySelector("#users-status-disabled")
	usersStatusActive = document.querySelector("#users-status-active")
	usersStatusAny = document.querySelector("#users-status-any")
	confirmPassword = document.querySelector('#confirmPassword')
	fullNameInput = document.querySelector('#fullNameInput')
	usernameInput = document.querySelector('#usernameInput')
	paginationPart = document.querySelector('.pagination')
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

	editUser (element) {
		const userId = element.parentNode.parentNode.parentNode.dataset.userid
		let saveChanges = document.querySelector('#saveChanges')
		saveChanges.onclick = el => {
			el.preventDefault()
			if( !this.fullNameInput.value || this.fullNameInput.value > 30 || !this.usernameInput.value || this.usernameInput.value > 20 || this.bioInput.value > 200 || !this.emailInput.value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
				return alert("Thomething is wrong with you")
			}
	
			let users = this.users
			const user = users.find(user => user.userId == userId)
			user.fullName = this.fullNameInput.value
			user.username = this.usernameInput.value
			user.email = this.emailInput.value
			user.bio = this.bioInput.value
			user.password = this.confirmPassword.value
			this.save(users)
			this.renderUsers(users)
			window.location = 'index.html'

		}
	}

	deleteUser (element) {
		let users = this.users
		const userId = element.parentNode.parentNode.parentNode.dataset.userid
		const index = users.findIndex(user => user.userId == userId)
		element.parentNode.parentNode.parentNode.remove()
		users.splice(index, 1)
		this.save(users)
	}


	createUser () {
		let saveChanges = document.querySelector('#saveChanges')
		saveChanges.onclick = el => {
			el.preventDefault()
			let users = this.users
			
			if( !this.fullNameInput.value || this.fullNameInput.value > 30 || !this.usernameInput.value || this.usernameInput.value > 20 || this.bioInput.value > 200 || !this.emailInput.value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
				return alert("Something is wrong with you")
			}

			if( !this.newPassword.value || this.newPassword.value.length < 8 || this.newPassword.value != this.confirmPassword.value || !this.confirmPassword.value) {
				return alert("Password is wrong with you")
			}

			users.push({
				userId : users.length ? users.length + 1 : 1,
				fullName : this.fullNameInput.value,
				username : this.usernameInput.value,
				email : this.emailInput.value,
				bio : this.bioInput.value ? this.bioInput.value : null,
				password : this.confirmPassword.value,
				selected: false, 
				active: false 
			})
			this.save(users)
			this.renderUsers(users)
			window.location = 'index.html'
		}
	}

	selectUser (element, parentElement) {
		const users = this.users

		if(element) {
			const userId = element.parentNode.parentNode.parentNode.dataset.userid
			const user = users.find(user => user.userId == userId)
			user.selected = element.checked
		}

		if(parentElement) {
			for(let user of users) {
				user.selected = parentElement.checked

				let htmlEl = document.querySelector('#item-' + user.userId)
				if(htmlEl) htmlEl.checked = parentElement.checked
			}
		}

		this.save(users)
	}


	paginationButtons () {
		const numberOfPages = Math.ceil(this.users.length / this.limit)

		this.paginationPart.innerHTML = null
		for(let page = 1; page <= numberOfPages; page++) {
			let newButtonEl = buttonsEl({ page })
			this.paginationPart.innerHTML += newButtonEl
		}
	}

	findPage (html) {
		const buttons = document.querySelectorAll('.page-item')
		buttons.forEach(el => el.classList.remove('active'))

		html.classList.add('active')
		this.renderUsers({ page: html.dataset.page })
	}

	disabled () {
		this.usersStatusDisabled.onclick = el => {
			this.renderUsers({active : false})
		}
	}

	
	active() {
		this.usersStatusActive.onclick = el => {
			this.renderUsers({active : true})
		}
	}
	
	any () {
		let users = this.users
		this.usersStatusAny.onclick = el => {
			this.renderUsers(users)
		}
	}

}


let newUser = document.querySelector('#newUser')



const userSystem = new UserSystem()
userSystem.renderUsers({})
userSystem.paginationButtons()
userSystem.disabled()
userSystem.active()
userSystem.any()
const searchInput = document.querySelector('.w-100')

// event handlers
function selectUser (html) {
	userSystem.selectUser(html)
}

function toggleUser (html) {
	userSystem.toggleUser(html)
}

function editUser(html) {
	userSystem.editUser(html)
	userSystem.clearInput()
}


function deleteUsers(html) {
	userSystem.deleteUser(html)
}

newUser.onclick = el => {
	el.preventDefault
	userSystem.clearInput()
	userSystem.createUser()
}


function selectAllUsers (html) {
	userSystem.selectUser(null, html)
}

function findPage(html) {
	userSystem.findPage(html)
}

searchInput.onkeyup = el => {
	el.preventDefault()
	userSystem.renderUsers({search : searchInput.value})
}





