class Employee {
    constructor(firstname, lastname, age, profession, address, sex) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
        this.profession = profession;
        this.address = address;
        this.sex = sex;
    }
}

class Department extends Employee {
    constructor(firstname, lastname, age, profession, address, sex, department) {
        super(firstname, lastname, age, profession, address, sex);
        this.department = department;
    }

    employed(callback) {
        let workers = localStorage.getItem("workers") ? JSON.parse(localStorage.getItem("workers")) : null;
        if(workers) {
            let doExist = false;
            workers.forEach(worker => {
                if((worker.firstname.toLowerCase() == this.firstname.toLowerCase()) && (worker.lastname.toLowerCase() == this.lastname.toLowerCase())) {
                    doExist = true;
                }
            })
            if(doExist) {
                return callback("Worker is already employed");
            }
            workers.push({
                firstname: this.firstname,
                lastname: this.lastname,
                age: this.age,
                address: this.address,
                profession: this.profession,
                sex: this.sex,
                department: this.department
            });
        }else {
            workers = [{
                firstname: this.firstname,
                lastname: this.lastname,
                age: this.age,
                address: this.address,
                profession: this.profession,
                sex: this.sex,
                department: this.department
            }];
        }
        localStorage.setItem("workers", JSON.stringify(workers));
        return callback(null, "Worker saved");
    }

    static jobDescription(firstname, lastname) {
        let workers = JSON.parse(localStorage.getItem("workers"));
        let worker = workers.filter(worker => {
            return (worker.firstname == firstname && worker.lastname == lastname);
        });
        alert(`I work at the ${worker[0].department} department`);
    }

    static sacked(match, callback) {
        this.findOne(match, (err, worker) => {
            if(err) {
                return callback(err);
            }
            let workers = localStorage.getItem("workers") ? JSON.parse(localStorage.getItem("workers")) : null;
            for(let i = 0; i < workers.length; i++) {
                if((workers[i].firstname == worker.firstname) && (workers[i].lastname == worker.lastname) && (workers[i].department == worker.department)) {
                    workers.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("workers", JSON.stringify(workers));
            return callback(null, "Worker sacked");
        });
    }

    static findOne(match, callback) {
        if(typeof match != "object") {
            throw new Error("Worker identity must be an object");
        }else {
            let workers = localStorage.getItem("workers") ? JSON.parse(localStorage.getItem("workers")) : null;
            if(!workers) {
                return callback("No workers in database");
            }
            for(let i = 0; i < workers.length; i++) {
                let isFound = false;
                for(let j = 0; j < Object.keys(match).length; j++) {
                    if(workers[i].hasOwnProperty(Object.keys(match)[j])) {
                        if(workers[i][Object.keys(match)[j]] == match[Object.keys(match)[j]]) {
                            isFound = true;
                        }else {
                            isFound = false;
                        }
                    }else {
                        throw new Error(`Invalid object key ${Object.keys(match)[j]}`);
                    }
                }
                if(isFound) {
                    return callback(null, workers[i]);
                }else {
                    return callback("No worker found");
                }
            }
        }
    }

    static find(match = null, callback) {
        let workers = localStorage.getItem("workers") ? JSON.parse(localStorage.getItem("workers")) : null;
        if(match && Object.keys(match).length > 0) {
            if(typeof match != "object") {
                throw new Error("Worker identity must be an object");
            }else {
                let filteredWorkers = [];
                if(!workers) {
                    return callback("No workers in database");
                }
                for(let i = 0; i < workers.length; i++) {
                    let isFound = false;
                    for(let j = 0; j < Object.keys(match).length; j++) {
                        if(workers[i].hasOwnProperty(Object.keys(match)[j])) {
                            if(workers[i][Object.keys(match)[j]] == match[Object.keys(match)[j]]) {
                                isFound = true;
                            }else {
                                isFound = false;
                            }
                        }else {
                            throw new Error(`Invalid object key ${Object.keys(match)[j]}`);
                        }
                    }
                    if(isFound) {
                        filteredWorkers.push(workers[i]);
                    }
                }
                if(filteredWorkers.length < 1) {
                    return callback("No workers found");
                }
                callback(null, filteredWorkers);
            }
        }else {
            callback(null, workers);
        }        
    }
}