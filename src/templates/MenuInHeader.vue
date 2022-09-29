<template>
<div class="head-menu">
  <div class="menu-item">Project</div>
  <div class="menu-item">Task</div>
</div>
</template>

<script>
export default {
  name: "MenuInHeader"
}
</script>

<style scoped>
.head-menu{
  width: 90%;
  background: #fff;
  margin: 0 auto;
  border-radius: 0px 0px 5px 5px;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}
.menu-item{
  padding: 5px 10px;
  background: #FCC883;
  font-size: 1.6rem;
  border-radius: 5px;
}
</style>