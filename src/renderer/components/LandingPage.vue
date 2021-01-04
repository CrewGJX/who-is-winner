<template>
	<div id="wrapper">
		<!-- <span class="moveTitle" style="float: right;font-size: 40px;">欢迎光临sb弹幕系统</span> -->
		<div v-for="item in holdData" :key="item.index" :id="item.index" :style="{'color': item.color, 'font-size': item.fontSize}"
		 class="holdItem">
			{{item.msg}}
		</div>

		<div v-for="item in testData" :key="item.index" :id="item.index" :style="{'color': item.color, 'top': item.height + 'px', 'font-size': item.fontSize, 'animation': item.speed +'s wordsLoop linear normal'}"
		 class="moveItem">
			{{item.msg}}
		</div>

		<el-dialog :visible.sync="winnerGroupVisible" :title="'中奖名单'" :width="'60%'">
			<el-row>
				<el-col :span="5" :offset="1" v-for="item in winnerListData">
					<p>{{item.text}}</p>
				</el-col>
			</el-row>
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
	let index = 1;

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
					speed: "normal",
					throttle: 300,
					limitNum: 500,
					holdTime: 5,
					notRenderData: false,
					rowSpacing: 1.5
				},
				cons: {
					speedOpt: {
						"normal": 8,
						"fast": 4,
						"slow": 12
					}
				},
				cache: [],
				timeOut: {},
				sumTime: 0,
				tmpTime: 0,
				winnerGroupVisible: false,
				winnerListData: []
			}
		},
		methods: {
			speed() {
				return this.cons.speedOpt[this.options.speed]
			},
			drawWhoIsWinner() {
				this.winnerGroupVisible = true
				let candidate = document.getElementsByClassName("moveItem")
				let winner = candidate.item(Random.natural(0, candidate.length))
				let holdWinner = $(winner).clone()
				$(winner).remove()
				this.addWinnerItemIntoVisiTable(holdWinner)
			},
			addWinnerItemIntoVisiTable(winnerItem) {
				this.winnerListData.push({
					text: $(winnerItem).text()
				})
			},
			showWhoIsWinner() {
				this.winnerGroupVisible = true
			},
			disableDetail(){
				this.winnerGroupVisible = false
			},
			lazyUpdData() {
				if (this.timeOut) {
					clearTimeout(this.timeOut)
				}

				this.tmpTime = this.tmpTime ? this.tmpTime : new Date();
				this.sumTime += new Date().getTime() - this.tmpTime;

				if (this.cache.length > 100 || this.sumTime > this.options.throttle) {
					this.pushDataIntoArray()
					return
				}

				this.timeOut = setTimeout(_ => {
					this.pushDataIntoArray()
				}, this.options.throttle)
			},
			pushDataIntoArray() {
				// 限制同屏弹幕数量
				let sum = document.getElementsByClassName("moveItem").length
				if (sum >= this.options.limitNum) {
					setTimeout(_ => {
						this.pushDataIntoArray()
					}, 500)
					return
				}

				let tmp = this.cache.splice(0, this.options.limitNum)
				// fs.appendFile('./debugger.txt', JSON.stringify(tmp), (error) => { console.log("Error!"); })
				let holdArray = tmp.filter(item => {
					return item.isHold
				})

				let moveArray = tmp.filter(item => {
					return !item.isHold
				})
				this.testData.push(...moveArray)
				this.holdData.push(...holdArray)

				// fs.appendFile('./debugger.txt', JSON.stringify(moveArray), (error) => { console.log("Error!"); })
				// fs.appendFile('./debugger.txt', JSON.stringify(holdArray), (error) => { console.log("Error!"); })

				setTimeout(_ => {
					this.testData.splice(0, moveArray.length)
				}, this.speed() * 1000)

				setTimeout(_ => {
					this.holdData.splice(0, holdArray.length)
				}, this.options.holdTime * 1000)

				this.sumTime = 0
				this.tmpTime = 0
			},
			rowNums(lineHeight) {
				return parseInt(window.innerHeight / lineHeight / this.options.rowSpacing) - 2
			}
		},
		mounted() {
			this.$nextTick(_ => {
				var self = this

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
							height: fontSize + Random.natural(0, self.rowNums(fontSize)) * fontSize * self.options.rowSpacing,
							speed: self.speed(),
							color: url_Obj_Json.query.color || "black",
							isHold: url_Obj_Json.query.isHold || false,
							fontSize: fontSize + 'px'
						}

						fs.appendFile('./history.txt', JSON.stringify(msgData), (error) => {
							if (error) throw err;
						})

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
						msg: Random.cword(3),
						index: index++,
						height: 50 + Random.natural(0, self.rowNums(50)) * 50 * self.options.rowSpacing,
						speed: self.speed(),
						color: 'black',
						fontSize: 50 + 'px'
					}

					self.cache.push(msgData)

					fs.appendFile('./history.txt', JSON.stringify(msgData), (error) => {
						if (error) throw err;
					})

					self.lazyUpdData()
				}, 1000)

				ipcRenderer.on("eventInstance", (event, args) => {
					switch (args) {
						case "showWhoIsWinner":
							{
								self.showWhoIsWinner()
								break
							}
						case "drawWhoIsWinner":
							{
								self.drawWhoIsWinner()
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
	.winner-group-table {}

	.winner-item {
		font-size: 20px !important;
		position: relative;
	}

	.winner-group {
		z-index: 9999;
		position: absolute;
		left: 50%;
		top: 20%;
		transform: translateX(-50%);
		box-shadow: 5px 5px 20px grey;
		border: 1px solid black;
		width: 60%;
		min-height: 20%;
		background-color: white;
		/* text-align: center; */
	}

	@keyframes wordsLoop {
		0% {
			/* transform: translateX(1920px); */
			/* transform: translateX(100%); */
			/* left: 100%; */
			opacity: 1;
		}

		100% {
			left: 0;
			transform: translateX(-100%);
			opacity: 1;
		}
	}

	.moveItem {
		opacity: 0;
		left: 100%;
		position: absolute;
		font-family: '微软雅黑';
		color: black;
		white-space: nowrap;
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
