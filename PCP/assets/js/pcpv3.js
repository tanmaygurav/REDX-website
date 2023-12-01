const v200 = "https://script.google.com/macros/s/AKfycbw9xdNLGkgYPJJ5eEdnDpYJ3tMYJj5pawthFfceoZ-A6bEH7CEXUje6CpO5uQRyrXodjg/exec?";
const v300 = "https://script.google.com/macros/s/AKfycbzPSXRntXbqVZ-tfmJazl44EkTU8sCsv7xT0wQJKDI_DtQHYqNw2wvBKML_HJjRstcC/exec?";

/* Onpage load triggers */

var activefilter = { "domain": "Clear Filter", "program": "Clear Filter", "status": "Clear Filter" }
var searchby = "NA"
var medialist = []
if (window.location.pathname == "/PCP/pcpHome.html") {
    getuser()
    getPS()
    loadfilters()
}
if (window.location.pathname == "/PCP/homev3.html") {
    problemsbyemail()
    getactivedomains()
}
if (window.location.pathname == "/PCP/pcprequest.html") {
    newusers()
}

function getuser() {
    const user = sessionStorage.getItem('user')
    if (user) {
        // TODO: set profile name 
        document.getElementById('profile-name').innerText = JSON.parse(user).user.name
    } else {
        // TODO: alert and redirect to Auth
        alert("Session expired, please login")
        window.location = ("/PCP/pcpauth.html")
    }
}

/* Onpage load triggers */


/* Student Page functions */
const form = document.getElementById('ppform');
function ppformsubmit() {
    console.log("Submit clicked");
    const user = JSON.parse(sessionStorage.getItem("user"))
    var domain = document.getElementById("ActiveDomainbtn").innerText
    var title = document.getElementById("PSTitle").value
    var description = document.getElementById("PSDescription").value
    var solution = document.getElementById("PSSolution").value
    var media = JSON.stringify(medialist)
    if (PSformval(user, domain, title, description)) {
        console.log("Submitted");
        submitpp(user, domain, title, description, media, solution)
    }
}

async function submitpp(user, domain, title, description, media, solution) {
    data = {
        url: v300,
        params: {
            'code': 'addpp',
            'email': user.user.email,
            'name': user.user.name,
            'stdID': user.user.roll_id,
            'program': user.user.program,
            'domain': domain,
            'title': title,
            'description': description,
            'media': media,
            'solution': solution,
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    if (res.status == "SUCCESS") {
        Swal.fire("Success", "Pain Point has been submitted", "success")
        window.location.reload()
    }
    else Swal.fire("Upload failed", res.message, "error")
}


function PSformval(user, domain, title, description) {
    if (user == "") {
        console.log("no user");
        Swal.fire("user not found please login and try again", "", "error")
        return false
    }
    if (domain == "Select Domain") {
        console.log("no domain");
        Swal.fire("Please select domain", "", "info")
        return false
    }

    if (title.length <= 0) {
        console.log("no title");
        Swal.fire("Please Enter Title", "", "info")
        return false
    }
    if (description.length <= 0) {
        console.log("no description");
        Swal.fire("Please Enter Description", "", "info")
        return false
    }
    return true
}

function adduploadbtn() {
    const media = document.getElementById("Media")

    console.log("media", media.children.length);
    var count = 0 + media.children.length
    media.innerHTML += `
    
        <div class="input-group" id="uploadgroup${count}">
            <input name="file" id="uploadfile${count}" type="file" class="form-control">
            <div id="submit" class="btn btn-outline-secondary" onclick="upload(${count})" text="Upload">Upload</div>
        </div>
    
    `
}

async function upload(count) {
    const file = document.getElementById(`uploadfile${count}`);

    const fr = new FileReader();
    fr.readAsArrayBuffer(file.files[0]);
    fr.onload = f => {
        loading(count)
        const url = "https://script.google.com/macros/s/AKfycbw9xdNLGkgYPJJ5eEdnDpYJ3tMYJj5pawthFfceoZ-A6bEH7CEXUje6CpO5uQRyrXodjg/exec";  // <--- Please set the URL of Web Apps.
        // https://script.google.com/macros/s/AKfycbw9xdNLGkgYPJJ5eEdnDpYJ3tMYJj5pawthFfceoZ-A6bEH7CEXUje6CpO5uQRyrXodjg/exec?
        const qs = new URLSearchParams({ filename: file.files[0].name, mimeType: file.files[0].type });
        fetch(`${url}?${qs}`, {
            method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)]), redirect: 'follow', headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        })
            .then(res => res.json())
            .then(e => checkresult(e, count))  // <--- You can retrieve the returned value here.
            .catch(err => handlerror("upload", err));
    }
}


function loading(count) {
    const file = document.getElementById(`uploadgroup${count}`);
    document.getElementById(`submitbtn`).setAttribute("disabled", "disabled");
    file.innerHTML =
        `
    <div class="loader"></div>
    `
}

function checkresult(result, count) {
    document.getElementById(`uploadgroup${count}`).innerHTML = '';
    if (result.fileUrl) {
        medialist.push(result)
        // sessionStorage.setItem("medialist",JSON.stringify(medialist))
        displayuploads()
        document.getElementById(`submitbtn`).removeAttribute("disabled");
    } else {
        file.innerHTML =
            `
    <div>${result}</div>
    `
    }
}

function displayuploads() {
    const files = document.getElementById(`Media`);
    medialist.forEach(i => {
        files.innerHTML += `
        <div class="input-group mb-3">
            <span  class="form-control"><a href="${i.fileUrl}" target="_blank">${i.filename}</a></span>
            <button class="btn btn-outline-secondary" type="button" onclick="deletefile('${i.fileId}')"><img class="del"
                    src="./assets/img/delete.png" alt="delete" srcset=""></button>
        </div>
        `
    })
}

async function deletefile(fileId) {
    data = {
        url: v300,
        params: {
            'code': 'deleteFile',
            'fileId': fileId
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    setactivedomains(res)
}

function getcurrentfilesinsession() {
    try {
        return sessionStorage.getItem('currentfilesinsession')
    } catch (error) {

    }
}

function openAdd() {
    document.getElementById("uploadform").style.display = "block";
    document.getElementById("uploadformbg").style.display = "block";
}
function closeAdd() {
    document.getElementById("uploadform").style.display = "none";
    document.getElementById("uploadformbg").style.display = "none";
}

function handlerror(fn, error) {
    console.error(fn, error);
    Swal.fire("Error while uploading", error, "error")
}

async function getactivedomains() {
    data = {
        url: v300,
        params: {
            'code': 'getactivedomains',
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    if (response.status != 200) alert("Request returned status code", response.status);
    if (response.status === 200) {
        setactivedomains(res)
    }
    // TODO: error handling
}

function setactivedomains(res) {
    const ActiveDomain = document.getElementById("ActiveDomain")
    ActiveDomain.innerHTML = ""
    const domainlist = res.domain
    domainlist.forEach(i => {
        ActiveDomain.innerHTML += `<li><div class="dropdown-item" onclick=selectdomain(this)>${i}</div></li>`
    })
}

function selectdomain(item) {
    const ActiveDomainbtn = document.getElementById("ActiveDomainbtn")
    ActiveDomainbtn.innerText = item.innerText
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    // Months array to convert numeric month to string
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Get day, month, year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Get hours and minutes
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);

    // AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;

    // Format the string
    const formattedDate = `${day}/${month}/${year}; ${hours}:${minutes} ${ampm}`;

    return formattedDate;
}

async function tag(item) {

    const checkboxId = `check-${item.value}`;
    const spinId = `spin-${item.value}`;

    const checkbox = document.getElementById(checkboxId);
    const spin = document.getElementById(spinId)

    if (spin.style.display === 'none') {
        spin.style.display = 'block';
        checkbox.style.display = 'none';
    }

    // Convert false to empty string
    const statusValue = item.checked ? item.checked : '';

    console.log(statusValue);
    console.log(item.value)

    data = {
        url: v300,
        params: {
            code: "markstatus",
            uuid: item.value,
            status: statusValue,
        },
    };
    const query = encodeQuery(data);
    const response = await fetch(query);
    const res = await response.json();
    if (spin.style.display === 'block') {
        spin.style.display = 'none';
        checkbox.style.display = 'block';
    }
    console.log("res", res);
    if (response.status != 200) alert("Request returned status code", res.status);
    if (response.status === 200) {
        // list.innerHTML = "";
        console.log(res.status);
        if (res.status === "SUCCESS") {
            if (item.checked === true) {
                document.getElementById(checkboxId).checked = true;
            } else if (item.checked === false) {
                document.getElementById(checkboxId).checked = false;
            } else {
                console.error();
            }
        }
    }
}


async function problemsbyemail() {
    const list = document.getElementById("PSList");
    list.innerHTML = `<h4>Loading Please wait...</h4>`;
    const user = JSON.parse(sessionStorage.getItem("user"))
    // console.log("user", user.user);
    const email = user.user.email

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
        list.innerHTML = ""
        if (PS.length == 0) list.innerHTML = `<h1>All your Uploaded Pain Points will be displayed here</h1>`
        else {
            PS.forEach(i => {
                const checkboxId = `check-${i.uuid}`;
                const spinId = `spin-${i.uuid}`

                const formattedDate = formatTimestamp(`${i.timestamp}`);

                // console.log(`${i.timestamp}`)
                // console.log(formattedDate)

                if (!i.tag) {
                    list.innerHTML += `
                <div id="${i.uuid}" class="flex-container">
                    <div class="row-tick">
                        <input onclick="tag(this)" id="${checkboxId}" type="checkbox" value="${i.uuid}" style="display: block;">
                        <div class="loader" id="${spinId}" style="display: none;"></div>
                    </div>
                    <div class="row-title-bg">
                        <div class="row-title-ps-title">
                            ${i.title}
                        </div>
                        <div class="row-title-ps-domain">
                            ${i.domain}
                        </div>
                        <div class="row-title-ps-number">
                            ${i.uuid}
                            <div class="row-title-ps-time">${formattedDate}</div>
                        </div>
                    </div>
                    <div class="row-desc-bg">
                        <div class="row-desc-ps-desc">
                            ${i.description}
                        </div>
                    </div>
                    <div class="row-sol-bg">
                        <div class="row-sol-ps-sol">
                            ${i.solution}
                        </div>
                    </div>
                    <div class="row-img-bg">
                        <div class="row-img-flex">
                            <div class="row-img-view-picture-icon"></div>
                            <div class="row-img-info-icon"></div>
                            <div class="row-img-add-comment-icon"></div>
                        </div>
                        <div class="row-img-font">
                            View More
                        </div>
                    </div>
                </div>
                `;
                } else if (i.tag === "true") {
                    list.innerHTML += `
                <div id="${i.uuid}" class="flex-container">
                    <div class="row-tick">
                        <input onclick="tag(this)" id="${checkboxId}" type="checkbox" value="${i.uuid}" style="display: block;" checked>
                        <div class="loader" id="${spinId}" style="display: none;"></div>
                    </div>
                    <div class="row-title-bg">
                        <div class="row-title-ps-title">
                            ${i.title}
                        </div>
                        <div class="row-title-ps-domain">
                            ${i.domain}
                        </div>
                        <div class="row-title-ps-number">
                            ${i.uuid}
                            <div class="row-title-ps-time">${formattedDate}</div>
                        </div>
                    </div>
                    <div class="row-desc-bg">
                        <div class="row-desc-ps-desc">
                            ${i.description}
                        </div>
                    </div>
                    <div class="row-sol-bg">
                        <div class="row-sol-ps-sol">
                            ${i.solution}
                        </div>
                    </div>
                    <div class="row-img-bg">
                        <div class="row-img-flex">
                            <div class="row-img-view-picture-icon"></div>
                            <div class="row-img-info-icon"></div>
                            <div class="row-img-add-comment-icon"></div>
                        </div>
                        <div class="row-img-font">
                            View More
                        </div>
                    </div>
                </div>
                `
                } else {
                }
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
                                <div class="btn btn-outline-success btn-green d-flex flex-row m-2" onclick="handlerequest(this)" id="${i.uuid}">Accept</div>
                                <div class="btn btn-outline-danger btn-light d-flex flex-row m-2" onclick="handlerequest(this)" id="${i.uuid}">Reject</div>
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

async function handlerequest(btn) {
    swal.fire("Please wait")
    const status = btn.innerText
    const userID = btn.id
    let code = "rejectaccess"
    console.log("status", status);

    if (status == "Accept") code = "grantaccess";
    data = {
        url: v300,
        params: {
            'code': code,
            'uuid': userID
        }
    }
    const query = encodeQuery(data)
    // console.log("query", query)
    const res = await fetch(query);
    const PS = await res.json();
    if (res.status != 200) alert("Request returned status code", res.status);
    if (res.status === 200) {
        if (PS.error) Swal.fire("An Error Occured", PS.error, "error")
        else { newusers() }
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
