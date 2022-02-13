<template>
  <div class="container">
    <h1>Customer List</h1>
    <div class="col-md-6 mb-3">
      <form class="d-flex">
        <input
          v-model="keyword"
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button class="btn btn-outline-success" @click.prevent="search()">
          Search
        </button>
      </form>
    </div>
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
        <tr v-for="(customer, index) in customers.data" :key="index">
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
    <pagination
      align="center"
      :data="customers"
      @pagination-change-page="list"
    ></pagination>
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
                  <a href="/src/assets/Customer.csv" download
                    >Download Sample CSV file</a
                  >
                </div>
                <!-- <div class="float-start">
                  <small
                    >(If you have multiple phone numbers, add them comma
                    separated in the phone column)</small
                  >
                </div> -->
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
import pagination from 'laravel-vue-pagination'
var $ = require('jquery')
export default {
  name: 'Dashboard',
  components: {
    pagination
  },
  data () {
    return {
      customers: [],
      Update: false,
      file: '',
      customerData: {
        phones: [
          {
            phone: ''
          }
        ]
      },
      keyword: null
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
          this.customers = res.data
        })
        .catch((error) => {
          console.log(error)
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
          if (res.data.status === 1) {
            this.$toasted.success(res.data.res, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 1000
            })
            this.getCustomers()
            this.resetCustomerForm()
          } else {
            this.$toasted.error(res.data.res, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 1000
            })
          }
        })
        .catch((error) => {
          console.error(error)
          this.$toasted.error('Error', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 1000
          })
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
          if (res.data.status === 1) {
            this.$toasted.success(res.data.res, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 1000
            })
            this.getCustomers()
          } else {
            this.$toasted.error(res.data.res, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 1000
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    deleteCustomer: function (id) {
      axios
        .delete('http://abc_api.test/api/customers/' + id)
        .then((res) => {
          if (res.data.status === 1) {
            this.$toasted.success(res.data.res, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 1000
            })
            this.getCustomers()
          } else {
            this.$toasted.error(res.data.res, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 1000
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    handleFileUpload: function () {
      this.file = this.$refs.file.files[0]
    },
    uploadCSV: function () {
      this.errors = []
      const formData = new FormData()
      formData.append('file', this.file)
      if (this.errors.length === 0) {
        axios
          .post('http://abc_api.test/api/customers-import', formData)
          .then((res) => {
            if (res.data.status === 1) {
              this.$toasted.success(res.data.res, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 1000
              })
              this.getCustomers()
            } else {
              this.$toasted.error(res.data.res, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 1000
              })
            }
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response)
            }
          })
      }
    },
    search: function () {
      axios
        .get('http://abc_api.test/api/customers?key=' + this.keyword)
        .then((response) => {
          this.customers = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    resetCustomerForm: function () {
      this.customerData = {
        phones: [
          {
            phone: ''
          }
        ]
      }
    },
    async list (page = 1) {
      await axios
        .get(`http://abc_api.test/api/customers?page=${page}`)
        .then((response) => {
          this.customers = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
