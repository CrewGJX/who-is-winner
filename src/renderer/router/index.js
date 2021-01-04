import Vue from 'vue'
import Router from 'vue-router'
const fillData = require('../components/FillDataPage.vue').default
const screen = require('../components/LandingPage.vue').default
const homePage = require('../components/homePage.vue').default

Vue.use(Router)

export default new Router({
	mode: 'hash',
	routes: [{
			path: "/fillDataPage",
			component: fillData
		},{
			path: '/screen',
			component: screen
		}, {
			path: '/',
			component: homePage
		}
	]
})
