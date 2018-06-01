<template lang="html">
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

              <div class="mt-3 text-center">
                Don't have an account? <a href="#">Create One</a>
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
    }
  },
  methods: {
    signIn () {
      if (this.email && this.password) {
        this.$Progress.start()

        return this.SIGN_IN({ email: this.email, password: this.password })
          .then(() => {
            // In the next iteration we will add the Vue router
            // and we will route the user to the cronjobs list page
            this.$Progress.finish()
          })
          .catch((err) => {
            // In the next iteration we wil notify the user using a notifier
            console.err('err :', err)
            this.$Progress.finish()
          })
      }

      return Promise.resolve()
    },
    ...mapActions('authentication', ['SIGN_IN']),
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/sign-form";
</style>

