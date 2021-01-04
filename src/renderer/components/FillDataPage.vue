<template>
	<div id="wrapper">
		<el-form size="mini" label-width="80px">
			<template v-if="giftArray.length > 0">
				<el-form-item v-for="item in giftArray" :label="item.level + '等奖' + item.name">
					{{item}}
				</el-form-item>
			</template>


			<el-col :span="4">
				<el-form-item :label="'奖品等级'">
					<el-input v-model="level"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="4">
				<el-form-item :label="'奖品名称'">
					<el-input v-model="name"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="4">
				<el-form-item :label="'奖品数量'">
					<el-input v-model="num"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="4">
				<el-form-item :label="'奖品图片'">
					<el-input v-model="imgContent"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item :label="'添加奖品'">
					<el-button @click="addGift">添加</el-button>
					<el-button @click="clearGift">清空</el-button>
				</el-form-item>
			</el-col>
		</el-form>
	</div>
</template>

<script>
	import { mapActions } from 'vuex'
	export default {
		name: 'fill-data',
		data() {
			return {
				id: 1,
				level: "",
				name: "",
				num: "",
				imgContent: ""
			}
		},
		methods: {
			addGift() {
				this.$store.dispatch("commitAddGift", {
					id: this.id++,
					level: this.level,
					name: this.name,
					num: this.num,
					imgContent: this.imgContent
				})
			},
			clearGift(){
				this.$store.dispatch("commitClearGift")
			}
		},
		mounted() {
			this.$nextTick(_ => {})
		},
		computed: {
			giftArray() {
				return this.$store.state.giftStore.giftArray
			}
		}
	}
</script>

<style>
</style>
