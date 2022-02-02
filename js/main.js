class UserSystem {
	tableBody = document.querySelector('#tableBody')
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

	editUser () {}
	deleteUser () {}
	paginateUsers () {}
	createUser () {}
}

const userSystem = new UserSystem()
userSystem.renderUsers({})


// event handlers
function selectUser (html) {
	userSystem.selectUser(html)
}

function toggleUser (html) {
	userSystem.toggleUser(html)
}