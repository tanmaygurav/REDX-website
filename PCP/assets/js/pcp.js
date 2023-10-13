const v200 = "https://script.google.com/macros/s/AKfycbw9xdNLGkgYPJJ5eEdnDpYJ3tMYJj5pawthFfceoZ-A6bEH7CEXUje6CpO5uQRyrXodjg/exec?";
const v300 = "https://script.google.com/macros/s/AKfycbzPSXRntXbqVZ-tfmJazl44EkTU8sCsv7xT0wQJKDI_DtQHYqNw2wvBKML_HJjRstcC/exec?";

/* Onpage load triggers */
getUser()
var user
var activefilter = { "domain": "Clear Filter", "program": "Clear Filter", "status": "Clear Filter" }
var searchby = "NA"
if (window.location.pathname == "/PCP/pcpHome.html") {
    getPS()
    loadfilters()
}
if (window.location.pathname == "/PCP/studenthome.html") {
    problemsbyemail()
}
if (window.location.pathname == "/PCP/pcprequest.html") {
    newusers()
}

/* Onpage load triggers */


/* Student Page functions */
async function openAdd() {
    const { value: formValues } = await Swal.fire({
        title: 'New Pain Point',
        html:
            '<p>Title</p>' +
            '<input id="Title" class="swal2-input">' +
            '<p>Description</p>' +
            '<Textarea id="Description" class="swal2-input"></Textarea>' +
            '<p>Solution</p>' +
            '<Textarea id="Solution" class="swal2-input"></Textarea>',
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('Title').value,
                document.getElementById('Description').value,
                document.getElementById('Solution').value,
            ]
        }
    })

    if (formValues) {
        Swal.fire(JSON.stringify(formValues))
    }
}

async function imageUpload() {
    const { value: file } = await Swal.fire({
        title: 'Select image',
        input: 'file',
        inputAttributes: {
            'accept': 'image/*',
            'aria-label': 'Upload your profile picture'
        }
    })

    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            Swal.fire({
                title: 'Your uploaded picture',
                imageUrl: e.target.result,
                imageAlt: 'The uploaded picture'
            })
        }
        reader.readAsDataURL(file)
    }
}

async function problemsbyemail() {
    const home = document.getElementById("problemstatements")
    const user = JSON.parse(sessionStorage.getItem("user"))
    // console.log("user", user.user);
    const email = user.user.email
    home.innerHTML = `<h4>Loading Please Wait...</h4>`

    data = {
        url: v300,
        params: {
            'code': 'email',
            'email': email
        }
    }
    const query = encodeQuery(data)
    // console.log("query", query)
    const res = await fetch(query);
    const PS = await res.json();
    // console.log("res", PS)
    if (res.status != 200) alert("Request returned status code", res.status);
    if (res.status === 200) {
        home.innerHTML = ""
        if (PS.length == 0) home.innerHTML = `<h1>All your Uploaded Pain Points will be displayed here</h1>`
        else {
            PS.forEach(i => {
                let descript
                if (i.description) descript = description
                else {
                    descript = i.d0 + i.d1 + i.d2 + i.d3 + i.d4 + i.d5
                }
                home.innerHTML += `
        <div class="container-fluid m-2 border shadow">
        <div class="row">
            <div class="col-sm border">
                <div class="m-1">${i.uuid}</div>
                <div class="m-1">${i.timestamp}</div>
            </div>
            <div class="col-sm-2 border ">
                <div class="mb-2 text-center">${i.title}</div>
                <div>${i.domain}</div>
            </div>
            <div class="col-sm-6 border text-center">${descript}</div>
            <div class="col-sm-3 border text-center">${i.d6}</div>
        </div>
        </div>
        `
            })
        }

    }
}
/* Student Page functions */

/* get Filters */
async function loadfilters() {
    data = {
        url: v300,
        params: {
            'code': 'getfilters'
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    if (response.status != 200) alert("Request returnde status code", res.status);
    if (response.status === 200) {
        const domainfilter = document.getElementById("domainfilter")
        const programfilter = document.getElementById("programfilter")
        const Statusfilter = document.getElementById("Statusfilter")

        programfilter.innerHTML = ""
        domainfilter.innerHTML = ""
        Statusfilter.innerHTML = ""

        const domainlist = res.domain
        const programlist = res.program
        programfilter.innerHTML = `<li><div class="dropdown-item" onclick=programactive(this)>Clear Filter</div></li>`
        domainfilter.innerHTML = `<li><div class="dropdown-item" onclick=domainactive(this)>Clear Filter</div></li>`

        domainlist.forEach(i => {
            domainfilter.innerHTML += `<li><div class="dropdown-item" onclick=domainactive(this)>${i}</div></li>`
        })

        programlist.forEach(i => {
            programfilter.innerHTML += `<li><div class="dropdown-item" onclick=programactive(this)>${i}</div></li>`
        })

        Statusfilter.innerHTML = `
        <li><div class="dropdown-item" onclick=Statusactive(this)>Clear Filter</div></li>
        <li><div class="dropdown-item" onclick=Statusactive(this)>Solved</div></li>
        <li><div class="dropdown-item" onclick=Statusactive(this)>UnSolved</div></li>
        <li><div class="dropdown-item" onclick=Statusactive(this)>UnMarked</div></li>
        `

    }
}
/* get Filters */
let domainfilteractive = null;
let programfilteractive = null;
let statusfilteractive = null;

function domainactive(div) {
    const filterbtn = document.getElementById("filterdomainbtn")
    if (div.innerText == "Clear Filter") filterbtn.innerText = "Filter by Domain"
    else filterbtn.innerText = div.innerText
    activefilter.domain = div.innerText
    getPS()
}

function programactive(div) {
    const filterbtn = document.getElementById("filterprogrambtn")
    if (div.innerText == "Clear Filter") filterbtn.innerText = "Filter by Program"
    else filterbtn.innerText = div.innerText
    activefilter.program = div.innerText
    getPS()

}

function Statusactive(div) {
    const filterbtn = document.getElementById("Statusfilterbtn")
    if (div.innerText == "Clear Filter") filterbtn.innerText = "Filter by Status"
    else filterbtn.innerText = div.innerText
    var statustmp
    if (div.innerText == "Solved") statustmp = "1"
    else if (div.innerText == "UnSolved") statustmp = "0"
    else if (div.innerText == "UnMarked") statustmp = ""
    else if (div.innerText == "Clear Filter") statustmp = "Clear Filter"
    activefilter.status = statustmp
    getPS()
}


/* Home left pane */
async function getPS() {
    const PSS = document.getElementById("PSS")
    PSS.innerHTML = `<h4>Loading Please Wait...</h4>`
    data = {
        url: v300,
        params: {
            'code': 'readPS'
        }
    }
    const query = encodeQuery(data)
    console.log("query", query)
    const res = await fetch(query);
    const PS = await res.json();
    if (res.status != 200) alert("Request returnde status code", res.status);
    if (res.status === 200) {
        PSS.innerHTML = ""

        PS.forEach(i => {
            let divClass = "btn scrollable-content";
            if (i.tag === "0") {
                divClass = "btn scrollable-content svg-yellow";
            } else if (i.tag === "1") {
                divClass = "btn scrollable-content svg-green";
            }

            if (activefilter.domain == "Clear Filter"
                && activefilter.program == "Clear Filter"
                && activefilter.status == "Clear Filter") applyfilter(i, divClass, 1)

            if (activefilter.domain != "Clear Filter") {
                if (activefilter.status != "Clear Filter") { if (activefilter.domain == i.domain && activefilter.status == i.tag) applyfilter(i, divClass, 2) }
                else { if (activefilter.domain == i.domain) applyfilter(i, divClass, 2) }
            }

            else if (activefilter.program != "Clear Filter") {
                if (activefilter.status != "Clear Filter") { if (activefilter.program == i.program && activefilter.status == i.tag) applyfilter(i, divClass, 3) }
                else { if (activefilter.program == i.program) applyfilter(i, divClass, 3) }
            }

            else if (activefilter.status != "Clear Filter") {
                if (activefilter.status == i.tag) applyfilter(i, divClass, 3)
            }

        });
    }
}

function applyfilter(i, divClass, case1) {
    const PSS = document.getElementById("PSS")
    console.log("case", case1);
    PSS.innerHTML +=
        `<div class="${divClass}" onclick="handleDivClick(this, '${i.uuid}')">
        <div class="title-left">${i.title}</div>
        <div class="domain-left">${i.domain}</div>
    </div>`
}

function searchbyfn(div) {
    searchbybtn = document.getElementById("searchbybtn")
    searchbybtn.innerText = div.innerText
}

async function search() {
    searchbybtn = document.getElementById("searchbybtn")
    searchcat = searchbybtn.innerText
    console.log("searchcat", searchcat)
    // if (!["Search By", "Student ID", "Student Name", "Title"].includes(searchcat)) alert("Please Select a Category in search by dropdown")
    // else {
    var searchtext = document.getElementById("searchtext").value
    console.log("searchtext", searchtext.length);
    // if (searchtext.length < 3) alert("Please enter atleast 3 characters")
    // else {
    const PSS = document.getElementById("PSS")
    PSS.innerHTML = `<h4>Loading Please Wait...</h4>`
    data = {
        url: v300,
        params: {
            'code': 'readPS'
        }
    }
    const query = encodeQuery(data)
    const res = await fetch(query);
    const PS = await res.json();
    if (res.status != 200) alert("Request returnde status code", res.status);
    if (res.status === 200) {
        PSS.innerHTML = ""

        const options = {
            includeScore: true,
            // Search in `author` and in `tags` array
            keys: ['name', 'title', 'std_ID', 'domain', 'tag']
        }

        const fuse = new Fuse(PS, options)


        const searchresult = fuse.search(searchtext)
        console.log("search result", searchresult)
        let sortedres = searchresult.sort(function (a, b) {
            return a.refIndex - b.refIndex
        })

        sortedres.forEach(i => {
            let divClass = "btn scrollable-content";
            if (i.item.tag === "0") {
                divClass = "btn scrollable-content svg-green";
            } else if (i.item.tag === "1") {
                divClass = "btn scrollable-content svg-green";
            }

            PSS.innerHTML +=
                `<div class="${divClass}" onclick="handleDivClick(this, '${i.item.uuid}')">
                <div class="title-left">${i.item.title}</div>
                <div class="domain-left">${i.item.domain}</div>
                </div>`
        });

    }
    // }


    // }

}

/* Home left pane */

/* Home right pane */
async function markstatus(uuid, status) {
    console.log("status", String(uuid));
    data = {
        url: v300,
        params: {
            'code': 'markstatus',
            'uuid': uuid,
            'status': status
        }
    }
    const query = encodeQuery(data)
    console.log("query", query)
    const res = await fetch(query);
    const PS = await res.json();
    console.log("PS", PS);
    if (res.status != 200) alert("Request returnde status code", res.status);
    if (res.status === 200)
        if (PS.error) alert(PS.error)
        else {
            alert(PS.status)
            // refreshDS(uuid)
        }
}

async function refreshDS() {
    const rightpane = document.getElementById("rightpane")
    data = {
        url: v300,
        params: {
            'code': 'readDS',
            'uuid': uuid,
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    if (response.status != 200) alert("Request returnde status code", res.status);
    if (response.status === 200) {

        rightpane.innerHTML = `
        <div class="d-flex justify-content-between">
                <div>
                    <div id="P-title" class="title-right">${res.title}</div>
                    <div id="P-domain" class="domain-right">${res.domain}</div>
                </div>
                <div>
                    <button type="button" class="btn btn-outline-success shadow" onclick=markstatus(${String(res.uuid)},1)>Mark Solved</button>
                    <button type="button" class="btn btn-outline-warning shadow" onclick=markstatus(${String(res.uuid)},0)>Mark Unsolved</button>
                </div>
            </div>
            <div class="d-flex m-2">
                <!-- <div class="d-inline-flex Image-Galary m-1">
                    <div class="big-image"></div>
                </div> -->
                <div class="student-input d-flex justify-content-start">
                    <div class="d-flex flex-column p-2">
                        <div class="title">Description</div>
                        <div class="subtitle">Who is experiencing the problem?</div>
                        <div class="description">${res.d0}</div>
                        <div class="subtitle">What is the problem?</div>
                        <div class="description">${res.d1}</div>
                        <div class="subtitle">Where is the user experiencing the problem?</div>
                        <div class="description">${res.d2}</div>
                        <div class="subtitle">When does the problem present itself to the user?</div>
                        <div class="description">${res.d3}</div>

                        <div class="subtitle">What other activities are the users performing while they experience the problem?</div>
                        <div class="description">${res.d4}</div>

                        <div class="subtitle">Why should this problem be solved? / What is the benefit to the user of solving this problem?</div>
                        <div class="description">${res.d5}</div>

                        <div class="subtitle">Solution</div>
                        <div class="description">${res.d6}</div>
                        <div class="subtitle">Student info <i class="fa-solid fa-circle-info"></i></div>
                    </div>
                </div>
            </div>,
     <div  class="mb-3">
                <label for="remarkedittext" class="form-label title">Remarks</label>
                <textarea class="form-control description" id="remarkedittext" rows="3" ></textarea>
                <div  class="mt-3 mb-3" >
                    
                    <button type="button" class="btn btn-outline-primary shadow remarkbtn"  onclick=saveremark(${String(res.uuid)})>Save</button>
                </div>
                <div id="RemarksSection"></div>
            </div>
        </div>
        `
        getremarks(res.uuid)
    }
}

async function saveremark(uuid) {
    console.log("info", "saveremark clicked");
    var remarkedittext = document.getElementById("remarkedittext")
    var remark = remarkedittext.value
    console.log("uuid", uuid);
    data = {
        url: v300,
        params: {
            'code': 'remark',
            'uuid': uuid,
            'givenby': user.user.name,
            'remark': document.getElementById("remarkedittext").value,
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    if (response.status != 200) alert("Request returnde status code", res.status);
    if (response.status === 200) {
        getremarks(uuid)
    }
}

async function getremarks(uuid) {
    const RemarksSection = document.getElementById("RemarksSection")
    data = {
        url: v300,
        params: {
            'code': 'readremarks',
            'uuid': uuid,
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    if (response.status != 200) alert("Request returnde status code", res.status);
    if (response.status === 200) {
        let sortedres = res.sort(function (a, b) {
            return b.timestamp.localeCompare(a.timestamp)
        })

        RemarksSection.innerHTML = ""

        sortedres.forEach(i => {
            RemarksSection.innerHTML += `
            <div class="card shadow p-2">
                <div class="d-flex flex-row">
                    <div class="title">${i.givenby} : &nbsp </div><div class="title-left"> ${i.remark}</div>
                </div>
            </div>
            `
        })

    }
}
/* Home right pane */

/* Abstraction */
function encodeQuery(data) {
    let query = data.url
    for (let d in data.params)
        query += encodeURIComponent(d) + '='
            + encodeURIComponent(data.params[d]) + '&';
    return query.slice(0, -1)
}

/* left pane div active */
let activeDiv = null;
function handleDivClick(element, id) {
    // console.log("Clicked div with ID:", id);
    displayDS(id)
    if (activeDiv) {
        activeDiv.classList.remove("active");
    }
    element.classList.add("active");
    activeDiv = element;
}

async function displayDS(uuid) {
    const rightpane = document.getElementById("rightpane")
    rightpane.innerHTML = `
    <h4>Loading Please wait...</h4>
    `;
    data = {
        url: v300,
        params: {
            'code': 'readDS',
            'uuid': uuid,
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    if (response.status != 200) alert("Request returnde status code", res.status);
    if (response.status === 200) {

        rightpane.innerHTML = `
        <div class="d-flex justify-content-between">
                <div>
                    <div id="P-title" class="title-right">${res.title}</div>
                    <div id="P-domain" class="domain-right">${res.domain}</div>
                </div>
                <div>
                    <button id="solvedbtn" type="button" class="btn btn-outline-success shadow" onclick=markstatus(${String(res.uuid)},1)>Mark Solved</button>
                    <button id="unsolvedbtn" type="button" class="btn btn-outline-warning shadow" onclick=markstatus(${String(res.uuid)},0)>Mark Unsolved</button>
                </div>
            </div>
            <div class="d-flex m-2">
                <!-- <div class="d-inline-flex Image-Galary m-1">
                    <div class="big-image"></div>
                </div> -->
                <div class="student-input d-flex justify-content-start">
                    <div class="d-flex flex-column p-2">
                        <div class="title">Description</div>
                        <div class="subtitle">Who is experiencing the problem?</div>
                        <div class="description">${res.d0}</div>
                        <div class="subtitle">What is the problem?</div>
                        <div class="description">${res.d1}</div>
                        <div class="subtitle">Where is the user experiencing the problem?</div>
                        <div class="description">${res.d2}</div>
                        <div class="subtitle">When does the problem present itself to the user?</div>
                        <div class="description">${res.d3}</div>

                        <div class="subtitle">What other activities are the users performing while they experience the problem?</div>
                        <div class="description">${res.d4}</div>

                        <div class="subtitle">Why should this problem be solved? / What is the benefit to the user of solving this problem?</div>
                        <div class="description">${res.d5}</div>

                        <div class="subtitle">Possible Solution</div>
                        <div class="description">${res.d6}</div>
                        <div class="subtitle">Student info</div>
                        <div class="description">Name: ${res.name}</div>
                        <div class="description">Student ID: ${res.std_ID}</div>
                        <div class="description">Program: ${res.program}</div>
                        <div class="description">Email: ${res.email}</div>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="remarkedittext" class="form-label title">Remarks</label>
                <textarea class="form-control description" id="remarkedittext" rows="3" ></textarea>
                <div class="mt-3 mb-3">
                    
                    <button type="button" class="btn btn-outline-primary shadow remarkbtn"  onclick=saveremark(${String(res.uuid)})>Save</button>
                </div>
                <div id="RemarksSection"></div>
            </div>
        </div>
        `
        getremarks(res.uuid)

        const tag = res.tag
        if (tag == 1) {
            var btnsol = document.getElementById("solvedbtn")
            btnsol.classList.add("active")
        }
        if (tag == 0) {
            var btnsol = document.getElementById("unsolvedbtn")
            btnsol.classList.add("active")
        }
    }


}

function accessrequests() {
    if (user) {
        if (user.user.access_status == "ADMIN") {
            // alert("Under Development")
            // alert("Redirected")
            window.location.href = "/PCP/pcprequest.html"
        } else {
            alert("Access Denied")
            console.log("user", user)
        }
    } else { alert("user not found") }
}

function getUser() {
    user = JSON.parse(sessionStorage.getItem("user"))

    if (user) {
        var displayName = document.getElementById("profile-name")
        displayName.innerText = user.user.name

    } else {
        alert("Could not fetch user, Please try Logining IN again or use a different browser")
        window.location = "/PCP/pcpauth.html"
    }
}

function logout() {
    sessionStorage.removeItem("user")
    window.location = "/PCP/pcpauth.html"

}


async function newusers() {
    const newuser = document.getElementById("newusers")
    newuser.innerHTML = `<h4>Loading Please Wait...</h4>`

    data = {
        url: v300,
        params: {
            'code': 'getnewusers'
        }
    }
    const query = encodeQuery(data)
    // console.log("query", query)
    const res = await fetch(query);
    const PS = await res.json();
    if (res.status != 200) alert("Request returned status code", res.status);
    if (res.status === 200) {
        if (PS.error) Swal.fire("An Error Occured", PS.error, "error")
        else {

            newuser.innerHTML = ""
            if (PS.length == 0) newuser.innerHTML = `<h1>No new request</h1>`
            else {
                PS.forEach(i => {
                    newuser.innerHTML += `
            <div class="card m-3 shadow">
                    <div class="card-body">
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <div>
                            <div>UserID: ${i.uuid}</div>
                            <div>Name:  ${i.name} </div>
                            <div>Email:  ${i.email} </div>
                            <div>Program:  ${i.program} </div>
                            <div>Student Id/ Roll no. :  ${i.stdid} </div>
                            </div>
                            <div class="justify-center ">
                                <div class="btn btn-outline-success btn-green d-flex flex-row m-2">Accept</div>
                                <div class="btn btn-outline-danger btn-light d-flex flex-row m-2">Reject</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `
                })
            }
        }

    }
}
/* Abstraction */
/* Notes
Tags
null = unmarked
1= interesting
0= not interesting

Access
0 no
10 yes
*/
