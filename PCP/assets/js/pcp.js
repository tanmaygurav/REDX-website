const v300 = "https://script.google.com/macros/s/AKfycbzPSXRntXbqVZ-tfmJazl44EkTU8sCsv7xT0wQJKDI_DtQHYqNw2wvBKML_HJjRstcC/exec?";

/* Global states */

var activefilter = { "domain": "Clear Filter", "program": "Clear Filter", "status": "Clear Filter" }
var searchby = "NA"
var medialist = []
var compactview = true
var GPP = []            //all enteries
var filteredPP = []     //filtered all enteries
var filters = []


/* Global states */

/* Onpage load triggers */
function onloadfacultyhome() {
    // TODO: getpp displaypp
    verifyuser()
    getPP()
    getfilters()
}
function onloadstudenthome() {
    // TODO: getpp displaypp
}
function onloadrequests() {
    // TODO: getpp displaypp
}
/* Onpage load triggers */

/* Get from DB */
async function getPP() {
    data = {
        url: v300,
        params: {
            'code': 'readall'
        }
    }
    const query = encodeQuery(data)
    // console.log("query", query)
    const res = await fetch(query);
    const PS = await res.json();
    if (res.status != 200) alert("Request returnde status code", res.status);
    if (res.status === 200) {
        GPP = PS
        renderpp()
        console.log("getPP GPP", GPP);
    }
}

async function getfilters() {
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
        filters = res
        renderfilters()
    }
}

/* Get from DB */

/* Send to DB */
async function tag(item) {

    const checkboxId = `check-${item.value}`;
    const spinId = `spin-${item.value}`;

    const checkbox = document.getElementById(checkboxId);
    const spin = document.getElementById(spinId)

    if (spin.style.display === 'none') {
        spin.style.display = 'block';
        checkbox.style.display = 'none';
    }

    console.log(item.checked);
    console.log(item.value)

    data = {
        url: v300,
        params: {
            code: "markstatus",
            uuid: item.value,
            status: item.checked,
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
/* Send to DB */

/* show on page functions */
function renderfilters() {
    const domainfilter = document.getElementById("domainfilter")
    const programfilter = document.getElementById("programfilter")
    const Statusfilter = document.getElementById("Statusfilter")

    programfilter.innerHTML = ""
    domainfilter.innerHTML = ""
    Statusfilter.innerHTML = ""

    const domainlist = filters.domain
    const programlist = filters.program
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
    <li><div class="dropdown-item" onclick=Statusactive(this)>Tagged</div></li>
    <li><div class="dropdown-item" onclick=Statusactive(this)>unTagged</div></li>
    `

}

function renderpp() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    console.log(user);
    if (user.access_status == "ADMIN" || user.access_status == "FACULTY") renderfacultypp()
    if (user.access_status == "STUDENT") renderstudentpp()
}

function renderfacultypp() {
    const PSlist = document.getElementById("PSList");
    PSlist.innerHTML = ""
    if (filteredPP.length <= 0) {
        filteredPP = GPP
    }
    console.log("filteredPP", filteredPP.length);
    filteredPP.forEach((i) => {
        const checkboxId = `check-${i.uuid}`;
        const spinId = `spin-${i.uuid}`;
        const formattedDate = formatTimestamp(`${i.timestamp}`);

        if (!i.tag) {
            PSlist.innerHTML += `
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
            PSlist.innerHTML += `
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
                `;
        } else {
        }
    });
}

function renderstudentpp() {
console.log("renderstudent");
}
/* show on page functions */

/* Active filters */
let domainfilteractive = null;
let programfilteractive = null;
let statusfilteractive = null;

function domainactive(div) {
    const filterbtn = document.getElementById("domainfilterbtn")
    if (div.innerText == "Clear Filter") filterbtn.innerText = "Filter by Domain"
    else filterbtn.innerText = div.innerText
    activefilter.domain = div.innerText
    applyfilter()
}

function programactive(div) {
    const filterbtn = document.getElementById("programfilterbtn")
    if (div.innerText == "Clear Filter") filterbtn.innerText = "Filter by Program"
    else filterbtn.innerText = div.innerText
    activefilter.program = div.innerText
    console.log("program innertext", div.innerText);
    console.log("program activefilter", activefilter);
    applyfilter()

}

function Statusactive(div) {
    const filterbtn = document.getElementById("Statusfilterbtn")
    if (div.innerText == "Clear Filter") filterbtn.innerText = "Filter by Status"
    else filterbtn.innerText = div.innerText
    var statustmp
    if (div.innerText == "Tagged") statustmp = "true"
    else if (div.innerText == "unTagged") statustmp = ""
    else if (div.innerText == "Clear Filter") statustmp = "Clear Filter"
    activefilter.status = statustmp
    applyfilter()
}

function applyfilter() {
    console.log('GPP', GPP.length);
    const PSList = document.getElementById("PSList")
    PSList.innerHTML = ""
    filteredPP = []
    /* 3 filters active */
    if (activefilter.status != "Clear Filter" && activefilter.program != "Clear Filter" && activefilter.domain != "Clear Filter") {
        GPP.forEach(i => {
            if (i.program == activefilter.program && i.status == activefilter.status && i.domain == activefilter.domain)
                filteredPP.push(i)
        })
    }
    /* 2 filters active */
    if (activefilter.program != "Clear Filter" && activefilter.domain != "Clear Filter" && activefilter.status == "Clear Filter") {
        GPP.forEach(i => {
            if (i.program == activefilter.program && i.domain == activefilter.domain)
                filteredPP.push(i)
        })
    }
    if (activefilter.domain != "Clear Filter" && activefilter.status != "Clear Filter" && activefilter.program == "Clear Filter") {
        GPP.forEach(i => {
            if (i.status == activefilter.status && i.domain == activefilter.domain)
                filteredPP.push(i)
        })
    }
    if (activefilter.status != "Clear Filter" && activefilter.program != "Clear Filter" && activefilter.domain == "Clear Filter") {
        GPP.forEach(i => {
            if (i.program == activefilter.program && i.status == activefilter.status)
                filteredPP.push(i)
        })
    }
    /* 1 filter active */
    if (activefilter.status != "Clear Filter" && activefilter.program == "Clear Filter" && activefilter.domain == "Clear Filter") {
        GPP.forEach(i => {
            if (i.status == activefilter.status)
                filteredPP.push(i)
        })
    }
    if (activefilter.status == "Clear Filter" && activefilter.program != "Clear Filter" && activefilter.domain == "Clear Filter") {
        GPP.forEach(i => {
            if (i.program == activefilter.program)
                filteredPP.push(i)
        })
    }
    if (activefilter.status == "Clear Filter" && activefilter.program == "Clear Filter" && activefilter.domain != "Clear Filter") {
        GPP.forEach(i => {
            if (i.domain == activefilter.domain)
                filteredPP.push(i)
        })
    }
    // GPP.forEach(i => {
    //     if (activefilter.program != "Clear Filter") if (i.program == activefilter.program) filteredPP.push(i)
    //     if (activefilter.domain != "Clear Filter") if (i.domain == activefilter.domain) filteredPP.push(i)
    //     if (activefilter.status != "Clear Filter") if (i.tag == activefilter.status) filteredPP.push(i)
    // })
    // var filteredPP = [ ...new Set(filteredPP) ]
    renderpp()
}

/* Active filters */



/* Abstraction */
function encodeQuery(data) {
    let query = data.url
    for (let d in data.params)
        query += encodeURIComponent(d) + '='
            + encodeURIComponent(data.params[d]) + '&';
    return query.slice(0, -1)
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    // Months array to convert numeric month to string
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Get day, month, year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Get hours and minutes
    let hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);

    // AM or PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;

    // Format the string
    const formattedDate = `${day}/${month}/${year}; ${hours}:${minutes} ${ampm}`;

    return formattedDate;
}

function verifyuser() {
    user = JSON.parse(sessionStorage.getItem("user"))
    console.log("user", user);
    if (user) {
        var displayName = document.getElementById("profile-name")
        displayName.innerText = user.name
    } else {
        alert("Could not fetch user, Please try Logining IN again or use a different browser")
        window.location = "/PCP/pcpauth.html"
    }
}

function logout() {
    sessionStorage.removeItem("user")
    window.location = "/PCP/pcpauth.html"

}
/* Abstraction */
