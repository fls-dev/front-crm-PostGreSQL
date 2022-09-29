import Vue from 'vue'
import VueRouter from 'vue-router'
import Start from '../views/Start.vue'
import Projects from "@/components/projects/Projects";
import Tasks from "@/components/tasks/Tasks";
import dashboard from "@/views/Dashboard";
import {store} from "@/store";
import {keyCookie, serverUrl} from "@/vue.config";
import axios from "axios";
import AddProject from "@/components/projects/AddProject";
import Users from "@/views/Users";
import EditProject from "@/components/projects/EditProject";
import AddTask from "@/components/tasks/AddTask";
import EditTask from "@/components/tasks/EditTask";
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Start',
        component: Start
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: dashboard,
        meta: {requiresAuth: true},
        children: [{
            path: 'projects',
            name: 'Projects',
            component: Projects
        },
            {
                path: 'add-project',
                name: 'AddProject',
                component: AddProject
            },
            {
                path: 'edit-project',
                name: 'EditProject',
                component: EditProject
            },
        ],
    },
    {
        path: '/users',
        name: 'Users',
        meta: {requiresAuth: true},
        component: Users
    },
    {
        path: '/profile',
        name: 'Profile',
        meta: {requiresAuth: true},
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/tasks',
        name: 'Tasks',
        component: Tasks,
        meta: {requiresAuth: true},
    },
    {
        path: '/add-task',
        name: 'AddTask',
        component: AddTask,
        meta: {requiresAuth: true},
    },
    {
        path: '/edit-task',
        name: 'EditTask',
        component: EditTask,
        meta: {requiresAuth: true},
    }
]

const router = new VueRouter({
    routes,
    mode: "history"
})
router.beforeEach(async (to, from, next) => {
    if(to.name === "Start" && $cookies.isKey(keyCookie)){
        next('/dashboard/projects')
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.IS_AUTH) {
            next()
        }
        else{
            if ($cookies.isKey(keyCookie)) {
                const id = $cookies.get(keyCookie)
                let response = await axios.get(serverUrl + "users/get-info/" + id)
                if(response.status === 200){
                    store.dispatch('addInfoUser', response.data)
                }
                next()
            }else next('/')
        }
    }else {
        next()
    }
})

export default router
