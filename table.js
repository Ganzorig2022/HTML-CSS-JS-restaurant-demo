let seatSelect = document.getElementsByClassName("seat");
let seat1Select = document.getElementsByClassName("seat1");
let seat2Select = document.getElementsByClassName("seat2");
let personNum = document.getElementById("person").value;
let option = document.getElementsByClassName("option")
let timeValue = document.getElementsByClassName("timeValue")

// const selected_date_element = document.querySelector('.date-picker .selected-date');

//LocalStore
for(let i=0; i<option.length; i++){
    if(option[i].textContent === localStorage.person){
        console.log("Tentsuu bns")
        // option[i].options.[selected]
        option[i].setAttribute("selected", "");
    }
}
selected_date_element.textContent = localStorage.Date;
for(let i=0; i<timeValue.length; i++){
    console.log("Tentsuu bnaaaaaa", timeValue[i])

    if(timeValue[i].textContent === localStorage.timeValue){
        console.log("Tentsuu bnaaaaaa")
        timeValue[i].setAttribute("selected", "");
    }
}



let seat = 0;
for(let i=0; i<seatSelect.length; i++){
    seatSelect[i].addEventListener("click", (e)=>{
        // seat +=2;
        let seatCount = seatSelect[i].firstElementChild.value;
        let personNum = document.getElementById("person").value;
        if(seatCount>=personNum){
            console.log("ALDAA");
            if(seat<1){
                seat++;
                seatSelect[i].classList.toggle("active");
                if(seatSelect[i].classList[1]){
                }
                else{
                    seat=seat-2;
                }
            } else{if(seatSelect[i].classList[1]){
                    seat--;
                    seatSelect[i].classList.toggle("active");
                }else
                alert("Та 2 ширээ захилах гэж байна.");
            }
        } else {
            swal(`${personNum} deesh suudaltai shiree zahialna uu`);
        }
        
        console.log("seat", seat);
    });
    }
    console.log("seat1Select[i].childElementCount",seat1Select[1].firstElementChild.value);

    for(let i=0; i<seat1Select.length; i++){
        seat1Select[i].addEventListener("click", (e)=>{
            // seat +=2;
            let seatCount = seat1Select[i].firstElementChild.value;

            let personNum = document.getElementById("person").value;
            console.log("seatCount",seatCount);

            if(seatCount>=personNum){
                console.log("ALDAA");
                if(seat<1){
                    seat++;
                    seat1Select[i].classList.toggle("active");
                    if(seat1Select[i].classList[1]){
                    }
                    else{
                        seat=seat-2;
                    }
                } else{if(seat1Select[i].classList[1]){
                        seat--;
                        seat1Select[i].classList.toggle("active");
                    }else
                    swal("Та 2 ширээ захилах гэж байна.");
                }
            } else {
                swal(`${personNum} deesh suudaltai shiree zahialna uu`);
            }
            
            console.log("seat", seat);
        });
        }




        for(let i=0; i<seat2Select.length; i++){
            seat2Select[i].addEventListener("click", (e)=>{
                // seat +=2;
                let seatCount = seat2Select[i].firstElementChild.value;
                let personNum = document.getElementById("person").value;
                console.log("seatCount",seatCount);

                if(seatCount>=personNum){
                    console.log("ALDAA");
                    if(seat<1){
                        seat++;
                        seat2Select[i].classList.toggle("active");
                        if(seat2Select[i].classList[1]){
                        }
                        else{
                            seat=seat-2;
                        }
                    } else{if(seat2Select[i].classList[1]){
                            seat--;
                            seat2Select[i].classList.toggle("active");
                        }else
                        alert("Та 2 ширээ захилах гэж байна.");
                    }
                } else {
                    alert(`${personNum} deesh suudaltai shiree zahialna uu`);
                }
                
                console.log("seat", seat);
            });
            }