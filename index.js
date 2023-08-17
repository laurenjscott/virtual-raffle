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
        window.scroll(0, 0);
    } else if (currentInput.validationMessage == "There is a duplicate name entry!" || currentInput.validationMessage == "") { //Validation is now valid or it was already valid
        currentInput.setCustomValidity("");
        errorMessagePara.textContent = "";
        errorMessagePara.classList.add("error-message-string-hidden");
    } else { // A custom validation error other than duplicate values is occuring, so don't empty mess with the validity message. Or there was a dupe but the current input's value is empty so the supe is 1 or more other empty inputs. That will be trapped for separately. 
        return;
    }
}

const checkInputForPatternMismatch = (event) => {
    const currentInput = event.target;
    const errorMessagePara = document.querySelector("form p");
    if(event.target.validity.patternMismatch == true) { //regex pattern in HTML doesn't match
        const errorMessageString = "Name must contain at least 1 letter and should be at least 2 characters long. No leading or trailing spaces either.";
        errorMessagePara.textContent = errorMessageString;
        errorMessagePara.classList.remove("error-message-string-hidden");
        window.scroll(0, 0);
    } else if(currentInput.validationMessage == "Name must contain at least 1 letter and should be at least 2 characters long. No leading or trailing spaces either." || currentInput.validationMessage == "") {
        errorMessagePara.textContent = "";
        errorMessagePara.classList.add("error-message-string-hidden");
    } else {
        return;
    }
       
}


const submitEntries = () => {
    const allInputsArray = [...allInputsObject];
    const errorMessagePara = document.querySelector("form p");
    let errorCount = 0;
    allInputsArray.forEach(input => { 
        if (errorCount == 0) { //stop forEach once an error is detected in an input value.
            if(input.validity.patternMismatch == true) { //regex pattern in HTML doesn't match
                const errorMessageString = "Name must contain at least 1 letter and should be at least 2 characters long. No leading or trailing spaces either.";
                errorMessagePara.textContent = errorMessageString;
                errorMessagePara.classList.remove("error-message-string-hidden");
                input.classList.add("invalid-input");
                errorCount++;
                window.scroll(0, 0);
        }   else if (input.validity.customError == true) { // duplicate entries
                const errorMessageString = input.validationMessage;
                errorMessagePara.textContent = errorMessageString;
                errorMessagePara.classList.remove("error-message-string-hidden");
                input.classList.add("invalid-input");
                errorCount++;
                window.scroll(0, 0);
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
                    if(input.value != "") { // prevents the first input in the form from throwing an error when user enters data in inputs 2 - 5 and there is only 1 input with a value on the form.
                        input.classList.add("invalid-input");
                        errorCount++;
                        window.scroll(0, 0);
                    }
                   
                    
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




allInputsObject.forEach(input => input.addEventListener("input", () => checkInputForDuplicates(event)));

allInputsObject.forEach(input => input.addEventListener("input", () => checkInputForPatternMismatch(event)));

const submitButton = document.querySelector("button");
submitButton.addEventListener("click", () => submitEntries());




