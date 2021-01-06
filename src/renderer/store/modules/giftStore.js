var fs = require('fs')
const state = {
	giftArray: [],
	giftLeft: {},
	giftDrawed: {},
	nextDrawId: "",
	nextDrawNum: ""
}

const mutations = {
	addGift(state, gift) {
		state.giftLeft[gift.id] = gift.num
		if (state.giftArray.length == 0){
			state.giftArray.push(gift)
			return
		}
		let newIndex = state.giftArray.findIndex((item, index) => {
			return (Number(item.level) >= Number(gift.level))
		})
		state.giftArray.splice(newIndex == -1 ? state.giftArray.length : newIndex, 0, gift)
	},
	deleteGift(state, gift) {
		state.giftArray.splice(state.giftArray.findIndex(item => {
			return item.id == gift.id
		}), 1)
	},
	clearGift(state) {
		state.giftArray = []
		state.giftLeft= {}
		state.giftDrawed= {}
		state.nextDrawId= ""
		state.nextDrawNum= ""
	},
	drawGift(state, gift){
		state.giftLeft[gift.id] --
		state.giftDrawed[gift.id] ++
	},
	setNextDrawId(state, id){
		state.nextDrawId = id
	},
	setNextDrawNum(state, num){
		state.nextDrawNum = num
	}
}

const actions = {
	commitAddGift({commit,state}, gift) {
		commit('addGift', gift)
	},
	commitClearGift({commit,state}) {
		commit('clearGift')
	},
	drawGift({commit,state}, gift) {
		commit('drawGift', gift)
	},
	setNextDraw({commit,state}, o){
		commit('setNextDrawId', o.id)
		commit('setNextDrawNum', o.num)
	}
}

export default {
	state,
	mutations,
	actions
}
