<template>
	<div id="wrapper">
		<iframe src="static/flipClock.html" width="400px" height="60px" frameborder="0"></iframe>
		<el-row>
			<el-col :span="6" :offset="2">
				<el-button size="mini" @click="showDanmu" type="primary">{{isShowDanmu? '关闭弹幕页': '展示弹幕页'}}</el-button>
			</el-col>
			<el-col :span="6" :offset="2">
				<el-button size="mini" @click="openEditForm" type="primary">管理奖品</el-button>
			</el-col>
		</el-row>
		<el-row v-show="isShowDanmu">
			<el-col :span="6" :offset="2">
				<el-button size="mini" @click="selectOptionVisible = !selectOptionVisible" type="primary">弹幕抽奖</el-button>
			</el-col>
			<el-col :span="6" :offset="2">
				<el-button size="mini" @click="viewWinners" type="primary">{{isShowDetail? '关闭中奖详情': '查看中奖详情'}}</el-button>
			</el-col>
		</el-row>
		<el-collapse-transition>
			<el-form label-width="60px" v-show="isShowDanmu && selectOptionVisible" size="mini">
				<el-col :span="6">
					<el-form-item label="奖品">
						<el-select v-model="gift">
							<el-option v-for="item in giftOptions" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6" v-show="gift">
					<el-form-item label="数量">
						<el-select v-model="num">
							<el-option v-for="item in numberOptions" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="3" :offset="2">
					<el-button size="mini" @click="whoIsWinner" type="primary">抽取下一组幸运鹅</el-button>
				</el-col>
			</el-form>
		</el-collapse-transition>
	</div>
</template>

<style>
	td {
		text-align: center;
	}

	.el-row {
		margin-bottom: 20px;
	}
</style>

<script>
	const {
		ipcRenderer
	} = require('electron')

	ipcRenderer.on("commCrtl", (event, args) => {

	})

	export default {
		name: 'home-page',
		data() {
			return {
				isShowDanmu: false,
				isShowDetail: false,
				selectOptionVisible: false,
				gift: "",
				num: ""
			}
		},
		computed: {
			giftOptions() {
				return this.$store.state.giftStore.giftArray
			},
			numberOptions() {
				let giftNum = this.$store.state.giftStore.giftLeft[this.gift]
				if (giftNum){
					let temp = eval('[...Array(' + (Number(giftNum)+1) + ').keys()]')
					temp.shift()
					return temp
				}else{
					return []
				}
			}
		},
		methods: {
			openEditForm() {
				ipcRenderer.send("commCrtl", "openEditForm")
			},
			whoIsWinner() {
				this.isShowDetail = true
				this.$store.dispatch("setNextDraw", {
					id: this.gift,
					num: this.num
				})
				ipcRenderer.send("commCrtl", "drawWhoIsWinner")
			},
			viewWinners() {
				this.isShowDetail = !this.isShowDetail
				ipcRenderer.send("commCrtl", this.isShowDetail ? "showWhoIsWinner" : "disableDetail")
			},
			showDanmu() {
				this.isShowDanmu = !this.isShowDanmu
				ipcRenderer.send("commCrtl", this.isShowDanmu ? "showDanmu" : "disableDanmu")
			}
		}
	}
</script>

<style>
</style>
