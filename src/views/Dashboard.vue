<template>
  <div class="container">
    <h1>Customer List</h1>
    <div class="col-md-3 ms-auto">
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#customerFormModal"
        @click.prevent=";(Update = false), resetCustomerForm()"
      >
        Add Customer
      </button>
      <button
        class="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#csvUploadFormModal"
      >
        Upload CSV
      </button>
    </div>
    <table class="table table-striped">
      <thead>
        <th>ID</th>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Phone</th>
        <th>Action</th>
      </thead>
      <tbody>
        <tr v-for="(customer, index) in customers" :key="index">
          <td>{{ customer.id }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.first_name }}</td>
          <td>{{ customer.last_name }}</td>
          <td class="text-left">
            <li v-for="phone in customer.phones" :key="phone.id">
              {{ phone.phone }}
            </li>
          </td>
          <td>
            <button
              class="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#customerFormModal"
              @click.prevent=";(Update = true), showCustomer(customer.id)"
            >
              Edit
            </button>
            <button
              class="btn btn-danger"
              @click.prevent="deleteCustomer(customer.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="modal fade"
      id="customerFormModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-if="Update" class="modal-title" id="staticBackdropLabel">
              Update Customer
            </h5>
            <h5 v-else class="modal-title" id="staticBackdropLabel">
              Create Customer
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form id="customerForm" action="" method="post">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="form-floating">
                    <input
                      type="hidden"
                      name="customer_id"
                      id="customer_id"
                      value="0"
                    />
                    <input
                      type="text"
                      name="first_name"
                      id="first-name"
                      placeholder="First Name"
                      class="form-control"
                      v-model="customerData.first_name"
                    />
                    <label for="first-name">First Name</label>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="form-floating">
                    <input
                      type="text"
                      name="last_name"
                      id="last-name"
                      placeholder="Last Name"
                      class="form-control"
                      v-model="customerData.last_name"
                    />
                    <label for="last-name">Last Name</label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="form-floating">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      class="form-control"
                      required
                      v-model="customerData.email"
                    />
                    <label for="email">Email</label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div
                  class="form-group row"
                  v-for="(phones, i) in customerData.phones"
                  :key="i"
                >
                  <div class="col-sm-12 col-lg-10">
                    <input
                      type="tel"
                      class="form-control"
                      v-model="phones.phone"
                      :name="'phone[' + i + ']'"
                      placeholder="Phone"
                    />
                  </div>
                  <div class="col-sm-12 col-lg-2" v-if="i > 0">
                    <button
                      type="button"
                      @click.prevent="remove(i, phones.phone)"
                      title=""
                      class="data-toggle-tooltip btn btn-outline-danger btn-circle btn-sm"
                      data-original-title="Delete"
                      aria-describedby=""
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-12 col-lg-12 text-center">
                    <button
                      @click.prevent="addRaw()"
                      type="button"
                      class="btn btn-secondary btn-rounded btn-sm btn-rounded-icon"
                    >
                      <i
                        class="mdi mdi-plus-circle-outline text-themecontrast"
                      ></i>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              v-if="Update"
              type="button"
              class="btn btn-primary"
              @click.prevent="updateCustomer(customerData.id)"
            >
              Update
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              @click.prevent="addCustomer()"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="csvUploadFormModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Upload CSV</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <input
                  class="form-control"
                  type="file"
                  id="file"
                  ref="file"
                  v-on:change="handleFileUpload()"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 mb-3">
                <div class="float-start">
                  <small
                    >CSV Header Row Format: first_name, last_name, address1,
                    address2, city, email, phone</small
                  >
                </div>
                <div class="float-start">
                  <small
                    >(If you have multiple phone numbers, add them comma
                    separated in the phone column)</small
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click.prevent="uploadCSV()"
            >
              Upload CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
var $ = require('jquery')
export default {
  name: 'Dashboard',
  data () {
    return {
      customers: [],
      Update: false,
      errors: [],
      file: '',
      customerData: {
        phones: [
          {
            phone: ''
          }
        ]
      },
      searchText: null,
      emailPattern: /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
    }
  },
  mounted () {
    this.getCustomers()
  },
  methods: {
    getCustomers: function () {
      axios
        .get('http://abc_api.test/api/customers')
        .then((res) => {
          this.customers = res.data.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    addRaw: function () {
      this.customerData.phones.push({})
    },
    remove: function (index, data) {
      var indexes = this.customerData.phones.findIndex(function (person) {
        return person.phone === data
      })
      if (index !== -1) this.customerData.phones.splice(indexes, 1)
    },
    addCustomer: function () {
      axios
        .post(
          'http://abc_api.test/api/customers',
          $('#customerForm').serialize()
        )
        .then((res) => {
          this.getCustomers()
          this.resetCustomerForm()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    showCustomer: function (id) {
      axios
        .get(
          'http://abc_api.test/api/customers/' + id,
          $('#customerForm').serialize()
        )
        .then((res) => {
          this.customerData = res.data.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    updateCustomer: function (id) {
      axios
        .put(
          'http://abc_api.test/api/customers/' + id,
          $('#customerForm').serialize()
        )
        .then((res) => {
          this.getCustomers()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    deleteCustomer: function (id) {
      axios
        .delete('http://abc_api.test/api/customers/' + id)
        .then((res) => {
          this.getCustomers()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
    },
    searchCustomers () {
      var term = this.searchText ? this.searchText : 'all'
      axios
        .get('http://localhost:8000/api/v1/search_customers/' + term)
        .then((response) => {
          var result = response.data
          console.log(result)
          this.customerData = result
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    uploadCSV () {
      this.errors = []
      if (!$('#file').val()) this.errors.push('File is required')

      const formData = new FormData()
      formData.append('file', this.file)

      if (this.errors.length === 0) {
        axios
          .post('http://localhost:8000/api/v1/upload_csv', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            var result = response.data
            console.log(result)
            if (result.status === 1) {
              $('.success-message').html(result.res)
              $('.success-message').show()
              setTimeout(() => {
                $('.success-message').hide()
              }, 2000)
              this.file = ''
              this.getCustomers()
            } else {
              $('.fail-message').html(result.res)
              $('.fail-message').show()
              setTimeout(() => {
                $('.fail-message').hide()
              }, 2000)
            }
          })
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              console.log('error.response.data')
              console.log(error.response.data)
              console.log(error.response.status)
              console.log(error.response.headers)
            } else if (error.request) {
              // The request was made but no response was received
              console.log('error.request')
              console.log(error.request)
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message)
            }
          })
      }
    },
    resetCustomerForm: function () {
      this.customerData = {
        phones: [
          {
            phone: ''
          }
        ]
      }
    }
  }
}
</script>
