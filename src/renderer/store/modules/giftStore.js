var fs = require('fs')
const state = {
	giftArray: [],
	giftLeft: {},
	giftDrawed: {},
	nextDrawName: "",
	nextDrawNum: ""
}

const mutations = {
	addGift(state, gift) {
		let newIndex = 0

		if (state.giftArray.length == 0){
			state.giftArray.push(gift)
			return
		}
		state.giftArray.forEach((item, index) => {
			if (item.level >= gift.level) {
				item.level++
				newIndex = index - 1
			}
		})
		state.giftArray.splice(newIndex, 0, gift)
		state.giftLeft[gift.name] = gift.num
	},
	deleteGift(state, gift) {
		state.giftArray.splice(state.giftArray.findIndex(item => {
			return item.id == gift.id
		}), 1)
	},
	clearGift(state) {
		state.giftArray = []
	},
	drawGift(state, gift){
		state.giftLeft[gift.name] --
		state.giftDrawed[gift.name] ++
	},
	setNextDrawName(name){
		state.nextDrawName = name
	},
	setNextDrawNum(num){
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
	setNextDrawName({commit,state}, name){
		commit('setNextDrawName', name)
	},
	setNextDrawNum({commit,state}, num){
		commit('setNextDrawNum', num)
	}
}

export default {
	state,
	mutations,
	actions
}
