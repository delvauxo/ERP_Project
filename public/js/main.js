import includeHTMLs from "./includes.js"
import Supplier from "../models/Supplier.js"
import Product from "../models/Product.js"
import Customer from "../models/Customer.js"

// Make HTML includes.
await includeHTMLs(document.querySelectorAll('[include-html]'))

// Create listings.
const listings = document.querySelectorAll('[data-listing]')
for (const listing of listings) {
    listing.addEventListener('click', function(e) {
        // Cancel default behavior.
        e.preventDefault()
        // Create listing.
        createListingDatas(listing)
    })
}

// On form Submits new form datas are sent to API database.
formSubmit(document.querySelector('#form-product'), Product, insertProduct, getProducts, '#productModal')
formSubmit(document.querySelector('#form-supplier'), Supplier, insertSupplier, getSuppliers, '#supplierModal')
formSubmit(document.querySelector('#form-customer'), Customer, insertCustomer, getCustomers, '#customerModal')
