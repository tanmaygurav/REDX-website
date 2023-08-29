// displayPS("0001")

// async function displayPS(uuid) {
//     data = {
//         url: v200,
//         params: {
//             'code': 'readDS',
//             'uuid': uuid,
//         }
//     }
//     const query = encodeQuery(data)
//     const response = await fetch(query);
//     const res = await response.json();
//     if (response.status != 200) console.log(false);
//     if (response.status === 200) {
//         const rightpane = document.getElementById("rightpane")
//         rightpane.innerHTML = `
//         <div class="d-flex justify-content-between">
//                 <div>
//                     <div id="P-title" class="title-right">${res.title}</div>
//                     <div id="P-domain" class="domain-right">${res.domain}</div>
//                 </div>
//                 <div>
//                     <button type="button" class="btn btn-outline-success shadow" onclick=marksolved(${res.uuid})>Mark Solved</button>
//                     <button type="button" class="btn btn-outline-warning shadow" onclick=markunsolved(${res.uuid}>Mark Unsolved</button>
//                 </div>
//             </div>
//             <div class="d-flex m-2">
//                 <!-- <div class="d-inline-flex Image-Galary m-1">
//                     <div class="big-image"></div>
//                 </div> -->
//                 <div class="student-input d-flex justify-content-start">
//                     <div class="d-flex flex-column p-2">
//                         <div class="title">Description</div>
//                         <div class="subtitle">Who is experiencing the problem?</div>
//                         <div class="description">${res.d0}</div>
//                         <div class="subtitle">What is the problem?</div>
//                         <div class="description">${res.d1}</div>
//                         <div class="subtitle">Where is the user experiencing the problem?</div>
//                         <div class="description">${res.d2}</div>
//                         <div class="subtitle">When does the problem present itself to the user?</div>
//                         <div class="description">${res.d3}</div>

//                         <div class="subtitle">What other activities are the users performing while they experience the problem?</div>
//                         <div class="description">${res.d4}</div>

//                         <div class="subtitle">Why should this problem be solved? / What is the benefit to the user of solving this problem?</div>
//                         <div class="description">${res.d5}</div>

//                         <div class="subtitle">Possible Solution</div>
//                         <div class="description">${res.d6}</div>
//                     </div>
//                 </div>
//             </div>
//             <div class="mb-3">
//                 <label for="exampleFormControlTextarea1" class="form-label title">Remarks</label>
//                 <textarea class="form-control description" id="exampleFormControlTextarea1" rows="3"></textarea>
//                 <div class="mt-3 mb-3">
//                     <button type="button" class="btn btn-outline-primary shadow remarkbtn">Edit</button>
//                     <button type="button" class="btn btn-outline-primary shadow remarkbtn">Save</button>
//                 </div>
//                 <div class="card shadow p-2">remarks 1</div>
//             </div>
//         </div>
//         `
//     }
    

// }
