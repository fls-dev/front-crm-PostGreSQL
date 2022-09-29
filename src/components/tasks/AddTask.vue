<template>
  <div>
    <Header/>
    <div class="content">
      <Sidebar/>
      <div class="content-add">
        <p class="profile-title">Add task</p>
        <label><span class="name-input">Task's title</span>
          <input class="profile-inp" v-model="titleTask" placeholder="Name">
        </label>
        <label><span class="name-input">Description</span>
          <textarea class="textarea-inp" v-model="descTask" placeholder="Description"></textarea>
        </label>
        <div class="deadline-files">
          <label class="w-50"><span class="name-input">Deadline</span>
            <div class="max-width-calendar">
              <v-date-picker class="calendar" v-model="deadline" is-range is-expanded :min-date="new Date()" />
            </div>
          </label>
          <label for="uploadFile" class="w-50"><span class="name-input">Files</span>
            <div class="files-box">
              <img class="upload-icon" src="/img/icons/upload.svg">
              <p>Click to upload</p>
              <input multiple @change="upFiles" ref="files" id="uploadFile" type="file" class="hidden" />
            </div>
          </label>
        </div>
        <p class="profile-title">Select users</p>
        <!--  <label><span class="name-input">Select users</span>-->
        <multiselect
            ref="multiselect"
            v-model="SelectedParticipants"
            :multiple="true"
            :options="options"
            :closeOnSelect="true"
            label="name"
            track-by="name"
            placeholder="Select user"
        />

        <!--  </label>-->
        <div class="center">
          <button class="save-info" @click="create">Add Task</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {serverUrl} from "@/vue.config";
import Multiselect from "vue-multiselect";
import Sidebar from "@/templates/Sidebar";
import Header from "@/templates/Header";
import Calendar from 'v-calendar/lib/components/calendar.umd'
import moment from "moment";

export default {
  name: "AddTask",
  metaInfo: {
    title: 'Add Task'
  },
  components: {Sidebar, Header, Multiselect},
  data: function () {
    return {
      projectId: '',
      createdUserId: '',
      titleTask: "",
      descTask:"",
      options: [],
      SelectedParticipants: [],
      deadline: new Date(),
      files: '',
      textUPFiles: 'Click to upload'
    }
  },
  created() {
    this.projectId = this.$route.params.projectId
  },
  computed: {
    getUser() { return this.$store.getters.USER},
    getUsersSelect() { return this.$store.getters.GET_USERS},
  },
  methods:{
    async getUsers() {
      if(!this.getUsersSelect) {
        let users = []
        const data = await axios.get(serverUrl + "users")
        if (data.status === 200) {
          data.data.forEach(us => {
            if (us._id !== this.getUser._id) {
              let obj = {}
              obj.name = us.details.firstName
              obj.id = us._id
              users.push(obj)
            }
          })
          await this.$store.dispatch('saveUsersForSelect', users)
          this.options = users
        }
      }else {
        console.log('esle')
        this.options = this.getUsersSelect
      }
    },
    upFiles(){
      this.textUPFiles = `Selected: ${this.$refs.files.files.length} files`
    },
    create(){
      let formData = new FormData();
      for( let i = 0; i < this.files.length; i++ ){
        let file = this.files[i];
        formData.append('files[]', file);
      }
      this.SelectedParticipants.forEach(el => {
        formData.append('users[]', el.id);
      })
      formData.append('titleTask', this.titleTask);
      formData.append('descTask', this.descTask);
      formData.append('projectId', this.projectId);
      formData.append('createdUserId', this.getUser._id);
      formData.append('deadlineS', moment(this.deadline.start).format('YYYY-MM-DD'));
      formData.append('deadlineE', moment(this.deadline.end).format('YYYY-MM-DD'));
      formData.append('status', "new");

      axios.post(serverUrl + 'tasks/create', formData,
          {
            headers:{
              'Accept':'*/*',
              'Content-Type': 'multipart/form-data'
            }
          }
      ).then((res) => {
        console.log(res.data)
        if (res.request.status === 200 || res.request.status === 201) {
          this.$router.push({name: 'EditProject', params: { projectId: this.projectId }})
        } else {
          this.$toasted.error(res.response.data.message)
        }
      })
    },
    customFormatter(date) {
      return moment(date).format('YYYY-MM-DD')
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>

<style scoped>
.multiselect{margin: 7px auto 20px auto}
.deadline-files{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.upload-icon{width: 200px}
.files-box{
  width: 100%;
  border-radius: 5px;
  border: 1px dashed #737373;
  text-align: center;
  padding: 15px;
  cursor: pointer;
}
.hidden{visibility: hidden}
.w-50{width: 50%;}
.w-50>.name-input{margin-bottom: 20px;display: block;}
</style>