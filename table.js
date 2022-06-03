let seatSelect = document.getElementsByClassName("seat");
let seat1Select = document.getElementsByClassName("seat1");
let seat2Select = document.getElementsByClassName("seat2");

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
            alert(`${personNum} deesh suudaltai shiree zahialna uu`);
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
                    alert("Та 2 ширээ захилах гэж байна.");
                }
            } else {
                alert(`${personNum} deesh suudaltai shiree zahialna uu`);
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