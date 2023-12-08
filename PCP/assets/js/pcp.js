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
function onloadfacultyhome(){
    // TODO: getpp displaypp
    getAllProblems()
    getfilters()
}
function onloadstudenthome(){
    // TODO: getpp displaypp
}
function onloadrequests(){
    // TODO: getpp displaypp
}
/* Onpage load triggers */

/* Get from DB */
async function getAllProblems(){
    data = {
        url: v300,
        params: {
            'code': 'readall'
        }
    }
    const query = encodeQuery(data)
    console.log("query", query)
    const res = await fetch(query);
    const PS = await res.json();
    if (res.status != 200) alert("Request returnde status code", res.status);
    if (res.status === 200) {
        GPP = PS
        return true
    } else return false
}

async function getfilters(){
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

/* Abstraction */
function encodeQuery(data) {
    let query = data.url
    for (let d in data.params)
        query += encodeURIComponent(d) + '='
            + encodeURIComponent(data.params[d]) + '&';
    return query.slice(0, -1)
}

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

/* Abstraction */
