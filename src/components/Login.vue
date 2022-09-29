<template>
  <div class="login-page">
    <div class="form">
      <div>
        <p>WELCOME</p>
        <form  @submit="sendForm">
        <input class="login-input" v-model="login" placeholder="Login">
        <input type="password" class="login-pass" v-model="password" placeholder="Password">
        <button @click="sendForm">LOGIN</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {keyCookie, serverUrl} from "@/vue.config";
import VueRouter from 'vue-router'
import router from "@/router";
const { isNavigationFailure, NavigationFailureType } = VueRouter

export default {
  name: 'Login',
  data: function () {
    return {
      login: '',
      password: '',
    }
  },
  methods: {
    sendForm(e) {
      e.preventDefault();
      axios.post(serverUrl + 'auth/login', {
            username: this.login,
            password: this.password
          },
          {
            headers:{
              'Accept':'*/*'
            }
          }
      ).then((res) => {
        console.log(res)
        if (res.request.status === 200) {
          // console.log(res.data.passport.user._doc)
          this.$cookies.set(keyCookie, res.data.user.id)
          this.$store.dispatch('addInfoUser', res.data.user)
          if(res.data.user.role === "ADMIN"){
            this.$router.push('/dashboard/projects')
          }else if(res.data.user.role === "USER"){
            this.$router.push('/profile')
          }
        } else {
          this.$toasted.error(res.response.data.message)
        }
      }).catch(()=> this.$toasted.error('Server off'))
    }
  },
}
</script>

<style scoped>

.login-page {
  width: 100%;
  height: 100vh;
  background: url("/img/back-login.jpg") no-repeat;
  background-size: cover;
  position: relative;
}

.login-page p {
  font-size: 2.5rem;
  font-weight: 500;
  margin: 0 auto 15px auto;
}

.form {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  width: 600px;
  height: 400px;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  text-align: center;
}

.form div {
  width: 100%;
}

.login-input, .login-pass {
  display: block;
  width: 90%;
  height: 35px;
  background: #fff;
  border-radius: 10px;
  outline: none;
  border: none;
  padding: 5px 10px;
  margin: 0 auto 15px auto;
}

.form button {
  width: 200px;
  height: 35px;
  border: none;
  border-radius: 10px;
  background: #A779A8;
  color: #fff;
  font-weight: 500;
}

@media (max-width: 700px) {
  .form {
    width: 100%
  }
}

</style>
