const downloadPswrd = 'Uday';
let registeredData = JSON.parse(localStorage.getItem('registeredData')) || [];
fetchData();
const TicketPrices = JSON.parse(localStorage.getItem('TicketPrices')) || {
  Serving : 1600,
  Child: 900,
  Guest: 2600
};

const navDivs = document.querySelectorAll('.nav_div');
const downloadBtn = document.getElementById('Download_Btn');
const enclosuresContainer = document.getElementById('enclosuresContainer');
const optionsContainer = document.getElementById('optionsContainer');

function fetchData(){
  fetch('NOIdata.json')
      .then(response => response.json())
      .then(data => { 
        if(data.length >= registeredData.length){
          registeredData = data;
        }
      });
}

function navDivsDisplayNone(clickedDiv){
  const navDivsContainer = document.querySelectorAll('.navDivsContainer');
  navDivsContainer.forEach(function(div){
    div.style.display = 'none';
  });
  clickedDiv.style.display = 'block';
}

updateTicketPrices();
document.querySelector('.ticketDetails').onclick = ()=>{
  const TicketDetailsContainer = document.getElementById('TicketDetailsContainer');
  navDivsDisplayNone(TicketDetailsContainer);
}

document.querySelector('.enclosures').onclick = ()=>{
  const enclosuresEditDiv = document.getElementById('enclosuresEditDiv');
  navDivsDisplayNone(enclosuresEditDiv);
}

updateRegistrationContainer();
document.querySelector('.register').onclick = ()=>{
  const registrationContainer = document.getElementById('registrationContainer');
  navDivsDisplayNone(registrationContainer);
}

document.querySelector('.fullList').onclick = ()=>{
  const fullListContainer = document.getElementById('fullListContainer');
  navDivsDisplayNone(fullListContainer);
  showRegisteredData(fullListContainer);
}

downloadBtn.onclick = ()=>{
  const pswrd = prompt('Enter Password: ');
  if(pswrd !== downloadPswrd){
    alert('Wrong Password');
    return;
  }
  const rdStr = JSON.stringify(registeredData);
  const blob = new Blob([rdStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "NOIdata.json"; // file name
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.querySelector('.addNewTktDetailsBtn').onclick = function(){
  const newTicketDetailsContainer = document.querySelector('.newTicketDetailsContainer');
  newTicketDetailsContainer.innerHTML = '';
  newTicketDetailsContainer.innerHTML = '<input class="tktCat" placeholder = "Category...."><input class="tktPrice" placeholder="Price....">';
  const addBtn = document.createElement('button');
  const closeBtn = document.createElement('button');
  addBtn.textContent = 'Add';
  closeBtn.textContent = 'Close';
  newTicketDetailsContainer.appendChild(addBtn);
  newTicketDetailsContainer.appendChild(closeBtn);
  closeBtn.onclick = function(){newTicketDetailsContainer.innerHTML = ''}
  addBtn.onclick = function(){
    const catInput = newTicketDetailsContainer.querySelector('.tktCat');
    const priceInput = newTicketDetailsContainer.querySelector('.tktPrice');
    const Category = catInput.value;
    const price = priceInput.value;
    if(Category == ''){
      alert('Enter a Category of Ticket');
      catInput.focus();
      return;
    }
    if(isNaN(price) || price == '') {
      alert('Enter a Correct price');
      priceInput.focus();
      return;
    }
    TicketPrices[Category] = Number(price);
    localStorage.setItem('TicketPrices', JSON.stringify(TicketPrices));
    updateTicketPrices();
    newTicketDetailsContainer.innerHTML = '';
  }
}

function updateTicketPrices(){
  const TicketDetailsDiv = document.querySelector('.TicketDetailsDiv');
  TicketDetailsDiv.innerHTML = '';
  const Categories = Object.keys(TicketPrices);
  Categories.forEach(function(Category){
    const catInput = document.createElement('input');
    catInput.value = Category;
    catInput.disabled = true;

    const priceInput = document.createElement('input');
    priceInput.value = TicketPrices[Category];
    priceInput.disabled = true;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = function(){
      delete TicketPrices[Category];
      localStorage.setItem('TicketPrices', JSON.stringify(TicketPrices));
      updateTicketPrices();
    }

    TicketDetailsDiv.appendChild(catInput);
    TicketDetailsDiv.appendChild(priceInput)
    TicketDetailsDiv.appendChild(deleteBtn)


  });
}

function updateRegistrationContainer(){
  let today = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[today.getMonth()];
  const day = today.getDate();
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');

  today = `${month} ${day}, ${hours}:${minutes}`;

  optionsContainer.querySelector('.dateInput').value = today;
  const categories = Object.keys(TicketPrices);
  categories.forEach(function(category){
    const label = document.createElement('label');
    label.textContent = category + ' :';
    const input = document.createElement('input');
    input.type = 'number';
    optionsContainer.appendChild(label);
    optionsContainer.appendChild(input);
    input.classList.add('catInputs');
    input.dataset.key = category;
    
    input.onchange = function(){
      const catInputs = document.querySelectorAll('.catInputs');
      let totalMembers = 0;
      let totalAmount = 0;
      catInputs.forEach(function(inp, i){
        totalMembers += Number(inp.value);
        totalAmount += Number(inp.value) * TicketPrices[categories[i]];
      })
      totalInput.value = totalAmount;
      optionsContainer.dataset.totalMembers = totalMembers;
    }
  });

  var totalLabel = document.createElement('label');
  totalLabel.textContent = 'Total Amount :';
  var totalInput = document.createElement('input');
  totalInput.dataset.key = 'Amount';
  totalInput.disabled = true;

  var submitBtn = document.createElement('button');
  submitBtn.textContent = 'Select Table';
  submitBtn.type = 'submit';
  submitBtn.className = 'selectTableBtn';

  optionsContainer.appendChild(totalLabel);
  optionsContainer.appendChild(totalInput);
  optionsContainer.appendChild(submitBtn);
}

const enclosures = [
  {enclosure: 'A', maxTables: 63, perTable:6},
  {enclosure: 'B', maxTables: 83, perTable:6},
  {enclosure: 'C', maxTables: 101, perTable:6},
  {enclosure: 'D', maxTables: 99, perTable:6},
  {enclosure: 'E', maxTables: 6, perTable:6},
  {enclosure: 'F', maxTables: 10, perTable:6}
]

optionsContainer.onsubmit = function(e){
  e.preventDefault();
  const totalMembers = Number(this.dataset.totalMembers);
  if(!totalMembers) return;
  setUpEnclosures(totalMembers);
  enclosuresContainer.style.height = '100vh';
}

enclosuresContainer.querySelector('#BackButton').onclick = function(){
    enclosuresContainer.style.height = '0px';
}

function setUpEnclosures(totalPersons){
  let seatsSelected = 0;
  let tablesSelected = [];
  const seatsSelectedDiv = document.querySelector('.seatsSelectedDiv');
  seatsSelectedDiv.textContent = '{ }';
  let tablesBooked = [];
  registeredData.forEach(function(regObj,i){
    tablesBooked = tablesBooked.concat(regObj.Tables);
  });

  enclosures.forEach(function(obj, i){    
    const enclosureDiv = document.getElementById(`${obj.enclosure}-Enclosure`);
    const tablesContainer = enclosureDiv.querySelector('#tablesContainer');
    tablesContainer.innerHTML = '';
    const maxTables = obj.maxTables;

    for(let tableSl=1; tableSl<= maxTables; tableSl++){
      const tableName = `${obj.enclosure}-${tableSl}`;
      let seatsBooked = 0;
      seatsBooked = tablesBooked.filter(table => table == tableName).length;

      const tableContainer = document.createElement('div');
      tableContainer.classList.add('tableContainer');
      const table = document.createElement('div');
      table.textContent = tableName;
      table.classList.add('table');
      tableContainer.appendChild(table);

      for(let chairSl=1; chairSl<= obj.perTable; chairSl++){
        const chair = document.createElement('div');
        chair.classList.add('chair');
        chair.classList.add(`chair_${chairSl}`);
        let chairBooked;
        if(chairSl <= seatsBooked){
          chair.classList.add('bookedChair');
          chairBooked = true;
        }
        tableContainer.appendChild(chair);
        let selected;
        chair.onclick = function(){
          if(chairBooked) return;

          if(!selected){
            chair.classList.add('selectedChair');
            selected = true;
            seatsSelected ++;
          }else{
            chair.classList.remove('selectedChair');
            selected = false;
            seatsSelected --;
          }

          if(seatsSelected > totalPersons){
            alert('all seats selected')
            chair.classList.remove('selectedChair');
            selected = false;
            seatsSelected --;
          }

          const selectedSeats = document.querySelectorAll('.selectedChair');
          tablesSelected = [];
          selectedSeats.forEach(function(chair){
            tablesSelected.push(chair.parentElement.querySelector('.table').textContent);
          });
          seatsSelectedDiv.textContent ='{ Table Selected: ' + tablesSelected.join(', ') + '}';
        }
      }
      tablesContainer.appendChild(tableContainer);
    }
    enclosureDiv.appendChild(tablesContainer);
  });
  document.getElementById('DoneButton').onclick = function(){
    if(tablesSelected.length !== totalPersons){
      alert('Select all required seats')
      return;
    }
    const newReg = {}
    const inputs = optionsContainer.querySelectorAll('input');
    inputs.forEach(function(input){
      newReg[input.dataset.key] = input.value;
      input.value = '';
    });
    newReg.Tables = tablesSelected;
    registeredData.push(newReg);
    localStorage.setItem('registeredData', JSON.stringify(registeredData));
    enclosuresContainer.style.height = '0px';
    console.log(registeredData);
    alert('succefully registered!');
  }
}

function showRegisteredData(fullListContainer){
  fullListContainer.innerHTML = '';
  
  const fullListHeadingContainer = document.createElement('div');
  fullListHeadingContainer.className = 'fullListHeadingContainer';

  const keys = Object.keys(registeredData[0] || {});
  keys.forEach((key) => {
    headingKey = document.createElement('div');
    headingKey.textContent = key;
    fullListHeadingContainer.appendChild(headingKey);
  });

  const detailsContainer = document.createElement('div');
  detailsContainer.className = 'detailsContainer';
  registeredData.forEach((member, i) => {
    keys.forEach((key) => {
      const eachKey = document.createElement('div');
      eachKey.textContent = member[key];
      detailsContainer.appendChild(eachKey);
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'regDeleteBtn';
    detailsContainer.appendChild(deleteBtn);
    deleteBtn.onclick = ()=>{
      registeredData.splice(i,1);
      showRegisteredData(fullListContainer);
      localStorage.setItem('registeredData', JSON.stringify(registeredData));
    }
    //detailsHtml += '<button class="regDeleteBtn">X</button>';
  });

  fullListContainer.appendChild(fullListHeadingContainer);
  fullListContainer.appendChild(detailsContainer);
}

