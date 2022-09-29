<template>
  <div class="sidebar" :style={display:getSidebar}>
    <router-link class="menu-item" to="/users">
      <img class="img-menu" src="/img/icons/user.svg">Users
    </router-link>
    <router-link class="menu-item" to="/dashboard/projects">
      <img class="img-menu" src="/img/icons/planning.svg">Projects
    </router-link>
    <router-link class="menu-item" to="/tasks">
      <img class="img-menu" src="/img/icons/task.svg">Tasks
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data: function () {
    return {
      sidebar: this.$store.getters.SIDEBAR,
    }
  },
  computed: {
    getSidebar() {return this.$store.getters.SIDEBAR}
  },
  methods: {

  }
}
</script>

<style scoped>
.sidebar{ height: 100vh; flex-shrink: 0;
  background: #65A398;
  margin-top: 10px;
  width: 300px;
  border-radius: 0px 10px 0px 0px;
  overflow: hidden;
  padding: 20px;
}
.menu-item{
  color: #fff;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.img-menu{
  width: 25px;
  margin-right: 10px;
}

</style>
