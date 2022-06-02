let seatSelect = document.getElementsByClassName("seat");
let personNum = document.getElementById("person").value;
let seat = 0;
// console.log("Person", personNum.value);
for(let i=0; i<seatSelect.length; i++){
    seatSelect[i].addEventListener("click", (e)=>{
        // seat +=2;
        if(seat<1){
            seat++;
            seatSelect[i].classList.toggle("active");
            console.log(seatSelect[i].classList[1]);
            if(seatSelect[i].classList[1]){
            }
            else{
                seat=seat-2;
                console.log("hey");
                console.log("seat haslaa", seat);
            }
        } else{if(seatSelect[i].classList[1]){
                seat--;
                seatSelect[i].classList.toggle("active");
                console.log("Hey active haslaa", seat);

            }else
            alert("Та 2 ширээ захилах гэж байна.");
        }
        console.log("seat", seat);
    });
    }