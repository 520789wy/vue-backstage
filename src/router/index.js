import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path:"/",
    redirect: "/login"//路由重定向，自动跳转到登录页面
  },
  {
    path:"/login",
    component:Login
  },
  {
    path:"/home",
    component:Home
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
