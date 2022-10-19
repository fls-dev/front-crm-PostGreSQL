import Vue from 'vue'
import Vuex from 'vuex'
import {serverUrl} from "@/vue.config";
Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        user:{},
        sidebar: 'none',
        status_sidebar: false,
        usersForSelect: [],
        projects: false,
        tasks: false
    },
    getters : {
        IS_AUTH: state => {
            if(state.user.hasOwnProperty('details')) {return true
            }else {return false}
        },
        SIDEBAR: state => {return state.sidebar},
        STATUS_SIDEBAR: state => {return state.status_sidebar},
        COLOR_HEADER: state => {return state.user.setting.colorHeader},
        USER: state => {
            if(state.hasOwnProperty('user')) {
                return state.user;
            } else {
                return false
            }
        },
        USER_NAME: state => {
            if(state.hasOwnProperty('user.details.firstName')){
                return state.user.details.firstName
            }else {
                return "Not authorized"
            }
        },
        USER_PHOTO: state => {
            if(state.hasOwnProperty('user.details.avatar')){
                return serverUrl+state.user.details.avatar
            }else {
                return "/img/avatar.jpg"
            }
        },
        GET_USERS: state => {
            if(state.usersForSelect.length === 0){
                return false
            }else {
                return state.usersForSelect
            }
        },
        GET_USER_PROJECTS: state => {
            return state.projects
        },
        GET_USER_TASKS: state => {
            return state.tasks
        }
    },
    mutations: {
        SAVE_USER: (state, payload) => {
            state.user = payload;
        },
        SAVE_USERS_SELECT: (state, payload) => {
            state.usersForSelect = payload;
        },
        SAVE_USER_PROJECTS: (state, payload) => {
            state.projects = payload;
        },
        SAVE_USER_TASKS: (state, payload) => {
            state.tasks = payload;
        },
        SAVE_SIDEBAR: (state, payload) => {
            state.sidebar = payload
        },
        SAVE_STATUS_SIDEBAR: (state, payload) => {
            state.status_sidebar = payload
        },
        SAVE_COLOR_HEADER: (state, payload) => {
            state.user.setting.colorHeader = payload
        },
    },
    actions : {
        addInfoUser({commit}, info) {
            commit('SAVE_USER', info)
        },
        saveUsersForSelect({commit}, info) {
            commit('SAVE_USERS_SELECT', info)
        },
        addProjectsUser({commit}, info) {
            commit('SAVE_USER_PROJECTS', info)
        },
        clearProjectsUser({commit}, info) {
            commit('SAVE_USER_PROJECTS', info)
        },
        addTasksUser({commit}, info) {
            commit('SAVE_USER_TASKS', info)
        },
        openSidebar({commit}, display) {
            let status =false
            if(display === 'block'){
                status = true
            }
            commit('SAVE_SIDEBAR',display)
            commit('SAVE_STATUS_SIDEBAR',status)
        },
        updateColorHeader({commit}, color){
            commit('SAVE_COLOR_HEADER',color)
        },
        getUsersForSelect({commit}, users){

        }
    }
})
