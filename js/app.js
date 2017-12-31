function getJobDescription(firstname, lastname) {
    Department.jobDescription(firstname, lastname);
}

function sack(firstname, lastname) {
    Department.sacked({firstname, lastname}, (err, response) => {
        if(err) {
            return alert(err);
        }
        alert(response);
        window.location.reload();
    })
}

window.addEventListener("load", e => {
    let workersArea = document.querySelector("#workers table tbody");
    Department.find({}, (err, workers) => {
        if(err) {
            return console.log(err);
        }
        if(!workers || workers.length < 1) {
            return workersArea.innerHTML = `<td colspan=6>No worker found</td>`;
        }
        
        workers.forEach(worker => {
            workersArea.innerHTML += `<tr>
                <td>${worker.firstname} ${worker.lastname}</td>
                <td>${worker.age}</td>
                <td>${worker.sex}</td>
                <td>${worker.address}</td>
                <td>${worker.profession}</td>
                <td>${worker.department}</td>
                <td><a class="button button-primary" onclick=getJobDescription('${worker.firstname}','${worker.lastname}')>Job Description</a><button onclick=sack('${worker.firstname}','${worker.lastname}')>Sack</button></td>
            </tr>`;
        });
    });
});
let newForm = document.querySelector("#form form");
newForm.addEventListener("submit", (e) => {
    document.querySelector("div.info").innerHTML = "";
    e.preventDefault();
    let firstname = getValues("firstname"),
        lastname = getValues("lastname"),
        age = getValues("age"),
        profession = getValues("profession"),
        address = getValues("address"),
        department = getValues("department"),
        sex = document.querySelector(`input[type='radio']:checked`).value;
    if(!sex || firstname == "" || lastname == "" || age == "" || profession == "" || address == "" || department == "") {
        document.querySelector("div.info").innerHTML = "All fields are required";
    }else {
        let worker = new Department(firstname, lastname, age, profession, address, sex, department);
        worker.employed((err, response) => {
            if(err) {
                return document.querySelector("div.info").innerHTML = err;
            }
            document.querySelector("div.info").innerHTML = response;
            newForm.reset();
            window.location.reload();
        })
    }
});

function getValues(id) {
    return document.querySelector(`#${id}`).value;
}