const errorMessageString = document.querySelector("form p");
const allInputs = document.querySelectorAll("input");
const submitButton = document.querySelector("button");
const allInputsArray = [...allInputs];


//Give button more emphasis when more than 1 input has a value  
const recolorSubmitButton = () => {
    const inputsWithValuesArray = allInputsArray.filter(input => input.value.length > 0);
    console.log(inputsWithValuesArray.length);
    if (inputsWithValuesArray.length > 1) {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "true");
    }
}

const submitEntries = () => {
    const inputValues = [];
    allInputsArray.forEach(input => {
        if(input.value != undefined && input.value != null && input.value != "") {
           inputValues.push(input.value);
        }
    });
    //At least two entries?
    if(inputValues.length < 2) {
        errorMessageString.classList.remove("error-message-string-hidden");
        errorMessageString.textContent = "Error: at least two entries are required!";
        return;
    //All entries have at least 2 letters?
    } else if(inputValues.some(inputValue => inputValue.length <= 1) == true) {
        errorMessageString.classList.remove("error-message-string-hidden");
        errorMessageString.textContent = "Error: each name must contain at least two letters!";
        return;
    }
    //No duplicates?    
    const dupeCountsObj = {};
    inputValues.forEach(value => {dupeCountsObj[value.toLowerCase()] = (dupeCountsObj[value.toLowerCase()] || 0) + 1});
    const dupeCountsArray = Object.values(dupeCountsObj);
    const isDupe = dupeCountsArray.some(count => count > 1 );
    if(isDupe) {
        errorMessageString.classList.remove("error-message-string-hidden");
        errorMessageString.textContent = "Error: no duplicate entries allowed!";
        return;
    } else {
          const entriesObj = {"raffleEntries": ""};
          const valueArray = [];
          for(let i = 0; i < inputValues.length; i++ ) {
              valueArray.push({firstName: inputValues[i], entryID: i + 1});
          }
          entriesObj.raffleEntries = valueArray;
          //Save form data to session storage. It only accepts strings.
          sessionStorage.setItem("raffleEntries", JSON.stringify(entriesObj));
          window.location.assign("./raffle/raffle.html");

    }
}

allInputs.forEach(input => input.addEventListener("input", () => recolorSubmitButton()));
submitButton.addEventListener("click", () => submitEntries());
