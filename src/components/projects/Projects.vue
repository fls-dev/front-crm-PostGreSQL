<template>
  <div class="container">
    <div class="projects">
      <button @click="refresh">REFRESH</button>
      <p v-if="loading">LOADING </p>
      <div v-else v-for="item of getProjects" class="item-project">
        <img @click="deleteProject(item._id)" class="delete-project" src="/img/icons/delete.svg">
        <router-link :to="{ name: 'EditProject', params: { projectId: item._id }}">
        <p class="name-project">{{ item.title }}</p>
        <p class="desc-project">{{ item.description.slice(0,110) }}</p>
          <div class="deadline">
            <div class="d-start">{{item.deadline.start}}</div>
            <div class="d-end">{{item.deadline.end}}</div>
          </div>
        <div class="participants">
          <div v-for="user in item.participants" class="no-photo">
            <img class="avatar" :src="serverUrl+user.avatar">
          </div>
        </div>
        <div class="completed" :style={width:item.completed}></div>
          <span class="rateProject">{{item.completed}}</span>
        </router-link>
      </div>
      <div class="item-project-add">
        <router-link to="/dashboard/add-project"><img class="add-project" src="/img/icons/plus.svg"></router-link>
      </div>
    </div>

  </div>
</template>

<script>

import axios from "axios";
import {keyCookie, serverUrl, sessionId} from "@/vue.config";

export default {
  name: "Projects",
  metaInfo: {
    title: 'Projects'
  },

  data: function () {
    return {
      projects: this.getProjects,
      loading: true,
      serverUrl: serverUrl
    }
  },
  computed: {
    getProjects() { return this.$store.getters.GET_USER_PROJECTS},
  },
  methods: {
    async loadDataProjects() {
      if (this.getProjects === false) {
        const id = $cookies.get(keyCookie)
        const get_projects = await axios.get(serverUrl + "projects/user/" + id)
        console.log(get_projects)
        if (get_projects.status === 200) {
          const projects = get_projects.data;
          console.log(projects)
          for(let p=0;p<projects.length;p++){
            const allCount = projects[p].tasks.length
            if(allCount === 0){
              projects[p].completed = "1%";
              continue;
            }else {
              let allTasks = projects[p].tasks
              let countC = 0
              for(let t=0;t<allTasks.length;t++){
                if(allTasks[t].status === 'completed'){
                  countC++
                }
              }
              let rate = Math.floor((100*countC)/allTasks.length)
              projects[p].completed = (rate === 0) ? "1%" :  rate+"%"
            }
          }
          await this.$store.dispatch('addProjectsUser', projects)
          await this.$store.dispatch('addTasksUser', get_projects.data.tasks)
          this.loading = false
        }
      }else {
        this.loading = false
      }
    },
    deleteProject(id){
      const toast = this.$toasted
      const router = this.$router
      const message = "<div class='title-confirm'>Delete?</div><div class='desc-confirm'>Are you sure?</div>";
      this.$dialog.confirm(message)
          .then(function () {
            axios.post(serverUrl + 'projects/delete', {id:id},
                {
                  headers:{
                    'Accept':'*/*'
                  }
                }
            ).then((res) => {
              // console.log(res)
              if (res.data.status) {
                toast.success(`Deleted`);
                router.go();
              } else {
                toast.error("Error")
              }
            })
          })
          .catch(function () {
            console.log('no')
          });
    },
    refresh(){
      axios.post(serverUrl + 'auth/refresh', {},{
        withCredentials:true,
        headers: {
          'Accept': '*/*',
          "Bearer" : $cookies.get(sessionId)
        },
      }).then((res) => {
        console.log(res)
      })
    }
  },
  mounted() {
    this.loadDataProjects();
    // console.log(this.getProjects)
  }
}

</script>

<style scoped>
.container{padding: 10px 30px}
.projects{display: flex; justify-content: center; flex-wrap: wrap; gap: 20px}
.item-project{position:relative; cursor: pointer; width: 300px; height: 200px; background: #fff; padding: 20px; border-radius: 5px;text-align: left;}
.item-project-add{position:relative; width: 300px; height: 200px; background: #fff; padding: 20px; border-radius: 5px;text-align: center;}
.item-project p{margin: 0px 0px 10px 0px}
.participants{display: flex; column-gap: 10px}
.name-project{font-size: 2rem; font-weight: 500}
.desc-project{height: 45px; font-size: 1.2rem;}
.no-photo{width: 30px; height: 30px; border-radius: 50px; background: darkgray}
.completed{position: absolute; left: 0; bottom: 5px; height: 2px; background: forestgreen}
.add-project{width: 160px; cursor: pointer;}

.avatar{
  width: 30px; height: 30px; object-fit: cover; object-position: top center; border-radius: 50px;
}
.delete-project{
  position: absolute;
  z-index: 9;
  right: 5px;
  top: 5px;
  width: 15px;
}
.deadline{display: flex; justify-content: space-between;}
.d-start{
  width: 65px;
  text-align: center;
  padding: 5px;
  margin-bottom: 20px;
  border-radius: 5px;
  background: #d7ede9;
}
.d-end{
  width: 65px;
  text-align: center;
  padding: 5px;
  margin-bottom: 20px;
  border-radius: 5px;
  background: #edd7d7;
}
.rateProject{
  position: absolute;
  right: 5px;
  color: gray;
}
</style>