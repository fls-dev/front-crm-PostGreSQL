<template>
  <div>
    <Header />
    <div class="content">
      <Sidebar/>
      <router-view />
    </div>
  </div>
</template>

<script>

import Header from "@/templates/Header";
import Sidebar from "@/templates/Sidebar";
import DashboardContent from "@/components/projects/Projects";
import MenuInHeader from "@/templates/MenuInHeader";
import Projects from "@/components/projects/Projects";
export default {
  name: 'Dashboard',
  components: {DashboardContent, MenuInHeader, Sidebar, Header},
  metaInfo: {
    title: 'Dashboard'
  },
  data: function () {
    return {
      // user: this.$store.getters.USER,
      // userName: this.$store.getters.USER_NAME,
    }
  },
  mounted() {
    // console.log(this.$store.getters.USER)
  }
}
</script>
<style scoped>

</style>