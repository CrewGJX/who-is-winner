<template>
	<div id="wrapper">
		<iframe src="static/flipClock.html" width="400px" frameborder="0"></iframe>
		<!-- <span class="moveTitle" style="float: right;font-size: 40px;">欢迎光临sb弹幕系统</span> -->
		<p v-for="item in testData" :key="item.index" :style="{'top': item.height + 'px'}" class="moveItem">{{item.msg}}</p>
	</div>
</template>

<script>
	var http = require('http');
	var util = require('util');
	var url = require('url');
	var querystring = require("querystring");
	let index = 1;
	export default {
		name: 'landing-page',
		data() {
			return {
				testData: []
			}
		},
		methods: {
			// handleMouseEnter(event) {
			// 	let ele = document.getElementById("moveItem")
			// 	// ele.style.position = 'relative'
			// 	ele.style.left = event.clientX + 'px'
			// 	ele.removeEventListener("mouseenter", this.handleMouseEnter)
			// 	ele.addEventListener("mouseleave", this.handleMouseLeave)
			// },
			// handleMouseLeave(event) {
			// 	let ele = document.getElementById("moveItem")
			// 	// ele.style.position = ''
			// 	ele.style.left = ''
			// 	ele.removeEventListener("mouseleave", this.handleMouseLeave)
			// 	ele.addEventListener("mouseenter", this.handleMouseEnter)
			// }
		},
		mounted() {
			this.$nextTick(_ => {
				// 	setInterval(_ => {
				// 		this.testData.push({
				// 			msg: '测试弹幕' + new Date().getTime(),
				// 			height: new Date().getTime() * new Date().getTime() % 1000
				// 		})
				// 	}, 1000)
				// })
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
					// console.log(url_Obj_Json);

					var url_Obj_Json_str = JSON.stringify(url_Obj_Json.query);
					console.log(url_Obj_Json_str);
					response.end("success")
					if (url_Obj_Json.pathname == '/'){
						self.testData.push({
							// msg: url_Obj_Json_str + new Date().getTime(),
							msg: url_Obj_Json.query.text,
							index: index ++,
							height: new Date().getTime() * new Date().getTime() % 500
						})
					}
					
				})
				server.listen(8100)
				console.info("success")
			})
		}
	}
</script>

<style>
	@keyframes wordsLoop {
		0% {
			transform: translateX(100%);
			opacity: 1;
		}

		100% {
			transform: translateX(-100%);
			opacity: 1;
		}
	}

	/* #moveItem {
		display: inline-block;
		position: relative;
	}

	#moveItem:not(:hover) {
		animation: 5s wordsLoop linear normal;
	} */

	.moveItem {
		opacity: 0;
		width: 1920px;
		/* position: relative; */
		position: absolute;
		font-size: 50px;
		animation: 5s wordsLoop linear normal;
		font-family: '微软雅黑';
		/* color: 'white' */
	}
	
	.moveTitle{
		opacity: 0;
		width: 520px;
		animation: 5s wordsLoop infinite linear normal;
		font-family: '微软雅黑';
	}

	html {
		background-color: transparent;
		overflow: hidden;
	}
</style>
