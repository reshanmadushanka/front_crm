<template>
  <div class="container">
    <div class="col-md-6">
      <h1>Login</h1>
    </div>

    <form @submit.prevent="login" class="form">
      <div class="col-md-6">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input
          type="email"
          v-model="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
      </div>
      <div class="col-md-6">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          id="exampleInputPassword1"
        />
      </div>
      <br />
      <div class="col-md-6">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    login () {
      this.$store
        .dispatch('login', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push({ name: 'Dashboard' })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
