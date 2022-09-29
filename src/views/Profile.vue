<template>
  <div>
    <Header/>
    <div class="content">
      <Sidebar/>
      <div class="body-profile">
        <div class="block-avatar">
          <img v-on:click="addFiles" class="avatar" :src="getAvatar">
          <input @change="submitFile" type="file" ref="file" class="none">
          <p>{{ name }} {{ lastName }}</p>
        </div>
        <div class="text-info">
          <p class="profile-title">Information</p>
          <label><span class="name-input">E-mail</span>
            <input class="profile-inp" v-model="email" placeholder="E-mail">
          </label>
          <label><span class="name-input">New password</span>
          <input   @mouseover="showPass = 'text'"
                   @mouseleave="showPass = 'password'"
                   :type="showPass"  class="profile-inp" v-model="password" placeholder="New password">
          </label>
          <label><span class="name-input">Name</span>
          <input class="profile-inp" v-model="name" placeholder="Name">
          </label>
          <label><span class="name-input">Last Name</span>
          <input class="profile-inp" v-model="lastName" placeholder="Last Name">
          </label>
          <button type="submit" @click="sendFormUpdate" class="save-info">Save</button>
          <p class="profile-title">Setting</p>
          <!--       <div class="line-setting">-->
          <!--       <label class="toggle">-->
          <!--         <span class="toggle-label">Color header:</span>-->
          <!--         <input class="profile-color" v-model="" type="color">-->
          <!--       </label>-->
          <!--       </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/templates/Header";
import Sidebar from "@/templates/Sidebar";
import axios from "axios";
import {serverUrl} from "@/vue.config";
import {store} from "@/store";
export default {
  name: "Profile",
  metaInfo: {
    title: 'Profile'
  },
  components: {Header, Sidebar},
  data: function () {
    return {
      email: '',
      name: '',
      lastName: '',
      password: '',
      showPass: "password",
      avatar: {}
    }
  },
  created() {
    this.email = this.$store.getters.USER.email
    this.name = this.getUser.details.firstName
    this.lastName = this.getUser.details.lastName
  },
  computed: {
    getAvatar() { return this.$store.getters.USER_PHOTO},
    getUser() { return this.$store.getters.USER},
  },
  methods: {
    sendFormUpdate(e) {
      e.preventDefault()
      const dataUser ={
        email: this.email,
        password: this.password,
        role: this.getUser.role,
        details: {
          firstName: this.name,
          lastName: this.lastName,
        }
      }
      axios.post(serverUrl + 'users/update-user',dataUser, {headers:{'Accept': '*/*',withCredentials: true}})
          .then((res) => {
            console.log(res)
            if (res.status === 201 || res.status === 200) {
              this.$store.dispatch('addInfoUser', res.data)
              this.$toasted.success("Updated")
            } else {
              this.$toasted.error(res.response.data.message)
            }
          })
    },
    addFiles(){
      this.$refs.file.click();
    },
    submitFile() {
      let formData = new FormData();
      formData.append('file', this.$refs.file.files[0]);
      formData.append('user', this.getUser);
      axios.post(serverUrl + 'users/avatar-upload',
          formData,
          {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'multipart/form-data'
            }
          }
      ).then(function (res) {
        store.dispatch('addInfoUser', res.data);
      })
          .catch(function (e) {
            console.log(e);
          });
    },
  },
  mounted() {
    // console.log("profile" + this.$store.getters.USER)
  }

}
</script>

<style scoped>
.body-profile{
  width: 100%;
  padding: 30px;
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  text-align: left;
  align-items: flex-start;
}
.text-info ,.block-avatar{padding: 30px; background: #fff; border: 1px solid #ffe6c4; border-radius: 5px}
.text-info{width: 70%;}
.block-avatar{width: 30%; text-align: center; }
.block-avatar p{font-size: 2.4rem}

/*.save-info{*/
/*  background: #FCC883;*/
/*  font-size: 1.6rem;*/
/*  border: none;*/
/*  border-radius: 5px;*/
/*  padding: 5px 15px;*/
/*  margin-bottom: 15px;*/
/*}*/
.profile-title{
  font-size: 2.6rem;
  color: #8f8f8f;
  margin-bottom: 15px;
}
.text-info input:focus{
  border: 1px solid #FCC883;
}
.text-info label{
  margin: 7px auto;
  display: block;
}
.avatar{width: 200px; height: 200px; cursor: pointer; margin-bottom: 15px; object-fit: cover; object-position: center top; border-radius: 50px}
.name-input{
  font-size: 1.2rem;
  color: #8f8f8f;
}
.line-setting{margin-bottom: 20px}
.profile-color{
  width: 70px;
  height: 30px;
  outline: none;
  border: 1px solid #8f8f8f;
  border-radius: 5px;
}

/*switch*/

.toggle {
  cursor: pointer;
  display: inline-block;
}

.toggle-switch {
  display: inline-block;
  background: #ccc;
  border-radius: 16px;
  width: 58px;
  height: 32px;
  position: relative;
  vertical-align: middle;
  transition: background 0.25s;
}
.toggle-switch:before, .toggle-switch:after {
  content: "";
}
.toggle-switch:before {
  display: block;
  background: linear-gradient(to bottom, #fff 0%, #eee 100%);
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
  width: 24px;
  height: 24px;
  position: absolute;
  top: 4px;
  left: 4px;
  transition: left 0.25s;
}
.toggle:hover .toggle-switch:before {
  background: linear-gradient(to bottom, #fff 0%, #fff 100%);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
}
.toggle-checkbox:checked + .toggle-switch {
  background: #65A398;
}
.toggle-checkbox:checked + .toggle-switch:before {
  left: 30px;
}

.toggle-checkbox {
  position: absolute;
  visibility: hidden;
}

.toggle-label {
  margin-right: 15px;
  position: relative;
  top: 2px;
  font-size: 1.6rem;
}
.pass{
  position: relative;
}
</style>