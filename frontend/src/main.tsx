
import { Route } from '@tanstack/react-router'
import App from './App.tsx'
import './index.css'

const indexRoute = new Route({
  path: '/',
  component: App,
})

const router = new Router({

})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}