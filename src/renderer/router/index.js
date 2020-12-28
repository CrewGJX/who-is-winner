import Vue from 'vue'
import Router from 'vue-router'
const fillData = () => import('../components/FillDataPage.vue')
const home = () => import('../components/LandingPage.vue')

Vue.use(Router)

export default new Router({
	mode: 'hash',
	routes: [{
			path: "/fillDataPage",
			component: fillData
		},
		{
			path: '/',
			component: home
		}
	]
})
