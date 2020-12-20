<template>
	<div id="wrapper">
		<p v-for="item in testData" :style="{'top': item.height + 'px'}" class="moveItem">{{item.msg}}</p>
	</div>
</template>

<script>
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
				setInterval(_ => {
					this.testData.push({
						msg: '测试弹幕' + new Date().getTime(),
						height: new Date().getTime() * new Date().getTime() % 1000
					})
				}, 1000)
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
	}

	html {
		background-color: transparent;
		overflow: hidden;
	}
</style>
