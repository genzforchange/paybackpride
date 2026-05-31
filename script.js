

function rand(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}

function isLowerCase(input) {  
  return input === String(input).toLowerCase()
}

// DROP DOWN //

function addSelect() {
  var arr = ["Finance", "Food & Beverage", "Health", "Shopping & Restaurants", "Tech & Media", "Travel"]
  for (var key of arr) {
    $('select').append('<option value="' + key + '">' + key + '</option>')
  }
}

// EMAIL WRITING //

function emailLink(company) {
  company = company.replace("&amp;", "&")
  var hash = new_data.find(e => e["emails"] == company)
  var loyal = ["loyal", "frequent", "regular"]
  var customer = ["customer", "consumer"]
  var incredibly = ["very", "incredibly", "really", "extremely"]
  var disappointed = ["disappointed", "upset", "disheartened"]
  var anti = ["anti-LGBTQ", "anti-trans", "homophobic", "transphobic"]
  var recent = ["the last few", "recent", "the past few"]
  var showing = ["supporting", "showing support for", "uplifting"]
  var pride = ["Pride", "Pride Month"]
  var wont = ["won't", "will not"]
  var performative = ["rainbow capitalism", "rainbow-washing", "performative allyship"]
  var demand = ["demanding that", "imploring", "urging"]
  var bigoted = ["intolerant", "harmful", "bigoted", "damaging", "destructive"]
  var queer = ["LGBTQ+", "queer"]
  var fund = ["fundraiser", "fund"]
  
  var email = `To whom it may concern:\n\nAs a ${rand(loyal)} ${rand(customer)}, I am ${rand(incredibly)} ${rand(disappointed)} that you have donated ${formatter.format(hash["sum"])} to ${rand(anti)} PACs in ${rand(recent)} years despite ${rand(showing)} the ${rand(queer)} community during ${rand(pride)}. I ${rand(wont)} tolerate ${rand(performative)}, so I am ${rand(demand)} you match your ${rand(bigoted)} donation of ${formatter.format(hash["sum"])} to a tax-deductible ${rand(fund)} for struggling ${rand(queer)} youth:\n\nhttps://secure.actblue.com/donate/paybackpride`
  var emails = hash["emails"].replace(" ", "")
  var emailLetter = encodeURIComponent(email)
  var subjects = [`${rand(showing)} ${rand(queer)} Youth`, `${rand(performative)} During ${rand(pride)}`, `${rand(pride)} ${rand(fund)}`, `${rand(anti)} Practices`]
  var emailLink=`mailto:${emails}?subject=${encodeURIComponent(rand(subjects).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))}&body=${emailLetter}`
  return emailLink
}

// FORMAT DOLLARS //

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const listFormatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

function fromDollar(money) {
  var int = parseInt(money.replace(/[$,]+/g,""))
  return int
}

for (var i = 0; i < companies.length; i++) {
  companies[i]["To Candidates"] = formatter.format(parseInt(companies[i]["To Candidates"].replace(/[$,]+/g,"")))
  companies[i]["To PACs"] = formatter.format(parseInt(companies[i]["To PACs"].replace(/[$,]+/g,"")))
  companies[i]["TOTAL"] = formatter.format(parseInt(companies[i]["TOTAL"].replace(/[$,]+/g,"")))
}

for (var i = 0; i < companies.length; i++) {
  var group_dons = {"RSLC": 0, "RGA": 0, "RAGA": 0}
  var cand_dons = []
  var billsHelped = []
  for (var j = 0; j < group_donations.length; j++) {
    if (companies[i]["COMPANY"] == group_donations[j]["COMPANY"]) {
      group_dons[`${group_donations[j]["GROUP"]}`] += group_donations[j]["DONATION"]
    }
  }
  for (var j = 0; j < candidate_donations.length; j++) {
    if (companies[i]["COMPANY"] == candidate_donations[j]["Company"]) {
      cand_dons.push(candidate_donations[j])
    }
  }
  for (var j = 0; j < cand_dons.length; j++) {
    for (var k = 0; k < bills.length; k++)
    if (bills[k].includes(cand_dons[j]["State"]) && !billsHelped.includes(bills[k])) {
      billsHelped.push(bills[k])
    }
  }
  companies[i]["Group Donations"] = group_dons
  companies[i]["Candidate Donations"] = cand_dons
  companies[i]["Bills Facilitated"] = billsHelped.length
  companies[i]["Bills"] = billsHelped
}

for (var i = 0; i < subsidiaries.length; i++) {
  var element = subsidiaries[i]
  var parent_hash = companies.find(e => e["COMPANY"] == element["Parent Company"])
  parent_hash["Category"] += ` ${element["Category"]}`
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  let th = document.createElement("th");
  row.appendChild(th);
  for (let key of data) {
    // if (key != "Logo" && key != "Group Donations" && key != "Candidate Donations" && key != "Subsidiaries & Products" && key != "Bills" && key != "2023 Pride Post IG" && key != "2023 Pride Post Twitter") {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    // }
  }
  
}

function generateTable(table, data, data2) {
  for (let element of data) {
    var row = table.insertRow();
    // if (plus) {
      var cell = row.insertCell();
      // let text = document.createTextNode("+");
      // cell.appendChild(text);
    // }
    for (key in element) {
      // if (key != "Logo" && key != "Group Donations" && key != "Candidate Donations" && key != "Subsidiaries & Products" && key != "Bills" && key != "2023 Pride Post IG" && key != "2023 Pride Post Twitter") {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      // }
    }
    // let row2 = table.insertRow();
  }
  // for (let element of data2) {
  //   var row = table.insertRow();
  //   // if (plus) {
  //     var cell = row.insertCell();
  //     let text = document.createTextNode("+");
  //     cell.appendChild(text);
  //   // }
  //   // var parent_hash = companies.find(e => e["COMPANY"] == element["Parent Company"])
  //   var hash = {
  //     "COMPANY": element["company"], // 0
  //     "From": element["from"], // 1
  //     "Subsidiaries & Brands": element["subsidiaries"], // 2
  //     "Organizations": element['organizations'], // 3
  //     "Parades": element['parades'], // 4
  //     "TOTAL": element["sum"], // 5
  //     "Logo": element["url"], // 6
  //     "Category": element["industry"], // 7
  //     "2023 Pride Post IG": "", // 8
  //     "2023 Pride Post Twitter": "", // 9
  //     "IG @": element["Instagram @"], // 10
  //     "Twitter @": element["Instagram @"], // 11
  //     "Emails": element["emails"], // 12
  //     "Group Donations": "", // 13
  //     "Candidate Donations": "", // 14
  //     "Bills Facilitated": "", // 15
  //     "Bills": "", // 16
  //   }
  //   for (key in hash) {
  //     // if (key != "Logo" && key != "Group Donations" && key != "Candidate Donations" && key != "Subsidiaries & Products" && key != "Bills" && key != "2023 Pride Post IG" && key != "2023 Pride Post Twitter") {
  //       let cell = row.insertCell();
  //       let text = document.createTextNode(hash[key]);
  //       cell.appendChild(text);
  //     // }
  //   }
  //   // let row2 = table.insertRow();
  // }
}

function makeMiniTable(row, data, i) {
  $(row).append('<td><h5>Donation Details</h5><table id="mini"><tbody id="tbody"></tbody></table></td>')
  let table = document.getElementById("mini");
  generateTable($("tbody", row)[i], data, false);
}

function donorDetail(rowData) {
  var company = rowData[2].replace("&amp;", "&")
  var comp_obj = companies.find(element => element["COMPANY"] == company)
  var states = getStates(comp_obj["Bills"]).sort()
  
  var to_return = `<table class="mini">
  <thead><tr><th>State</th><th>Donated To</th><th>Donation Amount</th><th>Bills Passed</th><th>Type of Bills</th></tr></thead><tbody>`
  for (var i = 0; i<states.length; i++) {
    state_donations = comp_obj["Candidate Donations"].filter(element => element["State"] == states[i])
    bodies = []
    donationAmount = 0
    for (var j = 0; j<state_donations.length; j++) {
      donationAmount += fromDollar(state_donations[j]["Amount"])
      if (!bodies.includes(state_donations[j]["Position"])) {
        bodies.push(state_donations[j]["Position"])
      }
    }
    if (bodies.length > 1) {
      bodies.pop()
      bodies[0] = "Governor & Legislature"
    }
    
    billsPassed = comp_obj["Bills"].filter(element => getStates([element])[0] == states[i])
    billTypes = []
    for (law in laws[states[i]]) {
      if (laws[states[i]][law] == "Y") {
        billTypes.push(law)
      }
    }


        
    to_return += `<tr>`
    // state
    to_return += `<td>${stateAbbv[states[i]]}</td>`
    
    // donation type
    to_return += `<td>${bodies[0]}</td>`

    // donation amount
    to_return += `<td>${formatter.format(donationAmount)}</td>`

    // passed
    to_return += `<td>${billsPassed.join(", ")}</td>`

    // bill types
    to_return += `<td>${billTypes.join(", ")}</td>`
    
    to_return += `</tr>`
  }
  to_return += `</tbody></table>`
  return to_return
}

function getStates(bills) {
  var states = []
  for (var i = 0; i<bills.length; i++) {
    var substring = bills[i].substring(0, 2)
    if (!states.includes(substring)) {
      states.push(substring)
    }
  }
  return states
}

let table = document.querySelector("table");
let data = Object.keys(new_data[0]);
console.log(data)
generateTableHead(table, data)
generateTable(document.querySelector("tbody"), new_data, new_data);

// ['COMPANY'0, 'Parent Company'1, 'Subsidiaries & Products'2, 'To Candidates'3, 'To PACs'4, 'TOTAL'5, 'Logo'6, 'Category'7, '2023 Pride Post IG'6, '2023 Pride Post Twitter'7, 'IG @'8, 'Twitter @'9, 'Emails'10, 'Group Donations'11, 'Candidate Donations'12, 'Bills Facilitated'13, 'Bills'14]
// ['company'1, 'organizations'2, 'parades'3, 'industry'4, 'subsidiaries'5, 'sum'6, 'rga'7, 'raga'8, 'rslc'9, 'from'10, 'emails'11, 'url'12, 'instagram'13, 'twitter'14, 'tiktok'15]


$(document).ready(function() {

  addSelect()
  var dt = $('#table').DataTable({
    paging: false,
    scrollY: 600,
    "dom": '<lf<t>>',
    order: [[parseInt(6), 'desc']],
    colReorder: {
            order: [12, 0, 1, 5, 6, 2, 3, 4, 7, 8, 9, 10, 13, 14, 15, 11]
        },
    columnDefs: [
            {
                targets: [0, 5, 3, 4, 7, 8, 9, 10],
                visible: false
            },
            {
                targets: [0, 7, 3, 8, 11, 12, 13],
                orderable: false
            },
            {
                targets: 12, 
                mRender: function(data, type, full) {
                    console.log(full)
                    toReturn = ''
                    if (data != '') {
                      toReturn = `<img src="${data}"/>`
                    }
                  return toReturn
                }
            },
            {
                targets: 13,
                // data: null,
                // defaultContent: '<button>Click!</button>',
                mRender: function(data, type, full) {
                  toReturn = ''
                  if (data != '') {
                    ig = data.replace("@", "")
                    toReturn = '<a class="btn btn-info btn-sm" target="_blank" href="https://instagram.com/' + ig + '""><i class="fa-brands fa-instagram"></i></a>'
                  }
                  return toReturn
                }
            }, 
            {
                targets: 14,
                // data: null,
                // defaultContent: '<button>Click!</button>',
                mRender: function(data, type, full) {
                  toReturn = ''
                  if (data != '') {
                    twitter = data
                    if (data.includes(",")) {
                      arr = data.split(", ")
                      twitter = rand(arr)
                    }
                    twitter = twitter.replace("@", "")
                    var tweet = `hey @${twitter},\nSupporting Pride is great, but not when you've donated ${full[6]} to anti-LGBTQ+ politicians and PACs in recent years.\nRight your wrongs by matching your donation to LGBTQ+ nonprofits in the South. It's time to #PayBackPride.`

                    toReturn = '<a class="btn btn-info btn-sm" target="_blank" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet) + '&url=https://secure.actblue.com/donate/paybackpride"><i class="fa-brands fa-twitter"></i></a>'
                  }
                  return toReturn
                }
            },
            {
                targets: 15,
                // data: null,
                // defaultContent: '<button>Click!</button>',
                mRender: function(data, type, full) {
                  toReturn = ''
                  if (data != '') {
                    tiktok = data.replace("@", "")
                    toReturn = '<a class="btn btn-info btn-sm" target="_blank" href="https://tiktok.com/' + tiktok + '""><i class="fa-brands fa-tiktok"></i></a>'
                  }
                  return toReturn
                }
            },
            {
                targets: 11,
                // data: null,
                // defaultContent: '<button>Click!</button>',
                mRender: function(data, type, full) {
                  console.log(data)
                  toReturn = ''
                  company = full[3]
                  toReturn = '<a class="btn btn-info btn-sm email" target="_" href="' + emailLink(data) + '"">Send Email</a>'
                  return toReturn
                }
            },
            { // subsidiaries
                targets: 5,
                // className: "smaller"
            },
            { // title
                targets: 1,
                className: "title",
                mRender: function(data, type, full) {
                  toReturn = data.toUpperCase()
                  if (full[3] != "") {
                    toReturn = `${data.toUpperCase()}<br><span style="font-size: 70%; color: grey">Owns ${listFormatter.format(full[3].split(", "))}</span>`
                  }
                  return toReturn
                }
            },
            {
              targets: 6,
              className: "title",
              mRender: function(data, type, full) {
                toReturn = `${formatter.format(full[4])}<br><span style="font-size: 80%">to ${listFormatter.format(full[11].split(","))}</span>`
                
                return toReturn
              }
            },
            {
              targets: 2,
              mRender: function(data, type, full) {
                toReturn = `Sponsoring Pride in ${listFormatter.format(full[6].split(", "))}`
                // orgs = ''
                // parades = ''
                // if (data != '') {
                //   orgs = data
                //   toReturn = toReturn + orgs
                // }
                // if (full[6] != '') {
                //   parades = `Pride in ${listFormatter.format(full[6].split(", "))}`
                //   if (orgs != '') {
                //     toReturn = toReturn + " & " + parades
                //   } else {
                //     toReturn = toReturn + parades
                //   }
                // }
                return `<span style="font-size: 80%; font-style: italic">${toReturn}</span>`
              }
            },
        ], 
    
  });

  
  $('.sorting_disabled').eq(1).text('');
  $('.sorting_disabled').eq(0).css('visibility', 'hidden')
  $('#search-slot').append($('#table_filter'));
  $('.money').addClass('active');
  $('#shuffle').click(function() {
    console.log('hi')
    randCompany = rand(new_data)
    logo = randCompany['url']
    company = randCompany['company']
    amt = formatter.format(randCompany['sum'])
    $('.card-content img').attr("src", logo)
    $('.card-content h1').text(company)
    $('.card-content h2').text(amt)
  })
  $('#shuffle').click()
  $('.money').click(function() {
    dt.order( [[parseInt(6), 'desc' ]] ).draw()
    $('.by').removeClass('active');
    $(this).addClass('active');
  })
  $('.name').click(function() {
    dt.order( [[ 2, 'asc' ]] ).draw()
    $('.by').removeClass('active');
    $(this).addClass('active');
  })
  $('select').on('change', function() {
    dt.search(this.value).draw();
  })
  $('td').each(function() {
    if (this.innerHTML == "") {
      $(this).hide()
    }
  })
  
});


