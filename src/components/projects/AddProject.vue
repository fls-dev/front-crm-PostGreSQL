<template>
<div class="content-add">
  <p class="profile-title">Information</p>
  <label><span class="name-input">Name Project</span>
    <input class="profile-inp" v-model="name" placeholder="Name">
  </label>
  <label><span class="name-input">Description</span>
    <textarea class="textarea-inp" v-model="description" placeholder="Description"></textarea>
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
        <p>{{ textUPFiles }}</p>
        <input multiple @change="upFiles" ref="files" id="uploadFile" type="file" class="hidden" />
      </div>
    </label>
  </div>
  <p class="profile-title">Select users</p>
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
  <button class="save-info" @click="create">Create project</button>
</div>
</div>
</template>

<script>
import 'vue-multiselect/dist/vue-multiselect.min.css'

import Multiselect from 'vue-multiselect'
import axios from "axios";
import {keyCookie, serverUrl} from "@/vue.config";
import moment from "moment/moment";

export default {
  name: "AddProject",
  metaInfo: {
    title: 'Add Project'
  },
  components: { Multiselect },
  data: function () {
    return {
      name: '',
      description: '',
      options: [],
      deadline: new Date(),
      SelectedParticipants: [],
      files: '',
      textUPFiles: 'Click to upload'
    }
  },
  computed: {
    getUser() { return this.$store.getters.USER},
    getUsersSelect() { return this.$store.getters.GET_USERS},
  },
  methods: {
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
        this.options = this.getUsersSelect
      }
    },
    create(){
      let formData = new FormData();
      for( let i = 0; i < this.files.length; i++ ){
        let file = this.files[i];
        formData.append('files[]', file);
      }
      this.SelectedParticipants.forEach(el => {
        formData.append('participants[]', el.id);
      })
      formData.append('participants[]', this.getUser._id);
      formData.append('createdUserId', this.getUser._id);
      formData.append('name', this.name);
      formData.append('description', this.description);
      formData.append('deadlineS', moment(this.deadline.start).format('YYYY-MM-DD'));
      formData.append('deadlineE', moment(this.deadline.end).format('YYYY-MM-DD'));

      axios.post(serverUrl + 'projects/create', formData, {
            headers:{
              'Accept':'*/*',
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          }
      ).then((res) => {
        if (res.request.status == 200 || res.request.status == 201) {
          this.$store.dispatch('addProjectsUser', false)
          this.$router.push('/dashboard/projects')
        } else {
          this.$toasted.error(res.response.data.message)
        }
      })
    },
    upFiles(){
      this.textUPFiles = `Selected: ${this.$refs.files.files.length} files`
    },
    sendFile(){
      let formData = new FormData();
      for( let i = 0; i < this.files.length; i++ ){
        let file = this.files[i];
        formData.append('files[' + i + ']', file);
      }
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