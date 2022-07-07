//elements
const mainUl = document.querySelector("main ul");
const asideH2 = document.querySelector("aside h2");
const asideUl = document.querySelector("aside ul");
const pickWinnerButton = document.querySelector("button#refresh-button");
const clearStorageButton = document.querySelector(
	"button#clear-storage-button"
);
const dialog = document.querySelector("dialog");
const yesclearStorageButton = document.querySelector(
	"dialog button:first-child"
);

//local storage stuff
let localStorageWinners = localStorage.getItem("raffleWinner")
	? JSON.parse(localStorage.getItem("raffleWinner"))
	: undefined;
let allRaffleWinners = [];
if (localStorageWinners) {
	allRaffleWinners = localStorageWinners;
}

//JSON data
const json =
	'{"raffleEntries":[{"entryID": 1, "firstName": "Heather"}, {"entryID": 2, "firstName": "Akilah"}, {"entryID": 3, "firstName": "Marcus"},{"entryID": 4, "firstName": "Jacob"},{"entryID": 5, "firstName": "Erika"}]}';
const entries = JSON.parse(json);

//render list of entries
entries.raffleEntries.forEach((item) => {
	let li = document.createElement("li");
	li.setAttribute("data-name", item.firstName);
	li.textContent = item.firstName;
	mainUl.appendChild(li);
});

//render list of previous winners
if (localStorageWinners) {
	localStorageWinners.forEach((item) => {
		let li = document.createElement("li");
		li.setAttribute("data-name", item.firstName);
		li.textContent = `${item.firstName}, ${Intl.DateTimeFormat("en-US", {
			dateStyle: "full",
			timeStyle: "long"
		}).format(new Date(item.winDate))}`;
		asideUl.appendChild(li);
	});
	asideH2.textContent = `Previous Winners: ${allRaffleWinners.length}`;
}

// JSON.parse(localStorage.raffleWinner).forEach((item) => {
// 	let li = document.createElement("li");
// 	li.setAttribute("data-name", item.firstName);
// 	li.textContent = `${item.firstName}, ${Intl.DateTimeFormat("en-US", {
// 		dateStyle: "full",
// 		timeStyle: "long"
// 	}).format(new Date(item.winDate))}`;
// 	asideUl.appendChild(li);
// });
// asideH2.textContent = `Previous Winners: ${
// 	JSON.parse(localStorage.raffleWinner).length
// }`;

function pickWinner() {
	//add a randomNumber key and value to each raffle entry object
	entries.raffleEntries.forEach((item) => {
		item.randomNumber = Math.random();
	});
	//another random number
	const docRandomNumber = Math.random();

	//Who has the lowest random number compared to the rabdomNumber variable? Tell it to the console.
	let lowestRandom = entries.raffleEntries.reduce((previousMinEntry, entry) =>
		Math.abs(previousMinEntry.randomNumber) < Math.abs(entry.randomNumber)
			? previousMinEntry
			: entry
	);
	console.log(
		`Congratulations, ${lowestRandom.firstName}! You are the raffle winner!`
	);

	//Oh, and save it to local storage along with the current timestamp
	lowestRandom.winDate = new Date();
	//add lowestRandom to allRaffleWinners array
	allRaffleWinners.push(lowestRandom);
	localStorage.setItem("raffleWinner", JSON.stringify(allRaffleWinners));

	//Finally, highlight the winner visually
	document
		.querySelector(`li[data-name='${lowestRandom.firstName}']`)
		.classList.toggle("highlight");
}

//Pick Winner button
pickWinnerButton.addEventListener("click", (event) => {
	// window.location.reload();
	pickWinner();
});

//Clear Storage button
clearStorageButton.addEventListener("click", (event) => {
	dialog.showModal();
});

yesclearStorageButton.addEventListener("click", (event) => {
	localStorage.removeItem("raffleWinner");
	asideUl.innerHTML = "";
	asideH2.textContent = `Previous Winners: 0`;
});

/********************************************************/

// function clickButton(event) {
// 	let x = event.target.nextElementSibling.lastElementChild; //p element
// 	x.classList.toggle("hide-element");
// 	x.classList.toggle("show-element");
// 	return true;
// }

// document
// 	.querySelectorAll("button")
// 	.forEach((item) => item.addEventListener("click", clickButton));