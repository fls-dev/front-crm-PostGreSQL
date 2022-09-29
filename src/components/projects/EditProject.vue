<template>
<div class="content-add">
  <div>
    <div @click="changeEdit" v-if="!isEdit" class="box">Information</div>
    <div @click="changeEdit" v-else class="box">Tasks</div>
  </div>
  <div v-if="!isEdit">
  <div class="top-edit-project">
  <p class="profile-title">Edit project: {{name}}</p>
  <img @click="deleteProject(projectId)" class="delete-project" src="/img/icons/delete.svg">
  </div>
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
      <div class="w-50">
        <div class="is-files">
          <span class="name-input">Files</span>
          <img @click="changeUpFile" class="upload-icon-edit" src="/img/icons/upload.svg">
        </div>
        <div for="uploadFile" v-if="!isFiles" class="files-box">
          <label for="uploadFile">
              <img class="upload-icon" src="/img/icons/upload.svg">
              <p class="">Click to upload</p>
            <input multiple @change="upFiles" ref="files" id="uploadFile" type="file" class="hidden" />
          </label>
        </div>
        <div v-else class="files-box">
          <div v-for="file of listFiles" class="file-project-edit">
            <span>{{file.fileName}}</span>
            <span>
              <img @click="deleteFile(file.path)" class="delete-icon-edit" src="/img/icons/delete.svg">
            </span>
          </div>
        </div>
      </div>
    </div>
  <p class="profile-title">Select users</p>
<!--  <label><span class="name-input">Select users</span>-->
  <multiselect
      ref="multiselect"
      v-model="SelectedParticipants"
      :multiple="true"
      :options="options"
      :value="SelectedParticipants"
      :closeOnSelect="true"
      label="name"
      track-by="name"
      placeholder="Select user"
  />
<!--  </label>-->
<div class="center mb-20">
  <button class="save-info" @click="update">Update project</button>
</div>
  </div>
<TaskProject v-else :id=projectId />
</div>
</template>

<script>
import 'vue-multiselect/dist/vue-multiselect.min.css'

import Multiselect from 'vue-multiselect'
import axios from "axios";
import {keyCookie, serverUrl} from "@/vue.config";
import TaskProject from "@/components/tasks/TaskProject";
import moment from "moment";

export default {
  name: "EditProject",
  metaInfo: {
    title: 'Edit Project'
  },
  components: {TaskProject, Multiselect },
  data: function () {
    return {
      createdUserId: '',
      projectId: "",
      isOpen: false,
      name: '',
      description: '',
      deadline: new Date(),
      options: [],
      SelectedParticipants: [],
      isEdit: true,
      isFiles: true,
      listFiles: '',
      files: '',
      }
  },
  created() {
    this.projectId = this.$route.params.projectId
  },
  computed: {
    getUser() { return this.$store.getters.USER},
  },
  methods: {
    async getInfo(id) {
      const data = await axios.get(serverUrl + "projects/get-info/" + id)
      // console.log(data)
      if (data.status === 200) {
        // select users
        for (const us of data.data.users) {
          let obj = {}
          obj.name = us.details.firstName
          obj.id = us._id
          if (data.data.project.participants.includes(us._id)) {
            this.SelectedParticipants.push(obj)
            this.options.push(obj)
          } else {
            this.options.push(obj)
          }
        }
        this.createdUserId = data.data.project.createdUserId
        this.name = data.data.project.name
        this.deadline = data.data.project.deadline
        this.description = data.data.project.description
        this.listFiles = data.data.project.files
        if(data.data.project.files.length === 0){
          this.isFiles = false
        }
      }
    },
    update() {
      let participants = []
      this.SelectedParticipants.forEach(el => {
        participants.push(el.id)
      })
      axios.post(serverUrl + 'projects/update', {
            id: this.projectId,
            createdUserId: this.createdUserId,
            name: this.name,
            description: this.description,
            participants: participants,
            deadline: {
              start: moment(this.deadline.start).format('YYYY-MM-DD'),
              end: moment(this.deadline.end).format('YYYY-MM-DD')
            }
          },
          {
            headers: {
              'Accept': '*/*'
            }
          }
      ).then((res) => {
            if (res.request.status === 201 && res.data.status) {
              this.$toasted.success("Updated")
            } else {
              this.$toasted.error("Error")
            }
          }
      )
    },
    deleteProject(id) {
      const message = "<div class='title-confirm'>Delete?</div><div class='desc-confirm'>Are you sure?</div>";
      this.$dialog.confirm(message)
          .then(function () {
            axios.post(serverUrl + 'projects/delete', {id:id},
                {
                  headers:{
                    'Accept':'*/*'
                  },
                  withCredentials: true
                }
            ).then((res) => {
              // console.log(res)
              if (res.data.status) {
                let tasks = 0
                // if(res.data.task !== 0){
                //
                // }
                this.$toasted.success("Deleted, Task deleted: "+ res.data.task);
                this.$router.go();
              } else {
                this.$toasted.error("Error")
              }
            })
          })
          .catch(function () {
            // console.log('no')
          });
    },
    changeEdit(){
      this.isEdit =!this.isEdit
    },
    upFiles(){
      this.files = this.$refs.files.files
      let formData = new FormData();
      for( let i = 0; i < this.files.length; i++ ){
        let file = this.files[i];
        formData.append('files[]', file);
      }
      formData.append('id', this.projectId);
      formData.append('listFiles', JSON.stringify(this.listFiles));
      axios.post(serverUrl + 'projects/update-files', formData,
          {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'multipart/form-data'
            }
          }
      ).then((res) => {
        // console.log(res)
        if (res.request.status === 201 && res.data.status) {
          this.$toasted.success("Updated")
          this.listFiles = res.data.update.files
          this.isFiles = true
        } else {
          this.$toasted.error("Error")
        }
      })
    },
    changeUpFile(){
      this.isFiles = !this.isFiles
    },
    deleteFile(path) {
      const toast = this.$toasted
      const listFiles = this.listFiles
      const updateFiles = this.setNewListFile
      // console.log(path)
      const data = {path:path, projectId: this.projectId}
      const message = "<div class='title-confirm'>Delete?</div><div class='desc-confirm'>Are you sure?</div>";
      this.$dialog.confirm(message)
          .then(function () {
            axios.post(serverUrl + 'projects/delete-file', data,
                {
                  headers:{
                    'Accept':'*/*'
                  },
                  withCredentials: true
                }
            ).then((res) => {
              // console.log(res)
              if (res.data.status) {
                toast.success("Deleted");
                let newFiles = []
                listFiles.forEach(el=>{
                  if(el.path !== path){
                    // console.log(el)
                    newFiles.push(el)
                  }
                })
                updateFiles(newFiles)
              } else {
                toast.error("Error")
              }
            })
          })
          .catch(function () {
            // console.log('no')
          });
    },
    setNewListFile(list){
      this.listFiles = list
    }
  },
  mounted() {
    console.log(this.projectId)
    if(this.projectId === undefined){
       this.$router.push('/dashboard/projects')
    }else {
    this.getInfo(this.projectId)
    }
  //  dragAndDropCapable
  }
}
</script>

<style scoped>
.content-add{
  background: #fff;
  max-width: 1140px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 15px;
}
.text-info label{
  margin: 7px auto;
  display: block;
}
.name-input{
  font-size: 1.2rem;
  color: #8f8f8f;
}
.quill-editor{
  margin: 5px auto;
}
.textarea-inp{
  width: 100%;
  max-width: 100%;
  margin: 5px auto 15px auto;
  min-height: 100px;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  padding: 5px;
  background: transparent;
  outline: none;
}
.multiselect{margin: 7px auto 20px auto}
.top-edit-project{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.delete-project{
  width: 20px;
}
.mb-20{margin-bottom: 20px}
.box{
  font-size: 2.6rem;
  border: 1px solid #8f8f8f;
  width: 170px;
  text-align: center;
  padding: 5px;
  color: rgb(254, 199, 151);
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.deadline-files{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.upload-icon{width: 200px;   cursor: pointer;}
.files-box{
  width: 100%;
  border-radius: 5px;
  border: 1px dashed #737373;
  text-align: center;
  padding: 15px;
}
.hidden{visibility: hidden}
.w-50{width: 50%;}
.w-50>.name-input{margin-bottom: 20px;display: block;}
.is-files{display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;}
.file-project-edit{display: flex; align-items: center; padding: 5px 0px; justify-content: space-between; border-bottom: 1px solid gainsboro}
.upload-icon-edit{width:25px; cursor: pointer}
.delete-icon-edit{width:15px; cursor: pointer}

</style>