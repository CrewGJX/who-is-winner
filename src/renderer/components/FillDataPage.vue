<template>
	<div id="wrapper">
		<el-form size="mini" label-width="80px" style="margin-top: 10px;">
			<template v-if="giftArray.length > 0">
				<div v-for="item in giftArray" style="box-shadow: 5px 5px 15px rgba(0,0,0,0.5);margin: 5px 20px;padding: 10px;">
					<div style="display: inline-block;">
						<p>id：{{item.id}}</p>
						<p>奖项：{{item.level}}</p>
						<p>奖品名：{{item.name}}</p>
						<p>奖品数量：{{item.num}}</p>
					</div>
					<div style="display: inline-block;">
						<img :src="item.imgContent" width="100px" height="100px">
					</div>
					<hr/>
				</div>
			</template>

			<el-row style="margin-top: 50px;">
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
			<el-col :span="6">
				<el-form-item :label="'奖品图片'">
					<el-upload action="#" :before-remove="beforeRemove" :http-request="handleRequest">
						<el-button size="mini" type="primary">{{'上传文件'}}</el-button>
					</el-upload>
				</el-form-item>
			</el-col>
			<el-col :span="5" :offset="1">
				<el-form-item :label="'添加奖品'">
					<el-button @click="addGift">添加</el-button>
					<el-button @click="clearGift">清空</el-button>
				</el-form-item>
			</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
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
			clearGift() {
				this.$store.dispatch("commitClearGift")
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？此操作将删除文件！`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

				})
			},
			handleRequest(req, type) {
				let {file} = req, self = this
				self.imgContent = "file://" + file.path
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
