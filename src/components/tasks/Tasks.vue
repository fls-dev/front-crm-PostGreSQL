<template>
  <div>
    <Header/>
    <div class="content-tasks">
      <Sidebar/>
  <div v-if="tasks">
    <p class="profile-title left">Task's</p>
    <!--  <router-link :to="{ name: 'AddTask', params: { projectId: projectId }}">-->
    <!--    <img class="add-project" src="/img/icons/plus.svg">-->
    <!--  </router-link>-->
    <vue-good-table
        class="table"
        :columns="columns"
        :rows="infoTable"
        :search-options="{enabled: true, placeholder: 'Поиск..'}"
        :sort-options="{ enabled: true, initialSortBy: {field: 'status', type: 'desc'}}"
        :isLoading="loading"
        :lineNumbers="true"
        :showFilter="true"
        styleClass="vgt-table condensed">
      <div slot="table-actions">
        <router-link class="add-task-table" :to="{ name: 'AddTask', params: { projectId: projectId }}">
          Add
        </router-link>
        <select class="select-status" v-model="selectStatus" @change="filterStatus">
          <option value="new">new</option>
          <option value="process">process</option>
          <option value="completed">completed</option>
        </select>
      </div>
      <template slot="table-row" slot-scope="props">
        <div v-if="props.column.field === 'options'">
          <router-link :to="{ name: 'EditTask', params: { taskId: props.row.id }}">
            <img width="30" src="/img/icons/view.svg">
          </router-link>
        </div>
        <div v-else-if="props.column.field === 'title'">
          <router-link class="link" :to="{ name: 'EditTask', params: { taskId: props.row.id }}">{{ props.row.title}}</router-link>
        </div>

      </template>
    </vue-good-table>
  </div>
  <div v-else class="else">
    <p class="profile-title left">Task's project</p>
    <p class="mb-20">Tasks not found</p>
    <router-link :to="{ name: 'AddTask', params: { projectId: projectId }}">
      <img class="add-project" src="/img/icons/plus.svg">
    </router-link>
  </div>
    </div>
  </div>
</template>

<script>

import Header from "@/templates/Header";
import Sidebar from "@/templates/Sidebar";
import {VueGoodTable} from "vue-good-table";
import axios from "axios";
import {keyCookie, serverUrl} from "@/vue.config";
export default {
  name: "Tasks",
  components: {Sidebar, Header, VueGoodTable},
  metaInfo: {
    title: 'Tasks'
  },
  data: function () {
    return {
      projectId: '',
      projectName: '',
      selectStatus: 'new',
      allTaskForFilter: [],
      tasks: false,
      infoTable: [],
      loading: true,
      columns: [
        {
          label: 'id',
          field: 'id',
          hidden: true,
        },
        {
          label: 'Project',
          field: 'project',
          html: true,
          width: '7%',
          thClass: 'vertical center',
          tdClass: 'vertical center project-td',
        },
        {
          label: 'Title',
          field: 'title',
          html: true,
          width: '10%',
          tdClass: 'vertical cell-color',
        },
        {
          label: "Description",
          field: 'description',
          html: true,
          width: 'auto',
          tdClass: 'vertical',
        },
        {
          label: "Author",
          field: 'author',
          html: true,
          width: '4%',
          thClass: 'vertical',
          tdClass: 'vertical',
        },
        {
          label: "Users",
          field: 'users',
          html: true,
          width: '10%',
          thClass: 'vertical',
          tdClass: 'vertical',
        },
        {
          label: "Start",
          field: 'deadlineStart',
          width: '10%',
          tdClass: 'vertical deadline-start',
        },
        {
          label: "Deadline",
          field: 'deadlineEnd',
          width: '10%',
          tdClass: 'vertical deadline-end',
        },
        {
          label: "Status",
          field: 'status',
          width: '10%',
          html: true,
          thClass: 'vertical center',
          tdClass: 'vertical center',
        },
        {
          label: "Options",
          field: 'options',
          width: '5%',
          thClass: 'vertical right',
          tdClass: 'vertical right',
        }
      ],
    }
  },
  computed: {
    getUsersTasks() { return this.$store.getters.GET_USER_TASKS},
  },
  created() {
    if(this.getUsersTasks === false){
      this.$router.push('/dashboard/projects')
    }else {
      this.allTaskForFilter = this.getUsersTasks
    }

  },
  methods: {
    async getInfo(id) {
      if (id === undefined) {
        return false
      } else {
        const data = await axios.get(serverUrl + "tasks/get-all-tasks/" + id)
        if (data.status === 200) {
          if (data.data.length !== 0) {
            // console.log(data)
            this.allTaskForFilter = data.data
            this.filterStatus()
          }
        }
      }
    },
    createUserForTable(users){
      let html = '<div class="us-task">'
      for (let u of users){
        html += `<img class="img-us-task" src="${serverUrl+u.details.avatar}">`
      }
      html +='</div>'
      return html
    },
    filterStatus(){
      let forTableFilter = []
      this.allTaskForFilter.forEach(task => {
        if(task.status === this.selectStatus) {
          let obj = {}
          obj.id = task._id
          obj.title = task.titleTask
          obj.description = task.descTask.slice(0,115)
          obj.project = task.projectId.name
          obj.author = `<img class="img-us-task" src="${serverUrl + task.createdUserId.details.avatar}">`
          // obj.author = task.createdUserId.details.firstName +' '+task.createdUserId.details.lastName
          obj.users = this.createUserForTable(task.users)
          obj.deadlineStart = task.deadline.start.slice(0, 10)
          obj.deadlineEnd = task.deadline.end.slice(0, 10)
          let htmlStatus = `<button class="status-task ${task.status}">${task.status}</button>`
          obj.status = htmlStatus
          forTableFilter.push(obj)
        }
      })
      this.infoTable = forTableFilter
      this.tasks = true
      this.loading = false
    }
  },
  mounted() {
    this.filterStatus()
    // const id = $cookies.get(keyCookie)
    // this.getInfo(id)
  }
}

</script>

<style scoped>
.content-tasks{width: 100%; max-width: 1140px; background: #fff; margin: 0 auto; padding: 10px 30px}
.table{margin: 20px auto}
.left{text-align: left}
.else{text-align: center}
.add-project{width: 60px; cursor: pointer;}
.mb-20{margin-bottom: 20px}

.add-task-table{
  padding: 6px 10px;
  font-size: 1.4rem;
  border-radius: 5px;
  background: #65A398;
  color: #fff;
  margin-right: 15px; margin-left: 5px
}
.select-status{
  width: 100px;
  border: 1px solid #ced4da;
  padding: 0px 5px;
  outline: none;
  height: 27px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background:  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath d='M70.3 13.8L40 66.3 9.7 13.8z' fill='%23000'%3E%3C/path%3E%3C/svg%3E") no-repeat;
  background-size: 10px, 0.45em 5px;
  background-position: 80px 8px;
}
</style>