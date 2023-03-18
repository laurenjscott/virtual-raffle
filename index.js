const errorMessagePara = document.querySelector("form p");
const allInputsObject = document.querySelectorAll("input");
const allInputsArray = [...allInputsObject];
const submitButton = document.querySelector("button");


const checkInputForDuplicates = () => {
    const otherInputValuesArray = [];
    //Get current input value
    const currentInput = event.target;
    //Get array of all OTHER input values
    allInputsArray.forEach(input => {
        if(input != currentInput) {
            otherInputValuesArray.push(input);
        }
    })
    //If current input value matches one of the other input values, set custom validity message.
    if(otherInputValuesArray.some(input => currentInput.value.toLowerCase() == input.value.toLowerCase()) && currentInput.value != "") {
        currentInput.setCustomValidity("There is a duplicate name entry!");
        console.log(currentInput.validity);
    } else {
        currentInput.setCustomValidity("");
    }
}


const submitEntries = () => {
    let errorCount = 0;
    allInputsArray.forEach(input => { 
        if (errorCount == 0) { //stop forEach once an error is detected in an input value.
            if(input.validity.patternMismatch == true) { //regex pattern in HTML doesn't match
                const errorMessageString = "Name must contain at least 1 letter and should be at least 2 characters long. No leading or trailing spaces either.";
                errorMessagePara.textContent = errorMessageString;
                errorMessagePara.classList.remove("error-message-string-hidden");
//                input.focus();
                input.classList.add("invalid-input");
                errorCount++;
                window.scrollY(0);
        }   else if (input.validity.customError == true) { // duplicate entries
                const errorMessageString = input.validationMessage;
                errorMessagePara.textContent = errorMessageString;
                errorMessagePara.classList.remove("error-message-string-hidden");
//                input.focus();
                input.classList.add("invalid-input");
                errorCount++;
                window.scrollY(0);
        }   else { // not a custom error from "dupe" error or a pattern mismatch.  If error, it's from "at least 2 entries" contraint
                const allInputValues = [];
                allInputsArray.forEach(input => {
                    if(input.value != undefined && input.value != null && input.value != "") {
                        allInputValues.push(input.value);
                    }
                });
                if(allInputValues.length < 2) {
                    const errorMessageString = "At least 2 name entries are required."
                    errorMessagePara.textContent = errorMessageString;
                    errorMessagePara.classList.remove("error-message-string-hidden");
//                    input.focus();
                    input.classList.add("invalid-input");
                    errorCount++;
                } else {
                    input.classList.remove("invalid-input");

                }
            
            }
        }
        
    });
    if(errorCount) {
        return;
    } else { // gather form entries, save to session storage, and go to raffle page
        const finalInputValues = [];
        allInputsArray.forEach(input => {
            if(input.value != undefined && input.value != null && input.value != "") {
                finalInputValues.push(input.value);
            }
        });
        const entriesObj = {"raffleEntries": ""};
        const valueArray = [];
        for(let i = 0; i < finalInputValues.length; i++ ) {
              valueArray.push({firstName: finalInputValues[i], entryID: i + 1});
        }
        entriesObj.raffleEntries = valueArray;
        //Save form data to session storage. It only accepts strings.
        sessionStorage.setItem("raffleEntries", JSON.stringify(entriesObj));
        window.location.assign("./raffle/raffle.html");
    }

}



allInputsObject.forEach(input => input.addEventListener("input", () => checkInputForDuplicates()));
submitButton.addEventListener("click", () => submitEntries());
