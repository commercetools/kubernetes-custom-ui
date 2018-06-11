<template>
  <div class="sign-up">
    <div class="row justify-content-md-center h-100">
      <div class="card-wrapper">
        <div class="brand">
          <img src="~@/assets/img/logo.png" />
        </div>
        <div class="card fat">
          <div class="card-body">
            <h4 class="card-title text-center">Register</h4>
            <form id="form-sign-in" @submit.prevent="signUp" method="post">

              <div class="form-group">
                <label for="firstName">First Name</label>

                <input id="firstName" type="text" class="form-control"
                  name="firstName" v-model.trim="firstName" required autofocus>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>

                <input id="lastName" type="text" class="form-control"
                  name="lastName" v-model.trim="lastName" required >
              </div>


              <div class="form-group">
                <label for="email">E-Mail</label>

                <input id="email" type="email" class="form-control"
                  name="email" v-model.trim="email" required >
              </div>

              <div class="row">
                 <div class="form-group col-md-6">
                <label for="password">Password</label>
                <input id="password" type="password" class="form-control"
                  name="password" v-model.trim="password" required>
              </div>

              <div class="form-group col-md-6">
                <label for="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" class="form-control"
                  name="confirmPassword" v-model.trim="confirmPassword" required>
              </div>
              </div>

              <div class="form-group mt-4">
                <button type="submit" class="btn btn-primary btn-block">
                  Register
                </button>
              </div>

              <div class="mt-3 text-center">
                Already have an account?
                <router-link :to="{ name: 'Home' }">Login</router-link>
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    }
  },
  methods: {
    signUp () {
      if (this.allDataFullfilled()) {
        if (this.passwordsMatch()) {
          this.errorMessage = ''
          this.$Progress.start()

          return this.SIGN_UP({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
          })
            .then(() => {
              this.$Progress.finish()
              this.$router.push({ name: 'Dashboard' })
            })
            .catch((err) => {
              this.$Progress.finish()
              this.handleError(err)
            })
        }
        this.errorMessage = '"Password" and "Confirm password" fields don\'t match'
        return Promise.resolve()
      } return Promise.resolve()
    },
    allDataFullfilled () {
      return this.firstName && this.lastName && this.email && this.password && this.confirmPassword
    },
    passwordsMatch () {
      return this.password === this.confirmPassword
    },
    handleError (err) {
      if (err.response.status === 400)
        if (
          err.response.data.errors &&
          err.response.data.errors.some(errorDetail =>
            errorDetail.code === 'DuplicateField' && errorDetail.field === 'email')
        ) {
          this.errorMessage = `There is already a user with email "${this.email}"`
        } else this.errorMessage = err.response.data.message
      else this.errorMessage = 'Opsss, something went wrong. Please contact the administrator'
    },
    ...mapActions('authentication', ['SIGN_UP']),
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/sign-form";
</style>

