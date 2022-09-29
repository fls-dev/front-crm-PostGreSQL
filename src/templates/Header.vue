<template>
  <div class="header">
    <div class="item">
      <button class="menu-trigger" v-bind:class="{ active: getSidebar }" @click="burgerAnimate">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <div class="head-menu">
      <div class="menu-item"><router-link to="/dashboard/projects">Projects</router-link></div>
      <div class="menu-item"><router-link to="/tasks">Tasks</router-link></div>
    </div>

    <div class="open-profile">
      <p>Привет, {{getName}}</p>
      <router-link to="/profile"><img class="user-avatar" :src=getAvatar></router-link>
      <img @click="logOut()" class="user-avatar" src="/img/logout.png">
    </div>
  </div>
</template>

<script>
import {keyCookie} from "@/vue.config";

export default {
  name: 'Header',
  data: function () {
    return {
      username:'',
    }
  },
  created() {
  },
  computed: {
    getSidebar() { return this.$store.getters.STATUS_SIDEBAR},
    getAvatar() { return this.$store.getters.USER_PHOTO},
    getName() { return this.$store.getters.USER_NAME},
  },
  methods: {
    burgerAnimate(){
      let display = 'none'
      if(this.$store.getters.SIDEBAR === "none"){
        display = "block"
      }
      this.$store.dispatch('openSidebar', display)
    },
    logOut(){
      $cookies.remove(keyCookie)
      this.$router.push('/')
    }
  },

  mounted() {
    // console.log(this.getName)
  }
}
</script>

<style scoped>
.header{
  display: flex;
  padding: 0px 25px;
  align-items: center;
  justify-content: space-between;
  width: 100%; height: 60px;
  background: #FCC883;
}
.open-profile p{margin: 0}
.user-avatar{width: 40px; height: 40px; border-radius: 50px;  object-fit: cover; object-position: top center; margin-left: 20px; cursor: pointer}
.open-profile{
  display: flex;
  align-items: center;
}
/*burger*/
.item {
  position: relative;
  width: auto;
  text-align: center;
  box-sizing: border-box;
  counter-increment: item;
}
.menu-trigger,
.menu-trigger span {
  display: inline-block;
  transition: all .4s;
  box-sizing: border-box;
}
.menu-trigger {
  position: relative;
  width: 35px;
  height: 23px;
  background: none;
  border: none;
  appearance: none;
  cursor: pointer;
}
.menu-trigger span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #fff;
  border-radius: 4px;
}
.menu-trigger span:nth-of-type(1) {
  top: 0;
}
.menu-trigger span:nth-of-type(2) {
  top: 10px;
}
.menu-trigger span:nth-of-type(3) {
  bottom: 0;
}
.menu-trigger.active span:nth-of-type(1),
.menu-trigger.active span:nth-of-type(3) {
  width: 20px;
}
.menu-trigger.active span:nth-of-type(1) {
  transform: translate(-2px,3px) rotate(-45deg);
}
.menu-trigger.active span:nth-of-type(3) {
  transform: translate(-3px,-4px) rotate(45deg);
}
/*menu*/
.head-menu{
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}
.menu-item{
  cursor: pointer;
  padding: 5px 10px;
  background: #fff;
  font-size: 1.6rem;
  border-radius: 5px;
}

@media (max-width: 700px) {
  .head-menu{display: none}
}

</style>
