const allInputsObject = document.querySelectorAll("input");

const checkInputForDuplicates = (event) => {
    const errorMessagePara = document.querySelector("form p");
    const allInputsArray = [...allInputsObject];
    const otherInputValuesArray = []; //used to collect values of ALL inputs that are NOT the current input element
    const currentInput = event.target; //get input element with the current focus
    //Input elements that are NOT currentInput: push input values into an array
    allInputsArray.forEach(input => {
        if(input != currentInput) {
            otherInputValuesArray.push(input);
        }
    })
    //If current input value matches one of the other input values, set custom validity message.
    const dupeFound = otherInputValuesArray.some(input => currentInput.value.toLowerCase() == input.value.toLowerCase());
    if(dupeFound && currentInput.value != "") {
        currentInput.setCustomValidity("There is a duplicate name entry!");
        const errorMessageString = "There is a duplicate name entry!";
        errorMessagePara.textContent = errorMessageString;
        errorMessagePara.classList.remove("error-message-string-hidden");
        currentInput.classList.add("invalid-input");
        window.scroll(0, 0);
    } else if (currentInput.validationMessage == "There is a duplicate name entry!" || currentInput.validationMessage == "") { //Validation is now valid or it was already valid
        currentInput.setCustomValidity("");
        errorMessagePara.textContent = "";
        errorMessagePara.classList.add("error-message-string-hidden");
        currentInput.classList.remove("invalid-input");

    } else { // A custom validation error other than duplicate values is occuring, so don't mess with the validity message. Or there was a dupe but the current input's value is empty so the "dupe" is 1 or more other empty inputs. That will be trapped for separately. 
        return;
    }
}

const checkInputForPatternMismatch = (event) => {
    const currentInput = event.target;
    const errorMessagePara = document.querySelector("form p");
    const errorMessageString = "Name must contain at least 1 letter and should be at least 2 characters long. No leading or trailing spaces either.";
    if(event.target.validity.patternMismatch == true) { //regex pattern in HTML doesn't match
        errorMessagePara.textContent = errorMessageString;
        errorMessagePara.classList.remove("error-message-string-hidden");
        currentInput.classList.add("invalid-input");
        window.scroll(0, 0);
    } else if(currentInput.validationMessage == `${errorMessageString}` || currentInput.validationMessage == "") {
        errorMessagePara.textContent = "";
        errorMessagePara.classList.add("error-message-string-hidden");
        currentInput.classList.remove("invalid-input");

    } else {
        return;
    }
       
}


const checkInputForZeroOrOneName = () => { //check if form contains less than 2 names
    const allInputsArray = [...allInputsObject];
    const errorMessagePara = document.querySelector("form p");
    const countNonEmptyInputs = allInputsArray.filter(input => input.value !== "").length;
    const errorMessageString = "At least 2 names are required.";
    if(countNonEmptyInputs < 2) {
        errorMessagePara.textContent = errorMessageString;
        errorMessagePara.classList.remove("error-message-string-hidden");
        window.scroll(0, 0);
        return true;
    } else if(allInputsArray.every(input => input.validity.valid == true))   { 
        errorMessagePara.textContent = "";
        errorMessagePara.classList.add("error-message-string-hidden");
    } else {
        return;
    }
}


const submitEntries = () => {
    const allInputsArray = [...allInputsObject];
    const notValidInput = allInputsArray.some(input => input.validity.valid == false);
    const notEnoughNames = checkInputForZeroOrOneName();
    if(notValidInput || notEnoughNames) { // if non of the inputs are valid, return early
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


allInputsObject.forEach(input => input.addEventListener("input", () => checkInputForDuplicates(event)));

allInputsObject.forEach(input => input.addEventListener("input", () => checkInputForPatternMismatch(event)));


const submitButton = document.querySelector("button");
submitButton.addEventListener("click", () => submitEntries());


