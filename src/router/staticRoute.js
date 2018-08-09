const Layout = () => import('../page/layout')

const staticRoute = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/error',
    component: () => import('../page/error'),
    children: [
      {
        path: '401',
        component: () => import('../page/error/401')
      },
      {
        path: '403',
        component: () => import('../page/error/403')
      },
      {
        path: '404',
        component: () => import('../page/error/404')
      },
      {
        path: '500',
        component: () => import('../page/error/500')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../page/login')
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../page/home')
      }
    ]
  },
  {
    path: '/components',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../page/components')
      },
      {
        path: 'pageNotes',
        component: () => import('../page/components/assist/pageNotes')
      },
      {
        path: 'permission',
        component: () => import('../page/components/function/permission')
      },
      {
        path: 'pageTable',
        component: () => import('../page/components/function/pageTable')
      },
      {
        path: 'pageSearch',
        component: () => import('../page/components/ui/pageSearch')
      },
      {
        path: 'pageSection',
        component: () => import('../page/components/ui/pageSection')
      },
      {
        path: 'pageTitle',
        component: () => import('../page/components/ui/pageTitle')
      },
      {
        path: 'pageToolbar',
        component: () => import('../page/components/ui/pageToolbar')
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    children: [
      {
        path: 'table',
        component: () => import('../page/example/table')
      },
      {
        path: 'charts',
        component: () => import('../page/example/charts')
      },
      {
        path: 'map',
        component: () => import('../page/example/map')
      }
    ]
  },
  {
    path: '/i18n',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../page/i18n')
      }
    ]
  },
  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../page/themeChange')
      }
    ]
  },
  {
    path: '/zkhtest',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../page/zkhtest/indexzqh')
      }
    ]
  },
  {
    path: '*',
    redirect: '/error/404'
  }
]

export default staticRoute
