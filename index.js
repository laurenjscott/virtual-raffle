window.addEventListener("load", addValidationListeners);


function addValidationListeners() {
    const allInputsObject = document.querySelectorAll("input");
    const submitButton = document.querySelector("button");
    submitButton.addEventListener("click", submitEntries);
    allInputsObject.forEach(input => input.addEventListener("input", checkInputValidationOnInput));


}

function submitEntries() {
    const form = this.form;
    const isFormValid = validateFormOnSubmissionHTML5(form);
    const businessRulesOK = validateBusinessRules(form);
    const noDupes = checkForDupes(form);
    if(isFormValid && businessRulesOK) {
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
    } else if(isFormValid) { //If form is contains valid data based on the pattern constraint, but violates global business rules (dupes; only has one entry, scroll to top so user can see legend text that is now red in color)
        scroll(0, 0);
    }
    
}


function checkInputValidationOnInput(event) { //"input" event listener on all inputs. Check if data is valid pattern. If it is, hide any validation message that is displaying
    const input = event.currentTarget;
    if(input.checkValidity() || input.validity.patternMismatch == false) {
        //hide this input's validation message string
        const errorMessagePara = input.previousElementSibling;
        errorMessagePara.classList.add("error-description-hidden");
    }
    if(input.validity.patternMismatch == false) { //input previously contained bad data. It doesn't anymore so clear the custom validity message
        input.setCustomValidity("");
    }
}


function validateFormOnSubmissionHTML5(form) { //checks whether all inputs match element's pattern contraint. Doesn't check for business rule violations: (1) duplicate entries or (2)if the form only has one entry
    if(!form.checkValidity()) {
        form.reportValidity();
        const inputWithFocus = document.activeElement;
        inputWithFocus.setCustomValidity("Name must contain at least 1 letter and should be at least 2 characters long. No leading or trailing spaces either.");
        const errorMessagePara = inputWithFocus.previousElementSibling;
        errorMessagePara.classList.remove("error-description-hidden");
        errorMessagePara.querySelector("span").textContent = inputWithFocus.validationMessage;
        return false;
    }
    return true;
}

function checkForDupes(form) {
    const allInputs = [...document.querySelectorAll("input")];
    const findDuplicates = allInputs.filter((input, index) => allInputs.map(input2 => input2.value.toLowerCase()).indexOf(input.value.toLowerCase()) !== index && input.value != ""); //find all dupe inputs that aren't empty
    if(findDuplicates.length > 0) {
        //give red border to all inputs in the array by invoking the "is-dupe" class
        findDuplicates.forEach(input => input.classList.add("is-dupe"));
        //remove red border from all inputs that are not dupes that used to contain one
        const inputsNoDupesAnymore = [...document.querySelectorAll("input")].filter(input => input.classList.contains("is-dupe") && findDuplicates.indexOf(input) == -1);
        inputsNoDupesAnymore.forEach(input => input.classList.remove("is-dupe"));
        return false;
    }
    //remove "is-dupe" class from all inputs
    allInputs.forEach(input => input.classList.remove("is-dupe"));
    return true;
}


function checkInputForZeroOrOneName(form) { //check if form contains less than 2 names
    const allInputs = [...document.querySelectorAll("input")];
    const countNonEmptyInputs = allInputs.filter(input => input.value !== "").length;
    if(countNonEmptyInputs < 2) {    
        return false;
    } 
    return true;
}

function validateBusinessRules(form) {
    const moreThanTwoEntries = checkInputForZeroOrOneName(form);
    const noDupes = checkForDupes(form);
    if(!moreThanTwoEntries || !noDupes) {
        //change legend text color to red
        form.classList.add("invalid-entry-count");        
        return false;
    }
    form.classList.remove("invalid-entry-count"); 
    return true;
}