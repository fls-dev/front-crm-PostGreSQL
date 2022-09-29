<template>
  <div>
    <Header/>
    <div class="content">
      <Sidebar/>
      <div class="content-add">
        <div class="top-edit-task">
          <p class="profile-title">
            <router-link :to="{name: 'EditProject',params: { projectId: this.projectId._id }}">
            <img src="/img/icons/arrow-left.svg"></router-link> Edit task</p>
            <div id="statusRadios">
              <label data-status="new" class="radio-status-task checked">
                <input type="radio" name="status" @change="changeStatus" value="new" v-model="statusTask"/>
                new
              </label>
              <label data-status="process" class="radio-status-task middle checked">
                <input type="radio" name="status" @change="changeStatus" value="process" v-model="statusTask" />
                process
              </label>
              <label data-status="completed" class="radio-status-task checked">
                <input type="radio" name="status" @change="changeStatus" value="completed" v-model="statusTask" />
                completed
              </label>
            </div>
        </div>
        <label><span class="name-input">Task's title</span>
          <input class="profile-inp" v-model="titleTask" placeholder="Name">
        </label>
        <label><span class="name-input">Description</span>
          <textarea class="textarea-inp" v-model="descTask" placeholder="Description"></textarea>
        </label>
        <div class="deadline-files">
          <label class="w-50"><span class="name-input">Deadline</span>
            <div class="max-width-calendar">
              <v-date-picker class="calendar" v-model="deadline" is-range is-expanded :min-date="new Date()"/>
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
                <input multiple @change="upFiles" ref="files" id="uploadFile" type="file" class="hidden"/>
              </label>
            </div>
            <div v-else class="files-box">
              <div v-for="file of listFiles" class="file-project-edit">
                <span>{{ file.fileName }}</span>
                <span>
              <img @click="deleteFile(file.path)" class="delete-icon-edit" src="/img/icons/delete.svg">
            </span>
              </div>
            </div>
          </div>
        </div>
        <p class="profile-title">Users</p>

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
          <button class="save-info" @click="update">Edit Task</button>
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
import moment from "moment";

export default {
  name: "EditTask",
  metaInfo: {
    title: 'Edit Task'
  },
  components: {Sidebar, Header, Multiselect},
  data: function () {
    return {
      projectId: '',
      taskId: '',
      createdUserId: '',
      titleTask: "",
      descTask:"",
      statusTask: "",
      options: [],
      SelectedParticipants: [],
      deadline: new Date(),
      isEdit: true,
      isFiles: true,
      listFiles: '',
      files: '',
    }
  },
  created() {
    this.taskId = this.$route.params.taskId
  },
  computed: {
    getUsersSelect() { return this.$store.getters.GET_USERS},
  },
  methods:{
    async getInfo(id) {
      const data = await axios.get(serverUrl + "tasks/get-single-info/" + id)
      if (data.status === 200) {
        // select users
        for (const us of data.data.users) {
          let obj = {}
          obj.name = us.details.firstName
          obj.id = us._id
          if (data.data.tasks.users.includes(us._id)) {
            this.SelectedParticipants.push(obj)
            this.options.push(obj)
          } else {
            this.options.push(obj)
          }
        }
        this.createdUserId = data.data.tasks.createdUserId
        this.titleTask = data.data.tasks.titleTask
        this.descTask = data.data.tasks.descTask
        this.deadline = data.data.tasks.deadline
        this.listFiles = data.data.tasks.files
        this.projectId = data.data.tasks.projectId
        this.statusTask = data.data.tasks.status
        if(data.data.tasks.files.length === 0){
          this.isFiles = false
        }
        this.changeStatus(this.statusTask, 1)
      }
    },
    upFiles(){
      this.files = this.$refs.files.files
      let formData = new FormData();
      for( let i = 0; i < this.files.length; i++ ){
        let file = this.files[i];
        formData.append('files[]', file);
      }
      formData.append('id', this.taskId);
      formData.append('listFiles', JSON.stringify(this.listFiles));
      axios.post(serverUrl + 'tasks/update-files', formData,
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
    update(){
      let users = []
      this.SelectedParticipants.forEach(el=> {
        users.push(el.id)
      })
      axios.post(serverUrl + 'tasks/update', {
            id:this.taskId,
            titleTask: this.titleTask,
            descTask: this.descTask,
            projectId: this.projectId,
            createdUserId: this.createdUserId,
            users: users,
            deadline: this.deadline,
            status: this.statusTask
          },
          {
            headers: {
              'Accept': '*/*',
            },
            withCredentials: true
          }
      ).then((res) => {
        console.log(res)
        if (res.request.status === 200 || res.request.status === 201) {
          this.$router.push({name: 'EditProject',params: { projectId: this.projectId._id }})
        } else {
          this.$toasted.error(res.response.data.message)
        }
      })
    },
    deleteFile(path) {
      const toast = this.$toasted
      const listFiles = this.listFiles
      const updateFiles = this.setNewListFile
      // console.log(path)
      const data = {path:path, taskId: this.taskId}
      const message = "<div class='title-confirm'>Delete?</div><div class='desc-confirm'>Are you sure?</div>";
      this.$dialog.confirm(message)
          .then(function () {
            axios.post(serverUrl + 'tasks/delete-file', data,
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
    },
    changeStatus(event, start = 0){
      let change = (start === 0) ? event.target.value : event
      document.getElementById('statusRadios').querySelectorAll('label').forEach(i=>{
        if(i.dataset.status !== change){
          i.classList.remove(i.dataset.status)
        }else {i.classList.add(i.dataset.status)}
      })
    }
  },
  mounted() {
    if (this.taskId === undefined) {
      this.$router.push('/dashboard/projects')
    } else {
      this.getInfo(this.taskId)
    }
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
.is-files{display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;}
.file-project-edit{display: flex; align-items: center; padding: 5px 0px; justify-content: space-between; border-bottom: 1px solid gainsboro}
.upload-icon-edit{width:25px; cursor: pointer}
.delete-icon-edit{width:15px; cursor: pointer}
.top-edit-task{display: flex;
  justify-content: space-between;
  margin-bottom: 20px;}
.radio-status-task{padding: 5px 10px; font-size: 1.5rem; border-radius:5px; cursor: pointer; background: #f2f2f2;text-align: center;}
.radio-status-task input{display: none}
.middle{margin: 0px 7px;}
.new.checked {background: #ffc400}
.process.checked{background: #00f7ff}
.completed.checked{background: #7af97a;}
.profile-title img{width: 23px; margin-right: 20px; cursor: pointer}
</style>