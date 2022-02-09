// 
// Global Variables.
// 
const domainName = 'http://localhost:3000'

/**
 * Function - Fetch data.
 * @param {String} url - URL of the API to fetch.
 * @returns Object with datas.
 */
 async function fetchData(url) {
    return fetch(url)
    .then(res => res.json())
}

/**
* ASYNC Function - Get all items.
 * @param {string} apiPath - Path of the API to fetch.
*/
const getItems = async function(apiPath) {
    const response = await fetch(domainName + apiPath)
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.error('Error : ', response.status);
    }
}

/**
 * ASYNC Function - Insert new product datas in API database.
 * @param {object} objectData - Object of datas.
 * @param {string} apiPath - Path of the API to fetch.
 */
const insertItem = async function(objectData, apiPath) {
    const response = await fetch(domainName + apiPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectData)
    })
    if (!response.ok) {
        console.error('Error : ' + response.status)
    }
    // Fetch new datas after form reset.
    const items  = await getItems(apiPath)
    // Reload listing with new data inserted after getting new listing with new item.
    createTable(items, document.querySelector('#listing'))
}

/**
 * Function - Delete listing item.
 * @param {Number} id - ID of the item to delete.
 */
const deleteItem = async function(id) {
    const page = document.querySelector('#btn-add').dataset.path
    await fetch(domainName + '/' + page + '/' + id, {method: 'DELETE'})
    // Fetch new items without last item deleted.
    const items  = await getItems('/' + page)
    // Reload listing with new data inserted after getting new listing with new product.
    createTable(items, document.querySelector('#listing'))
}

/**
 * Function - Edit listing item.
* @param {Number} id - ID of the item to edit.
*/
const editItem = async function(id) {
    const page = document.querySelector('#btn-add').dataset.path
    const response = await fetch(domainName + '/' + page + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(objectData) from function params
        body: JSON.stringify({
            id: '',
            name: 'edited name',
            category: 'edited category',
            origin: 'edited country',
            stock: 'edited stock',
            price_sell: 'edited price_sell',
            supplier: 'edited supplier',
            price_supplier: 'edited price_supplier'
        })
    })
    console.log(response)
    // Fetch new items with last edited item.
    const items  = await getItems('/' + page)
    // Reload listing with new data inserted after getting new listing with new product.
    createTable(items, document.querySelector('#listing'))
}

/**
 * Function - Create HTML table with datas and insert it into DOM HTML element.
 * @param {Array} datas - Array of datas.
 * @param {html} htmlElem - DOM HTML element.
 */
const createTable = function(datas, htmlElem) {
    let html = ''
    // If at least 1 data exists.
    if(datas.length > 0) {
        html += `<div class="table-responsive">`
        html += `<table class="table table-dark table-hover">`
        html += `<thead>`
        for (const key of Object.keys(datas[0])) {
            html += `<th>${key}</th>`
        }
        html += `<th>Actions</th>`
        html += `</thead>`
        for (const data of datas) {
            html += `<tr>` 
            for (const value of Object.values(data)) {
                html += `<td>${value}</td>` 
            }
            html += `<td class="listing-item-actions">`
            html += `<input class="btn btn-warning btn-sm" type="button" value="Edit" data-index="${data.id}">`
            html += `<input class="btn btn-danger btn-sm" type="button" value="Delete" data-index="${data.id}">`
            html += `</td>`
            html += `</tr>`
        }
        html += `</table>`
        html += `</div>`
        
        htmlElem.innerHTML = html
    } else {
        // No product in API database.
        html = '<span>There is no product.</span>'
        htmlElem.innerHTML = html
    }
    // Set delete event on action buttons.
    setActionBtnEvent(document.querySelectorAll('#listing .listing-item-actions .btn-danger'), deleteItem)
    // Set edit event on action buttons.
    setActionBtnEvent(document.querySelectorAll('#listing .listing-item-actions .btn-warning'), editItem)
}

/**
 * Function - Set events for the action button.
 * @param {array} arrayBtns - Buttons to set action events.
 * @param {function} btnFunction - Function to use for the action.
 */
const setActionBtnEvent = function(arrayBtns, btnFunction) {
    // Set edit action buttons events.
    for (const btn of arrayBtns) {
        // On delete button click.
        btn.addEventListener('click', function() {
            // Get ID of item to delete.
            const id = this.dataset.index
            // Edit item.
            btnFunction(id)
        })
    }
}

/**
 * Function - Create Listing of datas from API.
 * @param {html} listing - HTML listing element having [data-listing] attribute.
 */
const createListing = async function(listing) {
    // Hide Hero section.
    hideHtmlElem(document.querySelector('#hero'))
    // Add listing title.
    document.querySelector('#listing-title').innerHTML = capitalizeFirstLetter(listing.dataset.path)
    // Fetch new items with last edited item.
    const items  = await getItems('/' + listing.dataset.path)
    // Create HTML products listing table.
    createTable(items, document.querySelector('#listing'))
    // Display add button of current listing.
    showListingAddBtn(listing)
}

/**
 * Function - Link and update add button with listing.
 * @param {Object} listing - Listing to link with add button.
 */
const showListingAddBtn = function(listing) {
    const inputSubmit = document.querySelector('#btn-add')
    // Display add button.
    inputSubmit.classList.remove('d-none')
    // Set attributes to add button.
    inputSubmit.setAttribute('value', 'Add a ' + capitalizeFirstLetter(listing.dataset.listing))
    inputSubmit.setAttribute('data-page', listing.dataset.listing)
    inputSubmit.setAttribute('data-path', listing.dataset.path)
    inputSubmit.setAttribute('data-bs-target', '#' + listing.dataset.listing + 'Modal')
    // On add button click.
    inputSubmit.addEventListener('click', async function(e) {
        // Stop propagation if click on multiples menu btns before add item.
        e.stopImmediatePropagation()
        // If page is PRODUCT.
        if (this.dataset.page === 'product') {
            // Fetch new items with last edited item.
            const suppliers  = await getItems('/suppliers')
            // Add suppliers to new product select form.
            createSelectOptions(suppliers, document.querySelector('#product-supplier'))
            // Load countries datas from API and insert them in select.
            loadCountries(document.querySelector("#product-country"))
        }
    })    
}

/**
 * Function - Create countries name options for HTML select.
 * @param {html} selectElem - HTML select to insert countries options.
 */
const loadCountries = function(selectElem) {
    fetch("https://restcountries.com/v3.1/all")
    .then(function(response){
        if(response.ok){
            response.json().then(function(countries){
                // Sort objects in an array alphabetically on one property of the array.
                let countriesSort = countries.sort(function(a, b) {
                    var textA = a.name.common
                    var textB = b.name.common
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
                })
                let html = ''
                for (const country of countriesSort) {
                    html += `<option>${country.name.common}</option>`
                }
                if(selectElem) {
                    selectElem.innerHTML = html
                }
            })
        }
    })
}

/**
 * Function - Create select options with datas and insert it into HTML DOM element.
 * @param {Array} datas - Array of datas.
 * @param {html} htmlElem - DOM HTML element.
 */
const createSelectOptions = function(datas, htmlElem) {
    let html = ''
    for (const data of datas) {
        html += `<option>${data.name}</option>`
    }
    if(htmlElem) {
        htmlElem.innerHTML = html
    }
}

/**
 * Function - On form submit, insert new item in API database.
 * @param {html} htmlForm - Form to be submited.
 * @param {class} className - Class object.
 * @param {function} insertFunction - The appropriate function item to insert.
 * @param {function} getFunction - The appropriate function item to get.
 * @param {string} idModal - HTML id value of the modal to be shown.
 * @param {string} apiPath - Path of the API to fetch.
 */
const formSubmit = function(htmlForm, className, apiPath, idModal) {
    // On form Submit.
    htmlForm.addEventListener('submit', (e) => {
        // Prevent default behavior.
        e.preventDefault()
        // Retrieve datas from form.
        const formData = new FormData(e.target)
        const datas = Object.fromEntries(formData)
        // Instanciate new class Object with form datas.
        const item = Object.assign(datas, className)
        // Insert new Product in API database.
        insertItem(item, apiPath)
        .then(async function() {
            // Hide modal after datas sent (jQuery).
            $(idModal).modal('hide')
            // Reset form after modal is hidden.
            htmlForm.reset()
        })
    })
}

/**
 * Function - Hide HTML element with Bootstrap class d-none.
 * @param {Node} element - HTML element node to hide.
 */
const hideHtmlElem = function (element) {
    // Hide HTML element.
    element.classList.add('d-none')
}

/**
 * Function - Capitalize first letter.
 * @param {String} string - String to capitalize first letter.
 * @returns Given string with first letter capitalized.
 */
const capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}