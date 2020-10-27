import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import User from "../components/User/User.vue";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue";

Vue.use(VueRouter);

const routes = [
  //路由重定向，自动跳转到登录页面
  {path:"/",redirect: "/login"},
  {path:"/login",component:Login},
  {
    path:"/home",
    component:Home,
    redirect:"/welcome",
    children:[
      {path:"/welcome",component:Welcome},
      {path:"/users",component:User},
      {path:"/rights",component:Rights},
      {path:"/roles",component:Roles},
      {path:"/categories",component:Cate},
      {
        path:"/goods",
        component:resolve => (require(["@/components/goods/GoodList"],resolve))
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to：将要访问的路径; from:从哪个路径跳转过来; next：是一个函数，表示放行；next()放行；next('/login')强制跳转
  const tokenStr = window.sessionStorage.getItem("token");
  if (to.path === "/login"){
    return next();
  } else if (!tokenStr) {
    return next("/login");
  } else {
    next();
  }
});
export default router;
