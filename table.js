let tablesSelected = document.getElementsByClassName("tables");
let personNum = document.getElementById("person");
let option = document.getElementsByClassName("option")
let tableTimeValue = document.getElementsByClassName("timeValue")
let orderButton = document.getElementsByClassName("orderbutton")[0];

//LocalStore
for(let i=0; i<option.length; i++){
    if(option[i].textContent === localStorage.person){
        option[i].setAttribute("selected", "");
    }
}
selected_date_element.textContent = localStorage.Date;
for(let i=0; i<tableTimeValue.length; i++){
    if(tableTimeValue[i].textContent === localStorage.timeValue){
        tableTimeValue[i].setAttribute("selected", "");
    }
}
let personSelected = personNum.options[personNum.selectedIndex].text;
let personValue = personNum.options[personNum.selectedIndex].value

//Ширээ сонгох болон 2 давхар ширээ захиалга шалгах хэсэг
//=============================================================================================
let seat = 0;
let orderTable = "";
for(let i=0; i<tablesSelected.length; i++){
    tablesSelected[i].addEventListener("click", (e)=>{
        let seatCount = tablesSelected[i].firstElementChild.value;
        orderTable = tablesSelected[i].lastElementChild.textContent;
        if(seatCount>=personValue){
            console.log("ALDAA");
            if(seat<1){
                seat++;
                tablesSelected[i].classList.toggle("active");
                if(tablesSelected[i].classList[2]){
                }
                else{
                    seat=seat-2;
                }
            } else{if(tablesSelected[i].classList[2]){
                    seat--;
                    tablesSelected[i].classList.toggle("active");
                }else
                alert("Та 2 ширээ захилах гэж байна.");
            }
        } else {
            swal(`${personValue} дээш суудалтай ширээ захиална уу!`);
        }
    });
    }
//=============================================================================================

//
orderButton.addEventListener("click", ()=>{
    let key = "person";
	let value = selectedPerson.options[selectedPerson.selectedIndex].text;
	let dateValue = selected_date_element.textContent;
	let	datekey = "Date";
	let	timeKey = selectedTime.value;
	let	timeValue = selectedTime.options[selectedTime.selectedIndex].text;
    let orderTableKey = "Table";
    let orderTableValue = orderTable;
	if(key && value){
		localStorage.setItem(key, value)
		localStorage.setItem(datekey, dateValue)
		localStorage.setItem(timeKey, timeValue)
		localStorage.setItem(orderTableKey, orderTableValue)
	}
	window.location.assign("profile.html")

});
    
