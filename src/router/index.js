import home from '../views/imageView.vue'
import upload from '../views/uploadImage.vue'
import {createRouter,createWebHistory} from 'vue-router'
const routes=[
    {
        path:'/',component:home
    },{
        path:'/upload',component:upload
    }
]

const router = createRouter({
    routes,
    history:createWebHistory()
})
export default router;