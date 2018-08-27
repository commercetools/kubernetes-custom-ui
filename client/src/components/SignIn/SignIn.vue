<template>
  <div class="sign-in">
    <div class="row justify-content-md-center h-100">
      <div class="card-wrapper">
        <div class="brand">
          <img src="~@/assets/img/logo.png" />
        </div>
        <div class="card fat">
          <div class="card-body">
            <h4 class="card-title text-center">Login</h4>
            <form id="form-sign-in" @submit.prevent="signIn" method="post">

              <div class="form-group">
                <label for="email">E-Mail</label>

                <input id="email" type="email" class="form-control"
                  name="email" v-model.trim="email" required autofocus>
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input id="password" type="password" class="form-control"
                  name="password" v-model.trim="password" required>
              </div>

              <div class="form-group mt-5">
                <button type="submit" class="btn btn-primary btn-block">
                  Login
                </button>
              </div>

              <div class="error-message mt-3 text-center text-danger" v-show="errorMessage">
                <h6>{{errorMessage}}</h6>
              </div>
            </form>
          </div>
        </div>
        <div class="footer">
          Copyright &copy; 2018 &mdash; commercetools
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    signIn () {
      if (this.email && this.password) {
        this.$Progress.start()
        this.errorMessage = ''

        return this.SIGN_IN({ email: this.email, password: this.password })
          .then(() => {
            this.$Progress.finish()
            this.$router.push({ name: 'Dashboard' })
          })
          .catch((err) => {
            this.$Progress.finish()
            this.handleError(err)
          })
      }

      return Promise.resolve()
    },
    handleError (err) {
      if (err.response.status === 401) this.errorMessage = 'Invalid email or password'
      else this.errorMessage = 'Opsss, something went wrong. Please contact the administrator'
    },
    ...mapActions('authentication', ['SIGN_IN']),
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/sign-form";
</style>

