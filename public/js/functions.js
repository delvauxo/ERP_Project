/**
 * Function - Fetch datas.
 * @param {String} url - URL of the API to fetch.
 * @returns Object with datas.
 */
 async function fetchDatas(url) {
    return fetch(url)
    .then(res => res.json())
}

/**
* ASYNC Function - Get all products.
*/
const getProducts = async function() {
    const response = await fetch('http://localhost:3000/products')
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.error('Error : ', response.status);
    }
}

/**
* ASYNC Function - Get all suppliers.
*/
const getSuppliers = async function() {
    const response = await fetch('http://localhost:3000/suppliers')
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.error('Error : ', response.status);
    }
}

/**
* ASYNC Function - Get all customers.
*/
const getCustomers = async function() {
    const response = await fetch('http://localhost:3000/customers')
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
 */
const insertProduct = async function(objectData) {
    const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectData)
    })
    if (response.ok) {
        await response.json()
    } else {
        console.error('Server : ' + response.status)
    }
}

/**
 * ASYNC Function - Insert new supplier datas in API database.
 * @param {object} objectData - Object of datas.
 */
const insertSupplier = async function(objectData) {
    const response = await fetch('http://localhost:3000/suppliers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectData)
    })
    if (response.ok) {
        await response.json()
    } else {
        console.error('Server : ' + response.status)
    }
}

/**
 * ASYNC Function - Insert new customer datas in API database.
 * @param {object} objectData - Object of datas.
 */
const insertCustomer = async function(objectData) {
    const response = await fetch('http://localhost:3000/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectData)
    })
    if (response.ok) {
        await response.json()
    } else {
        console.error('Server : ' + response.status)
    }
}





const formSubmit = function(htmlForm, className, insertFunction, getFunction, idModal) {

    // On form Submit.
    htmlForm.addEventListener('submit', (e) => {
        
        // Prevent default behavior.
        e.preventDefault()
        // Retrieve datas from form.
        const formData = new FormData(e.target)
        const datas = Object.fromEntries(formData)
    
        // Instanciate new class Object with form datas.
        const product = Object.assign(datas, className)
        console.log(product)

        // Insert new Product in API database.
        insertFunction(product)
        .then(async function() {
            // Hide modal after datas sent (jQuery).
            $(idModal).modal('hide')
            // Reset form after modal is hidden.
            htmlForm.reset()
            // Fetch new datas after form reset.
            const products  = await getFunction()
            // Reload listing with new data inserted after getting new listing with new product.
            createTable(products, document.querySelector('#listing'))
        })
    })

}















/**
 * Function - Capitalize first letter.
 * @param {String} string - String to capitalize first letter.
 * @returns Given string with first letter capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


/**
 * Function - Create countries name options for HTML select.
 * @param {html} selectElem - HTML select to insert countries options.
 */
function loadCountries(selectElem) {
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
 * Function - Create Listing of datas from API.
 * @param {array} arrayLinks - Links that have data-listing attribute.
 * @param {html} inputSubmit - Input type submit button.
 */
function createListingDatas(arrayLinks, inputSubmit) {
    // For each link.
    for (const link of arrayLinks) {
        link.addEventListener('click', async function(e) {
            // Cancel default behavior.
            e.preventDefault()
            // Fetch datas from API.
            const datas = await fetchDatas(window.location.origin + '/' + this.dataset.listing + 's')
            // Create HTML products listing table.
            createTable(datas, document.querySelector('#listing'))
            // Scroll to top of listing just created.
            document.querySelector('#listing').scrollIntoView()
            // Display add button.
            inputSubmit.classList.remove('d-none')
            // Set attributes to add button.
            inputSubmit.setAttribute('value', 'Add a ' + capitalizeFirstLetter(this.dataset.listing))
            inputSubmit.setAttribute('data-page', this.dataset.listing)
            inputSubmit.setAttribute('data-bs-target', '#' + this.dataset.listing + 'Modal')
            // On add button click.
            inputSubmit.addEventListener('click', async function(e) {
                // Stop propagation if click on multiples menu btns before add item.
                e.stopImmediatePropagation()
                // If page is PRODUCT.
                if (this.dataset.page === 'product') {
                    // Fetch suppliers datas from API.
                    const suppliers  = await fetchDatas(window.location.origin + '/suppliers')
                    // Add suppliers to new product select form.
                    createSelectOptions(suppliers, document.querySelector('#product-supplier'))
                    // Load countries datas from API and insert them in select.
                    loadCountries(document.querySelector("#product-country"))
                }
            })
        })
    }
}

/**
 * Function - Create select options with datas and insert it into HTML DOM element.
 * @param {Array} datas - Array of datas.
 * @param {html} htmlElem - DOM HTML element.
 */
function createSelectOptions(datas, htmlElem) {
    let html = ''
    for (const data of datas) {
        html += `<option>${data.name}</option>`
    }
    if(htmlElem) {
        htmlElem.innerHTML = html
    }
}

/**
 * Function - Create HTML table with datas and insert it into DOM HTML element.
 * @param {Array} datas - Array of datas.
 * @param {html} htmlElem - DOM HTML element.
 */
function createTable(datas, htmlElem) {

    let html = ''
    // If at least 1 data exists.
    if(datas.length > 0) {
        html += `<div class="table-responsive">`
        html += `<table class="table table-dark table-hover table-bordered">`
        html += `<thead>`
        for (const key of Object.keys(datas[0])) {
            html += `<th>${key}</th>`
        }
        html += `</thead>`
        for (const data of datas) {
            html += `<tr>` 
            for (const value of Object.values(data)) {
                html += `<td>${value}</td>` 
            }
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
}

// Navigation bar Menu fixed to top of the screen when scrolling down.
document.addEventListener("DOMContentLoaded", function(){
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
          document.getElementById('navbar_top').classList.add('fixed-top');
          // add padding top to show content behind navbar
          navbar_height = document.querySelector('.navbar').offsetHeight;
          document.body.style.paddingTop = navbar_height + 'px';
        } else {
          document.getElementById('navbar_top').classList.remove('fixed-top');
           // remove padding top from body
          document.body.style.paddingTop = '0';
        } 
    });
  }); 