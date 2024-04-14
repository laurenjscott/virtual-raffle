window.addEventListener("load", addValidationListeners);

/*****************************Parent Function****************************************/

function addValidationListeners() {
    const allInputsObject = document.querySelectorAll("input");
    const submitButton = document.querySelector("button");
    allInputsObject.forEach(input => input.addEventListener("input", () => checkInputForValidationErrors(event, allInputsObject)));
    // Add validation listener to form submit button
    submitButton.addEventListener("click", () => submitEntries(allInputsObject));
}


/*****************************Child Functions****************************************/
    

function checkInputForValidationErrors(event, allInputsObject) { //if input isn't valid, display appropriate error message
    
    const currentInput = event.target;
    const validity = currentInput.validity;
    const errorMessagePara = currentInput.previousElementSibling;
    const validationMessagesObj = { //more messages can be added later. This is being done to make things more modular.
        errorMessages: {
            patternMismatch: "Name must contain at least 1 letter and should be at least 2 characters long. No leading or trailing spaces either.",
        }
	
    };
    //Will contain input's Validity interface as an object
    const validityStateObj = {};
    
    //First check for an empty input. If it is, remove "user-valid-not-blank" class and exit function
    if(currentInput.value == "") {
        currentInput.classList.remove("user-valid-not-blank");
    }
    

    for (let state in validity) {
        validityStateObj[state] = validity[state];
    }
    //Find first key (error condition state) where the value is true that is not the "valid" state or "customError" state
    const firstError = Object.keys(validityStateObj).find((state) => validityStateObj[state] == true && state != "valid" && state != "customError");
    if(firstError != undefined) { // invalid input data not related to dupes
        //If there is an error, no need to check for dupes at this time.
        //Fetch appropriate message
        const errorMessageString = validationMessagesObj.errorMessages[firstError];
        //Add errorMessageString to error paragraph and display it
        errorMessagePara.querySelector("span").textContent = errorMessageString;
        errorMessagePara.classList.remove("error-description-hidden");
        currentInput.classList.remove("user-valid-not-blank");

    } else { //valid input data
        //Check for dupes
        const dupeFound = checkInputForDuplicates(currentInput, allInputsObject);
        //If dupes, display appropriate error message
        if(dupeFound) {
            errorMessagePara.querySelector("span").textContent = currentInput.validationMessage;
            errorMessagePara.classList.remove("error-description-hidden");
            currentInput.classList.remove("user-valid-not-blank");

        } else { // If no dupes, hide error message
            errorMessagePara.querySelector("span").textContent = "";
            errorMessagePara.classList.add("error-description-hidden");
            if(currentInput.value != "") {
                currentInput.classList.add("user-valid-not-blank");
            }
        }
    } 
    
}


function checkInputForDuplicates(currentInput, allInputsObject) {
    const allInputsArray = [...allInputsObject];
    const otherInputValuesArray = []; //used to collect values of ALL inputs that are NOT the current input element
    
    //Input elements that are NOT currentInput: push input values into an array
    allInputsArray.forEach(input => {
        if(input != currentInput) {
            otherInputValuesArray.push(input);
        }
    })
    //If current input value matches one of the other input values, set custom validity message.
    const dupeFound = otherInputValuesArray.some(input => currentInput.value.toLowerCase() == input.value.toLowerCase());
    console.info(dupeFound);
    if(dupeFound && currentInput.value != "") {
        currentInput.setCustomValidity("There is a duplicate entry.");
        return true;
    } else {
        currentInput.setCustomValidity("");

    } 
}

function checkInputForZeroOrOneName(allInputsObject) { //check if form contains less than 2 names
    const allInputsArray = [...allInputsObject];
    const form = document.querySelector("form"); 
    const countNonEmptyInputs = allInputsArray.filter(input => input.value !== "").length;
    if(countNonEmptyInputs < 2) {
        window.scroll(0, 0);
        //change legend text color to red
        form.classList.add("invalid-entry-count");        
        return true;
    } else {
        return;
    }
}


function submitEntries(allInputsObject) {
    const allInputsArray = [...allInputsObject];
    const notValidInput = allInputsArray.some(input => input.validity.valid == false);
    const notEnoughNames = checkInputForZeroOrOneName(allInputsObject);
    if(notValidInput || notEnoughNames) { // if none of the inputs are valid
        if(notEnoughNames) {
            //give focus to the first empty input. This will trigger the screen reader to read out the error message
            const firstEmptyInputIndex = allInputsArray.findIndex(input => input.value == "");
            const firstEmptyInput = [...document.querySelectorAll(`input`)][firstEmptyInputIndex];
            firstEmptyInput.focus();
        } else {
            //find the first invalid input and focus it. This will trigger the screen reader to read out the error message
            const firstInvalidInputIndex = allInputsArray.findIndex(input => input.validity.valid == false);
            const firstInvalidInput = [...document.querySelectorAll(`input`)][firstInvalidInputIndex];
            firstInvalidInput.focus();
        }
        return;
    } else { // gather form entries, save to session storage, and go to raffle page
        const formData = new FormData(document.querySelector("form"));
        const formDataArray = [];
        let i = 1;
        for(let [key, value] of formData) {
            if(value !== "") {
                let nameObj = {};
                nameObj.firstName = value;
                nameObj.entryId = i;
                formDataArray.push(nameObj);
                i++;
            }
        }
        sessionStorage.setItem("raffleEntries", JSON.stringify(formDataArray));
        window.location.assign("./raffle/raffle.html");
    }

}



