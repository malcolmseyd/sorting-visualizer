inputNumbers = document.getElementById("inputnumbers");
sortingArray = document.getElementById("sortingarray");
shuffleButton = document.getElementById("shuffle");
bubbleSortButton = document.getElementById("bubblesort");
selectionSortButton = document.getElementById("selectionsort");
insertionSortButton = document.getElementById("insertionsort");
mergeSortButton = document.getElementById("mergesort");
quickSortButton = document.getElementById("quicksort");

// 1000ms / 60 = 17ms, should render every frame on 60fps display
let SLEEPTIME = 17;

function handleNumberChange(e) {
	let el = e.target

	if (sortingArray.locked) {
		el.value = el.oldValue;
		return;
	}

	value = parseInt(el.value);

	el.oldValue = el.value;
	resizeArray(value)
}

inputNumbers.oninput = handleNumberChange

function shuffleArray() {
	resizeArray(inputNumbers.valueAsNumber || 0);
}
shuffleArray();

shuffleButton.onclick = shuffleArray


async function bubbleSortArray() {
	if (sortingArray.locked) return;
	sortingArray.locked = true;
	await bubbleSort();
	sortingArray.locked = false;
}
bubbleSortButton.onclick = bubbleSortArray

async function selectionSortArray() {
	if (sortingArray.locked) return;
	sortingArray.locked = true;
	await selectionSort();
	sortingArray.locked = false;
}
selectionSortButton.onclick = selectionSortArray

async function insertionSortArray() {
	if (sortingArray.locked) return;
	sortingArray.locked = true;
	await insertionSort();
	sortingArray.locked = false;
}
insertionSortButton.onclick = insertionSortArray

async function mergeSortArray() {
	if (sortingArray.locked) return;
	sortingArray.locked = true;
	await mergeSort();
	sortingArray.locked = false;
}
mergeSortButton.onclick = mergeSortArray

async function quickSortArray() {
	if (sortingArray.locked) return;
	sortingArray.locked = true;
	await quickSort();
	sortingArray.locked = false;
}
quickSortButton.onclick = quickSortArray

function arrayRangeTo(n) {
	arrayRange(1, n);
}

function arrayRange(start, len) {
	return Array.from({ length: len }, (_, i) => i + start)
}

insertionSortButton.onclick = insertionSortArray

function arrayRangeTo(n) {
	return Array.from({ length: n }, (_, i) => i + 1)
}

function newArrayDOMElement(thisHeight, totalHeight) {
	const newElem = document.createElement("div")
	newElem.className = "arrayelem"
	// * 90 because it'll go off the screen otherwise
	newElem.style = `height: ${thisHeight * 100 / totalHeight}%`
	return newElem;
}

function resizeArray(n) {
	const rangeArray = arrayRangeTo(n);

	renderArray(_.shuffle(rangeArray));
}

function renderArray(array, options = {}) {
	sortingArray.array = array;

	const newElems = array.map((x) => newArrayDOMElement(x, array.length));

	if (options.active) {
		for (let i = 0; i < options.active.length; i++) {
			newElems[options.active[i]].className += " active"
		}
	}

	while (sortingArray.firstChild) {
		sortingArray.removeChild(sortingArray.lastChild);
	}

	for (let i = 0; i < newElems.length; i++) {
		sortingArray.appendChild(newElems[i]);
	}
}

function renderFlatArray(array, options) {
	renderArray(array.flat(Infinity), options)
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getArray() {
	return sortingArray.array
}

function setArray(array) {
	sortingArray.array = array;
}

sortingArray.locked = false;

function swap(a, b, arr) {
	const tmp = arr[a];
	arr[a] = arr[b];
	arr[b] = tmp;
}

async function bubbleSort() {
	let array = getArray();

	for (let maxIndex = array.length; maxIndex > 0; maxIndex--) {
		let sorted = true;

		for (let i = 1; i < maxIndex; i++) {
			if (array[i - 1] > array[i]) {
				swap(i, i - 1, array);
				sorted = false;
			}
			renderArray(array, { active: [i] })
			await sleep(SLEEPTIME);
		}
		if (sorted) break;
	}
	renderArray(array);
	setArray(array);
}

async function selectionSort() {
	let array = getArray();

	let sortedFrom = 0;
	while (true) {
		if (sortedFrom == array.length) {
			break;
		}

		let min = sortedFrom;
		for (let i = sortedFrom + 1; i < array.length; i++) {
			if (array[i] < array[min]) {
				min = i;
			}
			renderArray(array, { active: [i] })
			await sleep(SLEEPTIME);
		}
		swap(min, sortedFrom, array);
		sortedFrom++;
	}
	renderArray(array);
	setArray(array);
}

async function insertionSort() {
	let array = getArray();

	for (let i = 1; i < array.length; i++) {
		for (let j = i; j > 0; j--) {
			if (array[j] < array[j - 1]) {
				swap(j, j - 1, array);
				renderArray(array, { active: [j] })
				await sleep(SLEEPTIME);
			} else {
				renderArray(array, { active: [j] })
				await sleep(SLEEPTIME);
				break;
			}


		}
	}

	renderArray(array);
	setArray(array);
}

function splitArray(arr) {
	const len = arr.length;
	if (len < 2) {
		return arr;
	}
	return [
		splitArray(arr.slice(0, Math.ceil(len / 2))),
		splitArray(arr.slice(Math.ceil(len / 2), len)),
	]
}

async function mergeArray(arr, wholeArray, start) {
	if (arr.length === 1) {
		return arr;
	}

	const [left, right] = arr;
	const sortedArr = [];

	await mergeArray(left, wholeArray, start);
	await mergeArray(right, wholeArray, start + left.length);

	// copy least values from each array into new one
	// don't mutate left or right, keep an index of new "front" or min value
	// include logic for when one is empty (just drain the other)
	// render each read (active = the two compared, or one drained)
	let minLeft = 0;
	let minRight = 0;
	while (minLeft < left.length || minRight < right.length) {
		if (minLeft === left.length) {
			renderFlatArray(wholeArray, { active: [start + left.length + minRight] })
			await sleep(SLEEPTIME);

			sortedArr.push(right[minRight]);
			minRight++;
		} else if (minRight === right.length) {
			renderFlatArray(wholeArray, { active: [start + minLeft] })
			await sleep(SLEEPTIME);

			sortedArr.push(left[minLeft]);
			minLeft++;
		} else if (left[minLeft] < right[minRight]) {
			renderFlatArray(wholeArray, { active: [start + minLeft, start + left.length + minRight] })
			await sleep(SLEEPTIME);

			sortedArr.push(left[minLeft]);
			minLeft++;
		} else {
			renderFlatArray(wholeArray, { active: [start + minLeft, start + left.length + minRight] })
			await sleep(SLEEPTIME);

			sortedArr.push(right[minRight]);
			minRight++;
		}
	}

	arr.pop();
	arr.pop();

	for (let i = 0; i < sortedArr.length; i++) {
		arr.push(sortedArr[i]);
	}
	// render all writes in one go
	renderFlatArray(wholeArray, { active: arrayRange(start, arr.length) })
	await sleep(SLEEPTIME);

	return;
}

function recursiveListPrint(arr) {
	let str = "["
	for (let i = 0; i < arr.length; i++) {
		if (i) str += ", ";
		if (typeof arr[i] === "number") {
			str += arr[i];
		} else {
			str += recursiveListPrint(arr[i]);
		}
	}
	str += "]"
	return str;
}

async function mergeSort() {
	// keep subdividing the array until each list is one element. don't render this
	// merge the smallest levels, render this
	//   sub-lists are already sorted
	//   min first element of either sub-list
	//   keep going till both are empty
	//     display reads from each sub-list
	//     display writing the entire sorted sub-list
	// keep going up until at the top level, render this

	let array = getArray();

	const split = splitArray(array)

	await mergeArray(split, split, 0);
	array = split;

	renderArray(array);
	setArray(array);
}

async function quickSortSplit(arr, wholeArray, start) {
	const pivotIndex = Math.floor(Math.random() * arr.length)
	const pivot = arr[pivotIndex];
	const less = [];
	const more = [];

	for (let i = 0; i < arr.length; i++) {
		if (i === pivotIndex) continue;
		if (arr[i] < pivot) {
			less.push(arr[i])
		} else {
			more.push(arr[i])
		}
		renderFlatArray(wholeArray, { active: [start + i, start + pivotIndex] })
		await sleep(SLEEPTIME);
	}

	while (arr.length) {
		arr.pop();
	}

	arr.push(less);
	arr.push(pivot);
	arr.push(more);

	const lessLen = less.length;
	const moreLen = more.length;
	if (less.length) await quickSortSplit(less, wholeArray, start);
	renderFlatArray(wholeArray, { active: arrayRange(start, lessLen) })
	await sleep(SLEEPTIME);
	if (more.length) await quickSortSplit(more, wholeArray, start + lessLen + 1);
	renderFlatArray(wholeArray, { active: arrayRange(start, moreLen) })
	await sleep(SLEEPTIME);
}

async function quickSort() {
	let array = getArray();

	await quickSortSplit(array, array, 0);
	array = array.flat(Infinity);

	renderArray(array);
	setArray(array);
}