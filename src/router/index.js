import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DashboardView from '@/views/DashboardView.vue'

export const listOfRoutes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home :: KelasQuery',
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard :: KelasQuery',
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      title: 'About :: KelasQuery',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Login :: KelasQuery',
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/SignupView.vue'),
    meta: {
      title: 'Register :: KelasQuery',
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/UserPageView.vue'),
    meta: {
      title: 'Profile :: KelasQuery',
    }
  },
  {
    path: '/homework',
    name: 'Homework',
    component: () => import('@/views/HomeworkView.vue'),
    meta: {
      title: 'Homework :: KelasQuery',
    }
  },
  {
    path: '/homework/create',
    component: () => import('@/views/CreateHomework.vue'),
    meta: {
      title: 'Create Homework :: KelasQuery',
    }
  },
  {
    path: '/homework/:id',
    component: () => import('@/views/HomeworkPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404 Not Found :: KelasQuery',
    }
  },
]

const router = createRouter({
  history: createWebHistory(/* import.meta.env.BASE_URL */),
  routes: listOfRoutes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta?.title ?? 'KelasQuery'
  next()
})

export default router
