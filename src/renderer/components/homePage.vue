<template>
	<div id="wrapper">
		<iframe src="static/flipClock.html" width="400px" height="60px" frameborder="0"></iframe>
		<el-row>
			<el-col :span="6" :offset="2">
				<el-button @click="showDanmu" type="primary">{{isShowDanmu? '关闭弹幕页': '展示弹幕页'}}</el-button>
			</el-col>
			<el-col :span="6" :offset="2">
				<el-button @click="openEditForm" type="primary">管理奖品</el-button>
			</el-col>
		</el-row>
		<el-row v-show="isShowDanmu">
			<el-col :span="6" :offset="2">
				<el-button @click="whoIsWinner" type="primary">弹幕抽奖</el-button>
			</el-col>
			<el-col :span="6" :offset="2">
				<el-button @click="viewWinners" type="primary">{{isShowDetail? '关闭中奖详情': '查看中奖详情'}}</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<style>
	td {
		text-align: center;
	}
	
	.el-row{
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
				isShowDetail: false
			}
		},
		methods: {
			openEditForm() {
				ipcRenderer.send("commCrtl", "openEditForm")
			},
			whoIsWinner() {
				ipcRenderer.send("commCrtl", "drawWhoIsWinner")
			},
			viewWinners() {
				this.isShowDetail = !this.isShowDetail
				ipcRenderer.send("commCrtl", this.isShowDetail?"showWhoIsWinner":"disableDetail")
			},
			showDanmu() {
				this.isShowDanmu = !this.isShowDanmu
				ipcRenderer.send("commCrtl", this.isShowDanmu?"showDanmu":"disableDanmu")
			}
		}
	}
</script>

<style>
</style>
