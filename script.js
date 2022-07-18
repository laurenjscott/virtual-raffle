//Elements
const mainUl = document.querySelector("main ul");
const asideH2 = document.querySelector("aside h2");
const asideUl = document.querySelector("aside ul");
const pickWinnerButton = document.querySelector("button#refresh-button");
const clearStorageButton = document.querySelector(
	"button#clear-storage-button"
);
const dialog = document.querySelector("dialog");
const yesClearStorageButton = document.querySelector(
	"dialog button:first-child"
);

const noCancelButton = document.querySelector(
	"dialog button:last-child");

let hide;

//Local storage stuff

	//THIS IS TEMPORARY 7-9-2022. Delete 7-10-2022 after running in all user agents.
localStorage.removeItem("raffleWinner");	


let localStorageWinners = localStorage.getItem("raffleWinners")
	? JSON.parse(localStorage.getItem("raffleWinners"))
	: undefined;
let allRaffleWinners = [];
if (localStorageWinners) {
	allRaffleWinners = localStorageWinners;
}

//Used to save winner of raffle
let currentWinner;

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



/**************Event Listeners************************************/
//Pick Winner button
pickWinnerButton.addEventListener("click", () => {
	pickWinner();
});

//Clear Storage button
clearStorageButton.addEventListener("click", () => {
	//Note: dialog closes automatically since its form child element has an attribute value of "dialog"
//    setTimeout(() =>  {dialog.showModal();}, 500);
     if (dialog.classList.contains("unsupported")) {
        checkUnsupportedBrowser(hide = false);
     } else {
//        setTimeout(() =>  {dialog.showModal();}, 500);
        dialog.showModal();

    }
   
});


//"Yes" button in dialog
yesClearStorageButton.addEventListener("click", () => {
	localStorage.removeItem("raffleWinners");
	asideUl.innerHTML = "";
	asideH2.textContent = `Previous Winners: 0`;
    if (dialog.classList.contains("unsupported")) {
        checkUnsupportedBrowser(hide = true);
     } 
	

});

//"No" button in dialog
noCancelButton.addEventListener("click", () => {
    if (dialog.classList.contains("unsupported")) {
        checkUnsupportedBrowser(hide = true);
     } 
});

/**********************************************************/


if (window.HTMLDialogElement == undefined) {
	dialog.classList.add("unsupported", "hidden");
}

/************Functions**************************************/

function pickWinner() {
	//add a randomNumber key and value to each raffle entry object
	entries.raffleEntries.forEach((item) => {
		item.randomNumber = Math.random();
	});
	

	//add previous winner to previous winner list, if applicable
	if (currentWinner) {
		let li = document.createElement("li");
		li.setAttribute("data-name", currentWinner.firstName);
		li.textContent = `${currentWinner.firstName}, ${Intl.DateTimeFormat("en-US", {
			dateStyle: "full",
			timeStyle: "long"
		}).format(new Date(currentWinner.winDate))}`;
		asideUl.appendChild(li);
		asideH2.textContent = `Previous Winners: ${asideUl.childNodes.length}`;
	}

	//Who has the lowest random number compared to the randomNumber variable? Tell it to the console.
	currentWinner = entries.raffleEntries.reduce((previousMinEntry, entry) =>
		Math.abs(previousMinEntry.randomNumber) < Math.abs(entry.randomNumber)
			? previousMinEntry
			: entry
	);
	console.log(
		`Congratulations, ${currentWinner.firstName}! You are the raffle winner!`
	);

	//highlight winner and push winner to local storage
	highlightAndPush(currentWinner);
}


function highlightAndPush(currentWinner) {
	//add a timestamp to raffle winner object
	currentWinner.winDate = new Date();
	//add currentWinner to allRaffleWinners array
	allRaffleWinners.push(currentWinner);
	//Local storage only accepts strings
	localStorage.setItem("raffleWinners", JSON.stringify(allRaffleWinners));
	//remove highlight from previous winner
	if (document.querySelector("li.highlight") != null) {
		document.querySelector("li.highlight").classList.remove("highlight");
	}
	//Finally, highlight the winner visually
	document
		.querySelector(`li[data-name='${currentWinner.firstName}']`)
		.classList.add("highlight");
}



function checkUnsupportedBrowser (hide) {
   
        if (hide === false) {
            dialog.classList.remove("hidden");
            dialog.classList.add("display");
        }
        else {
            dialog.classList.remove("display");
            dialog.classList.add("hidden");
        }
    
}
