<template>
	<div id="wrapper">
		<!-- <span class="moveTitle" style="float: right;font-size: 40px;">欢迎光临sb弹幕系统</span> -->
		<div v-for="item in holdData" :key="item.index" :id="item.index" :style="{'color': item.color, 'font-size': item.fontSize}"
		 class="holdItem">
			{{item.msg}}
		</div>

		<div class="danmuWrapper">
			<div v-for="item in testData" :key="item.index" :id="item.index" :style="{'color': item.color, 'top': item.height + 'px', 'font-size': item.fontSize, 'animation': item.speed +'s wordsLoop linear normal'}"
			 class="moveItem">
				{{item.msg}}
			</div>
		</div>

		<el-dialog :visible.sync="winnerGroupVisible" :title="'中奖名单'" :width="'60%'">
			<template v-for="item in giftArray">
				<p>{{item.level + '等奖' + item.name}}</p>
				<p v-for="o in winnerListData[item.id]">{{o}}</p>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import $ from 'jquery'

	var http = require('http');
	var util = require('util');
	var url = require('url');
	var querystring = require("querystring");
	var Mock = require('mockjs')
	var fs = require('fs')
	var Random = Mock.Random;
	let index = 1,
		row = 0,
		sumTime = 0,
		tmpTime = new Date();

	const {
		ipcRenderer
	} = require('electron')

	export default {
		name: 'landing-page',
		data() {
			return {
				testData: [],
				holdData: [],
				options: {
					// 弹幕速度
					speed: "normal",
					// 弹幕密度大小
					throttle: 1000,
					// 同屏弹幕数限制
					limitNum: 10000,
					// 悬浮时间
					holdTime: 5,
					// 是否停止获取弹幕推送数据
					notRenderData: false,
					// 行距
					rowSpacing: 1.5,
					// 无限火力模式，打开后同屏弹幕无限制，输出速度快，且高度随机
					noLimit: false
				},
				cons: {
					speedOpt: {
						"normal": 10,
						"fast": 5,
						"slow": 20
					}
				},
				cache: [],
				timeOut: {},
				winnerGroupVisible: false,
				winnerListData: {}
			}
		},
		computed: {
			giftArray() {
				return this.$store.state.giftStore.giftArray
			}
		},
		methods: {
			getNextRow(rowNum) {
				let rr = (row >= rowNum ? row = 0 : row++)
				return rr
			},
			speed(speedConfig) {
				// 调整弹幕速度
				return this.cons.speedOpt[speedConfig || this.options.speed]
			},
			filterByAccount(collection){
				return collection.filter(item => {
					return true
				})
			},
			drawWhoIsWinner(times) {
				this.winnerGroupVisible = true
				let candidate = this.filterByAccount($(".moveItem"))
				
				let winner = Random.shuffle(candidate).splice(0, times)
				let holdWinner = $(winner).clone()
				$(winner).remove()
				this.addWinnerItemIntoVisiTable(holdWinner)
			},
			addWinnerItemIntoVisiTable(winnerItem) {
				let giftId = this.$store.state.giftStore.nextDrawId
				
				let detailContent = winnerItem.map((index,item) => {
					return $(item).text()
				})
				
				if (this.winnerListData[giftId]) {
					this.winnerListData[giftId].splice(this.winnerListData.length - 1, 0, ...detailContent)
				} else {
					this.winnerListData[giftId] = detailContent
				}
				this.persistData(detailContent)
			},
			showWhoIsWinner() {
				this.winnerGroupVisible = true
			},
			disableDetail() {
				this.winnerGroupVisible = false
			},
			lazyUpdData() {
				// 模拟窗口滑动 控制 弹幕的疏密和间距
				// throttle 正比于 两波弹幕间的X轴间距
				let throttle = this.options.noLimit ? 10 : this.options.throttle

				if (this.timeOut) {
					clearTimeout(this.timeOut)
				}

				sumTime += new Date().getTime() - tmpTime;
				tmpTime = new Date()

				// 缓冲数组 50 的触发条件
				if (this.cache.length > 50 || sumTime > throttle) {
					if (sumTime > throttle * 2)
						row = 0
					this.pushDataIntoArray()
					return
				}

				this.timeOut = setTimeout(_ => {
					this.pushDataIntoArray()
				}, throttle)
			},
			pushDataIntoArray() {
				// 限制同屏弹幕数量
				let sum = document.getElementsByClassName("moveItem").length
				if (!this.options.noLimit && sum >= this.options.limitNum) {
					setTimeout(_ => {
						this.pushDataIntoArray()
					}, 1000)
					return
				}

				let tmp = this.cache.splice(0, this.cache.length)
				let holdArray = tmp.filter(item => {
					return item.isHold
				})

				let moveArray = tmp.filter(item => {
					return !item.isHold
				})
				this.testData.push(...moveArray)
				this.holdData.push(...holdArray)

				setTimeout(_ => {
					this.testData.splice(0, moveArray.length)
				}, this.cons.speedOpt.slow * 1000)

				setTimeout(_ => {
					this.holdData.splice(0, holdArray.length)
				}, this.options.holdTime * 1000)

				sumTime = 0
				// this.tmpTime = 0
			},
			rowNums(lineHeight) {
				return parseInt(window.innerHeight / lineHeight / this.options.rowSpacing)
			},
			recordDanmuData(data) {
				// 持久化数据
				fs.appendFile('./history.txt', JSON.stringify(data), (error) => {
					if (error) throw err;
				})
			},
			persistData(data) {
				fs.appendFile('./winnerHistory.txt', JSON.stringify(data), (error) => {
					if (error) throw err;
				})
			}
		},
		mounted() {
			this.$nextTick(_ => {
				var self = this

				fs.appendFile('./history.txt', new Date() + "===================\n", (error) => {
					if (error) throw err;
				})

				fs.appendFile('./winnerHistory.txt', new Date() + "===================\n", (error) => {
					if (error) throw err;
				})

				var server = http.createServer(function(request, response) {
					// request.setEncoding('utf-8');
					// var postData = "";
					// // 数据块接收中
					// request.on("data", function(postDataChunk) {
					// 	postData += postDataChunk;
					// });

					// request.on("end", function() {
					// 	console.log('数据接收完毕');
					// 	var params = querystring.parse(postData); //GET & POST  解释表单数据部分{name="zzl",email="zzl@sina.com"}
					// 	console.log(params);
					// 	console.log(params["name"] + "~~" + params["password"]);
					// 	response.writeHead(200, {
					// 		'Content-Type': 'text/html;charset=utf-8'
					// 	}); //设置response编码为utf-8
					// 	response.write("=======================================");
					// 	response.end("数据提交完毕");
					// });
					var url_Obj = url.parse(request.url);

					//请求参数中有中文是推介，会自动处理中文问题,推介使用
					var url_Obj_Json = url.parse(request.url, true);
					response.end("success")
					if (url_Obj_Json.pathname == '/') {
						let fontSize = Number(url_Obj_Json.query.fontSize) || 50
						let msgData = {
							msg: url_Obj_Json.query.text,
							index: index++,
							height: (self.options.noLimit ? Random.natural(0, 980) : self.getNextRow(self.rowNums(fontSize)) * fontSize *
								self.options.rowSpacing),
							speed: self.speed(url_Obj_Json.query.speed || 'normal'),
							color: (self.options.noLimit ? Random.rgb() : url_Obj_Json.query.color) || "black",
							isHold: url_Obj_Json.query.isHold || false,
							fontSize: fontSize + 'px'
						}

						self.recordDanmuData(msgData)

						if (self.options.notRenderData)
							return

						self.cache.push(msgData)

						self.lazyUpdData()
					} else if (url_Obj_Json.pathname.startsWith('/control')) {
						let {
							optName,
							optValue,
							optType
						} = url_Obj_Json.query

						if (optType) {
							optValue = eval(optValue)
						}
						self.$set(self.options, optName, optValue)
					}

				})
				server.listen(8100)

				setInterval(_ => {
					let msgData = {
						msg: Random.cword(10),
						index: index++,
						height: (self.options.noLimit ? Random.natural(0, 980) : self.getNextRow(self.rowNums(50)) * 50 * self.options
							.rowSpacing),
						speed: self.speed(),
						color: self.options.noLimit ? Random.rgb() : 'black',
						fontSize: 30 + 'px'
					}

					self.cache.push(msgData)
					self.recordDanmuData(msgData)
					self.lazyUpdData()
				}, 500)

				ipcRenderer.on("eventInstance", (event, args) => {
					switch (args) {
						case "showWhoIsWinner":
							{
								self.showWhoIsWinner()
								break
							}
						case "drawWhoIsWinner":
							{
								self.drawWhoIsWinner(this.$store.state.giftStore.nextDrawNum)
								break
							}
						case "disableDetail":
							{
								self.disableDetail()
								break
							}
					}
				})
			})
		}
	}
</script>

<style>
	@keyframes wordsLoop {
		from {
			transform: translate3d(1536px, 0, 0);
			opacity: 1;
		}

		to {
			transform: translate3d(-120%, 0, 0);
			opacity: 1;
		}
	}

	/* .danmuWrapper{
		transition: ;
	} */

	.moveItem {
		position: absolute;
		font-family: '微软雅黑';
		color: black;
		white-space: nowrap;
		opacity: 0;
	}

	/* 	.moveTitle {
		opacity: 0;
		width: 520px;
		animation: 5s wordsLoop infinite linear normal;
		font-family: '微软雅黑';
	} */

	.holdItem {
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		width: 75%;
		white-space: nowrap;
	}

	html {
		background-color: transparent;
		overflow: hidden;
	}

	* {
		padding: 0;
		margin: 0;
	}
</style>
