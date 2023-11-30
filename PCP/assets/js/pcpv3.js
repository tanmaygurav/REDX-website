const v300 =
    "https://script.google.com/macros/s/AKfycbzPSXRntXbqVZ-tfmJazl44EkTU8sCsv7xT0wQJKDI_DtQHYqNw2wvBKML_HJjRstcC/exec?";

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

async function getPS() {
    const list = document.getElementById("PSList");
    list.innerHTML = `<h4>Loading Please wait...</h4>`;
    data = {
        url: v300,
        params: {
            code: "readPS",
        },
    };
    const query = encodeQuery(data);
    const response = await fetch(query);
    const res = await response.json();
    // console.log("res",res);
    if (response.status != 200) alert("Request returned status code", res.status);
    if (response.status === 200) {
        list.innerHTML = "";
        res.forEach((i) => {
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
        });
    }
}

function encodeQuery(data) {
    let query = data.url;
    for (let d in data.params)
        query +=
            encodeURIComponent(d) + "=" + encodeURIComponent(data.params[d]) + "&";
    return query.slice(0, -1);
}
