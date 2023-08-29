const v200 = "https://script.google.com/macros/s/AKfycbw9xdNLGkgYPJJ5eEdnDpYJ3tMYJj5pawthFfceoZ-A6bEH7CEXUje6CpO5uQRyrXodjg/exec?";
// const crypto = require()
/* Onpage load triggers */
getUser()
var user
var activefilter = { "domain": "Clear Filter", "program": "Clear Filter", "status": "Clear Filter" }
if (window.location.pathname == "/PCP/pcpHome.html") {
    getPS()
    loadfilters()
}

/* Onpage load triggers */
function getUser() {
    user = JSON.parse(sessionStorage.getItem("user"))
    // console.log("user", user.user);
    if (user) {
        var displayName = document.getElementById("profile-name")
        displayName.innerText = user.user.name

    } else {
        alert("Could not fetch user, Please try Logining IN again or use a different browser")
        window.location = "http://127.0.0.1:5500/pcpauth.html"
        // window.location="redx.welingkar.org/pcpauth.html"
    }
}

function logout() {
    sessionStorage.removeItem("user")
    window.location = "/PCP/pcpauth.html"
    // window.location="redx.welingkar.org/pcpauth.html"
}

/* get Filters */
async function loadfilters() {
    data = {
        url: v200,
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
        url: v200,
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

/* Home left pane */

/* Home right pane */
async function markstatus(uuid, status) {
    console.log("status", String(uuid));
    data = {
        url: v200,
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
        url: v200,
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

                        <div class="subtitle">Possible Solution</div>
                        <div class="description">${res.d6}</div>
                    </div>
                </div>
            </div>
            <div  class="mb-3">
                <label for="remarkedittext" class="form-label title">Remarks</label>
                <textarea class="form-control description" id="remarkedittext" rows="3" disabled=true>Under Development</textarea>
                <div  class="mt-3 mb-3" >
                    <button type="button" class="btn btn-outline-primary shadow remarkbtn" disabled=true>Edit</button>
                    <button type="button" class="btn btn-outline-primary shadow remarkbtn" disabled=true onclick=saveremark(${String(res.uuid)})>Save</button>
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
        url: v200,
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
        url: v200,
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
        console.log("before sort remarks", res);

        res.sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); })
        console.log("after sort remarks", res);

        RemarksSection.innerHTML = ""

        res.forEach(i => {
            RemarksSection.innerHTML += `
            <div class="card shadow p-2">
                <div class="d-flex flex-row">
                    <div class="title">${i.givenby} : &nbsp </div><div class="title-left"> ${i.remark}</div>
                </div>
            <div class="description" style="font-size:8px">${i.timestamp}</div>
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
    displayPS(id)
    if (activeDiv) {
        activeDiv.classList.remove("active");
    }
    element.classList.add("active");
    activeDiv = element;
}

async function displayPS(uuid) {
    const rightpane = document.getElementById("rightpane")
    rightpane.innerHTML = `
    <h4>Loading Please wait...</h4>
    `;
    data = {
        url: v200,
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
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="remarkedittext" class="form-label title">Remarks</label>
                <textarea class="form-control description" id="remarkedittext" rows="3" disabled=true>Under Development</textarea>
                <div class="mt-3 mb-3">
                    <button type="button" class="btn btn-outline-primary shadow remarkbtn" disabled=true>Edit</button>
                    <button type="button" class="btn btn-outline-primary shadow remarkbtn" disabled=true onclick=saveremark(${String(res.uuid)})>Save</button>
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
        if (user.user.acces_status == "ADMIN") {
            alert("Under Development")
            // alert("Redirected")
            // window.location = "/PCP/pcprequest.html"
        } else {
            alert("Access Denied")
            console.log("user", user)
        }
    } else { alert("user not found") }
}

/* Abstraction */
