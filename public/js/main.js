import Supplier from "../models/Supplier.js"
import Product from "../models/Product.js"
import Customer from "../models/Customer.js"

// Get datas from API.
const customers = await getCustomers()
const products = await getProducts()
const suppliers = await getSuppliers()

// Create listing datas from API.
createListingDatas(document.querySelectorAll('#menu a[data-listing]'), document.querySelector('#btn-add'))

// On form Submits new form datas are sent to API database.
await formSubmit(document.querySelector('#form-product'), Product, insertProduct, getProducts, '#productModal')
await formSubmit(document.querySelector('#form-supplier'), Supplier, insertSupplier, getSuppliers, '#supplierModal')
await formSubmit(document.querySelector('#form-customer'), Customer, insertCustomer, getCustomers, '#customerModal')