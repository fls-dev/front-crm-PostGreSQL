<template>
  <div>
    <Header />
    <div class="content">
      <Sidebar/>
      <div class="body-users">
      <h1>User's page</h1>
        <vue-good-table
            class="table"
            :columns="columns"
            :rows="infoTable"
            :search-options="{enabled: true, placeholder: 'Поиск..'}"
            :sort-options="{ enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
            :isLoading="loading"
        >
          <template slot="table-row" slot-scope="props">
            <div v-if="props.column.field == 'options'">
                <span class="mr-1" @click="ale(props.row)">
                  <img width="30" src="/img/icons/view.svg">
                </span>
              <span @click="delEvent(props.row)">
               <img width="30" src="/img/icons/view.svg">
              </span>
            </div>
            <div v-else-if="props.column.field == 'name'">
              <router-link class="link" :to="{path: `/editclient/${props.row.id}/info`, params: { id: props.row.id }}">{{ props.row.name}}</router-link>
            </div>
          </template>
        </vue-good-table>
      </div>
    </div>
  </div>

</template>

<script>
import Sidebar from "@/templates/Sidebar";
import Header from "@/templates/Header";
import 'vue-good-table/dist/vue-good-table.css'
import {VueGoodTable} from 'vue-good-table';
import axios from "axios";
import {serverUrl} from "@/vue.config";

export default {
  components: { Sidebar, Header, VueGoodTable},
  name: "Users",
  metaInfo: {
    title: 'Users'
  },
  computed: {
    getUser() { return this.$store.getters.USER},
  },
  data: function () {
    return{
      infoTable: [],
      loading: true,
      columns: [
        {
          label: 'id',
          field: 'id',
          hidden: true,
        },
        {
          label: 'Name',
          field: 'name',
          html: true,
          width: '10%',
          tdClass: 'vertical center cell-color',
        },
        {
          label: "Role",
          field: 'role',
          html: true,
          width: '20%',
          thClass: 'vertical center',
          tdClass: 'vertical center',
        },
        {
          label: "Options",
          field: 'options',
          width: '5%',
          tdClass: 'vertical center',
        }
      ],
    }
  },
  methods:{
    async getUsers() {
      const data = await axios.get(serverUrl + "users")
      if(data.status === 200){
        data.data.forEach(us=>{
          if(us._id !== this.getUser._id){
            let obj ={}
            obj.id = us._id
            obj.name = us.details.firstName +" "+ us.details.lastName
            obj.role = us.role
            this.infoTable.push(obj)
          }
        })
        this.loading = false
      }
    },
  },
  mounted() {
   this.getUsers()
  }
}
</script>

<style scoped>
.body-users{
  background: #fff;
  width: 100%;
  padding: 30px;
  max-width: 1140px;
  margin: 10px auto 0 auto;
  text-align: left;
}

</style>