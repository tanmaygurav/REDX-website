const v300 = "https://script.google.com/macros/s/AKfycbzPSXRntXbqVZ-tfmJazl44EkTU8sCsv7xT0wQJKDI_DtQHYqNw2wvBKML_HJjRstcC/exec?";

function tag(item) {

    console.log(item.checked);
}





async function getPS() {
    const list = document.getElementById("PSList")
    list.innerHTML = `<h4>Loading Please wait...</h4>`;
    data = {
        url: v300,
        params: {
            'code': 'readPS',
        }
    }
    const query = encodeQuery(data)
    const response = await fetch(query);
    const res = await response.json();
    // console.log("res",res);
    if (response.status != 200) alert("Request returnde status code", res.status);
    if (response.status === 200) {
        list.innerHTML = '';
        res.forEach(i => {
            list.innerHTML += `
            <div id="${i.uuid}" class="flex-container">
                <div class="row-tick">
                    <input onclick="tag(this)" type="checkbox" value="${i.uid}" checked="${i.tag}">
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
                        <div class="row-title-ps-time">16/Oct/2023; 09:30 PM</div>
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
        });

    }
}

function encodeQuery(data) {
    let query = data.url
    for (let d in data.params)
        query += encodeURIComponent(d) + '='
            + encodeURIComponent(data.params[d]) + '&';
    return query.slice(0, -1)
}