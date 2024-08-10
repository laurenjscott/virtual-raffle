window.addEventListener("load", () => {
	const pickWinnerButton = document.querySelector("button#refresh-button");
	//"Yes" button in "Clear Winners" dialog
	const yesClearStorageButton = document.querySelector("dialog button:first-of-type");
	//"No" button in "Clear Winners" dialog
	const noCancelButton = document.querySelector("dialog button:last-child");
	pickWinnerButton.addEventListener("click", pickWinner);
	yesClearStorageButton.addEventListener("click", () => {
		localStorage.removeItem("raffleWinners");
		asideUl.innerHTML = "";
		asideH2.textContent = `Previous Winners: 0`;
    	if (dialog.classList.contains("unsupported")) {
        	checkUnsupportedBrowser(hide = true);
     	}
		const clearStorageButton = document.querySelector("button#clear-storage-button")
    	toggleClearStorageButtonState(clearStorageButton);

	
	});

	noCancelButton.addEventListener("click", () => {
    	if (dialog.classList.contains("unsupported")) {
        	checkUnsupportedBrowser(hide = true);
     	}
	 	const clearStorageButton = document.querySelector("button#clear-storage-button")
	 	toggleClearStorageButtonState(clearStorageButton);

	});

});

/*Variables***********************************/
//Elements
const asideH2 = document.querySelector("aside h2");
const asideUl = document.querySelector("aside ul");
const dialog = document.querySelector("dialog");

//JSON data
const entries = JSON.parse(sessionStorage.getItem("raffleEntries"));

//Local storage stuff
let localStorageWinners = localStorage.getItem("raffleWinners")
	? JSON.parse(localStorage.getItem("raffleWinners"))
	: undefined;
let allRaffleWinners = [];
if (localStorageWinners) {
	allRaffleWinners = localStorageWinners;
}


/***************************************************************************/

//Enable or disable "ClearWinners" button. If enabled, add event listerner to button thst opens dialog element
if (localStorageWinners) {
	const clearStorageButton = document.querySelector("button#clear-storage-button");
    clearStorageButton.addEventListener("click", clearStorageButtonFunction);
    clearStorageButton.removeAttribute("disabled");
} else {
	const clearStorageButton = document.querySelector("button#clear-storage-button");
    clearStorageButton.setAttribute("disabled", "true");
}


//render list of entries
entries.forEach((item) => {
	const mainUl = document.querySelector("main ul");
	let li = document.createElement("li");
    let span = document.createElement("span");
	li.setAttribute("data-name", item.firstName);
	span.textContent = item.firstName;
    li.appendChild(span);
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

/**********************************************************/

//Check if browser supports the dialog element
if (window.HTMLDialogElement == undefined) {
	dialog.classList.add("unsupported", "hidden");
}


/************Functions**************************************/

function pickWinner() {
	//add a randomNumber key and value to each raffle entry object
	entries.forEach((item) => {
		item.randomNumber = Math.random();
	});
	//add previous winner to previous winner list, if applicable
	const previousWinner = sessionStorage.getItem("currentWinner") ? JSON.parse(sessionStorage.getItem("currentWinner")) : null;
	if (previousWinner) {
		let li = document.createElement("li");
		li.setAttribute("data-name", previousWinner.firstName);
		li.textContent = `${previousWinner.firstName}, ${Intl.DateTimeFormat("en-US", {
			dateStyle: "full",
			timeStyle: "long"
		}).format(new Date(previousWinner.winDate))}`;
		asideUl.appendChild(li);
		asideH2.textContent = `Previous Winners: ${asideUl.childNodes.length}`;
	}
	//Who has the lowest random number? Tell it to the console.
	const currentWinner = entries.reduce((previousMinEntry, entry) =>
		Math.abs(previousMinEntry.randomNumber) < Math.abs(entry.randomNumber)
			? previousMinEntry
			: entry
	);
	// //add a timestamp to raffle winner object
	currentWinner.winDate = new Date();
	sessionStorage.setItem("currentWinner", JSON.stringify(currentWinner));
	console.log(
		`Congratulations, ${currentWinner.firstName}! You are the raffle winner!`
	);

	//highlight winner and push winner to local storage
	highlightAndPush(currentWinner);
    
    //enables or disables "Clear Winners" button based on local storage value. Caveat: don't toggle local storage was previously empty prior to function execution
    if (JSON.parse(localStorage.raffleWinners).length > 1) {
		const clearStorageButton = document.querySelector("button#clear-storage-button");
        toggleClearStorageButtonState(clearStorageButton);
    }
    
    //Update Raffle Entries timestamp string
    showRecentRaffleTimestamp();
    
}


function highlightAndPush(currentWinner) {
	//add currentWinner to allRaffleWinners array
	allRaffleWinners.push(currentWinner);
	//Local storage only accepts strings
	localStorage.setItem("raffleWinners", JSON.stringify(allRaffleWinners));
	//remove highlight from previous winner
	if (document.querySelector("li span.highlight") != null) {
		document.querySelector("li span.highlight").classList.remove("highlight");
	}
	//Finally, highlight the winner visually
	document
		.querySelector(`li[data-name='${currentWinner.firstName}'] span`)
		.classList.add("highlight");
}


//Controls visibility of element that renders when dialog isn't supported (it appears a div-like block element).
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


//Toggle state of and script action applied to "Clear Winners" button. Executed after clicking the "Clear Winners" button
function toggleClearStorageButtonState (clearStorageButton) {
    if (localStorage.raffleWinners) {
        if (clearStorageButton.hasAttribute("disabled")) {
            clearStorageButton.addEventListener("click", clearStorageButtonFunction);
            clearStorageButton.removeAttribute("disabled");
        }
    } else {
         if (clearStorageButton.hasAttribute("disabled") == false) {
            clearStorageButton.removeEventListener("click", clearStorageButtonFunction);
            clearStorageButton.setAttribute("disabled", "true");

        }
    }
}

function clearStorageButtonFunction () {
	//Note: dialog closes automatically since its form child element has an attribute value of "dialog"
    
        if (dialog.classList.contains("unsupported")) {
            checkUnsupportedBrowser(hide = false); //if browser doesn't support dialog element, run function that controls visibility of the element that the browser replaces the dialog  – a div-like block element.
        } else {
            setTimeout(() =>  {dialog.showModal()}, 500); // a delay is needed to avoid "bug" where double-clicking on this button causes "double tap to zoom" is be enabled on iOS when the dialog is opened. Touch action rules applied in CSS are ignored as long as the dialog is open.

        }    
}


//When user clicks "Pick Winners" button, current timestamp is displayed under the Raffle Entries section
function showRecentRaffleTimestamp () {
	const recentRaffleTimestampParagraph = document.querySelector("main section p");
    //Save most recent entry's timestamp from session storage as a variable
    const previousRaffleWinners = JSON.parse(localStorage.raffleWinners);
    const recentRaffleEntryTimestamp = previousRaffleWinners[previousRaffleWinners.length - 1].winDate;
    //Format date variable so it uses US English syntax
    const recentRaffleEntryTimestampUSFormatted = Intl.DateTimeFormat("en-US", {
			dateStyle: "full",
			timeStyle: "long"
		}).format(new Date(recentRaffleEntryTimestamp));
    console.log(recentRaffleEntryTimestampUSFormatted);
    //Add "Raffle conducted " + dateVariable to last paragraph in Raffle Entries section
    recentRaffleTimestampParagraph.textContent = `Raffle conducted on ${recentRaffleEntryTimestampUSFormatted}`;
       
}

function determineClearWinnersButtonState() {

}


