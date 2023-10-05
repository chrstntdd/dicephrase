/**
 * @credit
 * https://web.dev/building-a-toast-component/
 */

import { onMount } from "solid-js"

import * as styles from "./toast.css"

function makeToast(msg: string, showTime: number) {
	let node = document.createElement("output")

	node.innerText = msg
	node.setAttribute("role", "status")
	node.setAttribute("aria-live", "polite")
	node.style.setProperty(styles.TOAST_DURATION_VAR, `${showTime}ms`)
	node.classList.add(styles.toastItem)

	return node
}

function flipToast(n: Node, parent: HTMLElement) {
	let first = parent.offsetHeight
	parent.appendChild(n)

	let last = parent.offsetHeight

	let invert = last - first

	let anim = parent.animate(
		[{ transform: `translateY(${invert}px)` }, { transform: `translateY(0)` }],
		{
			duration: 150,
			easing: "ease-out",
		},
	)

	anim.startTime = document.timeline.currentTime
}

function addToast(toast: HTMLElement, toastContainer: HTMLElement) {
	toastContainer.children.length
		? flipToast(toast, toastContainer)
		: toastContainer.appendChild(toast)
}

export function Toast(props: {
	msg: string
	/** @description How long (in ms) the Toast should display for. Default is 3000 */
	showTime?: number
}) {
	// Defined in the index.html
	onMount(async () => {
		let toastContainer = document.getElementById(
			"app-toast-group",
		) as HTMLElement

		let toast = makeToast(props.msg, props.showTime ?? 3000)

		addToast(toast, toastContainer)

		await Promise.allSettled(toast.getAnimations().map((ani) => ani.finished))

		toastContainer.removeChild(toast)
	})

	return null
}
