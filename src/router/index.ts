import { createRouter, createWebHashHistory } from 'vue-router'
import ProductsView from '../views/ProductsView.vue'
// import IncomeView from '../views/IncomeView.vue'
// import SaleView from '../views/SaleView.vue'
import OperationView from '../views/OperationView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
  { path: '/', redirect: '/products' },
  { path: '/products', component: ProductsView },
  // { path: '/income', component: IncomeView },
  // { path: '/sale', component: SaleView },
  { path: '/history', component: HistoryView },
  { path: '/operation', component: OperationView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
