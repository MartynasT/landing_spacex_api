localStorage.removeItem('item');
let data = [];
let item= [];

const buttons =  document.querySelectorAll('.buttons button');

buttons.forEach((button)=>{
  button.addEventListener('click', ()=>{
    const request = button.dataset.request;
    const state = button.name
    makeApiRequest(request, state);
    drawInfoModal();
    clearHtml();
  })
})

function drawInfoModal(){
  const main = document.querySelector('.main');
  const fullModal = document.createElement('div');
  fullModal.classList.add('infoModal');

  const listWrapper = document.createElement('div');
  listWrapper.classList.add('list-Wrapper');
  setTimeout(()=>{
    listWrapper.classList.add('active');
  }, 100)

  main.appendChild(fullModal);
  fullModal.appendChild(listWrapper);
}

function makeApiRequest(info, state){
  fetch(`https://api.spacexdata.com/v4/${info}`)
  .then(result => result.json())
  .then(json=>{
    data = json;
    console.log(data);
    useDataFromApi(data, state);
  })
  .catch(err => console.log(err))
}

function useDataFromApi(data, switchState){
  switch (switchState){
    case 'rockets':
      renderList(data, switchState);
      break;
    case 'past':
      renderList(data, switchState);
      break;
    case 'next':
      showNextLaunch(data);
      break;
  }
}

function renderList(data, swithSate){
  const output = document.querySelector('.list-Wrapper');

  output.innerHTML = '';

  const listHolder = document.createElement('ul');
  listHolder.classList.add('list-holder');
  output.appendChild(listHolder);

  data.forEach(item=>{
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.textContent = item.name;
    p.id = item.id;

    listHolder.appendChild(li);
    li.appendChild(p);

    li.addEventListener('click', ()=>{
      getSpecificItemDataFromApi(item.id, swithSate);
    })
  })
}

function showNextLaunch(infoAboutNextLaunch){
  const {name, date_utc, details, flight_number, date_unix} = infoAboutNextLaunch;
  // const outputDiv = document.getElementById('outputDiv');
  const outputDiv = document.querySelector('.list-Wrapper');
  outputDiv.classList.add('outputWrapper')
  const h2 = createCustomElementWithContent('h2', name);
  outputDiv.appendChild(h2);

  const time = createCustomElementWithContent('p', 'Launch time: ');
  const spanTime = document.createElement('span');


  const launchDate = timeConverter(date_unix);

  spanTime.textContent =  launchDate;

  outputDiv.appendChild(time);
  time.appendChild(spanTime);

  const flightNumber = createCustomElementWithContent('p', `Flight number: ${flight_number}`);
  outputDiv.appendChild(flightNumber);

  const description = document.createElement('p');
  description.textContent = details;

  outputDiv.appendChild(description);


}

function getSpecificItemDataFromApi(id, switchState){
  let apiRequest;
  switch (switchState) {
    case 'rockets':
      apiRequest = `rockets/${id}`;
      break;
    case 'past':
      apiRequest = `launches/${id}`;
      break;
  }

  fetch(`https://api.spacexdata.com/v4/${apiRequest}`)
  .then(result => result.json())
  .then(json=>{
    item = json;
    console.log(item);
    // const toStorage = [JSON.stringify(item), switchState];
    const toStorage = [item, switchState];
    localStorage.setItem('item', JSON.stringify(toStorage) );
    window.location.href = "single.html";
  })
  .catch(err => console.log(err))
}

document.addEventListener('click', function(event) {
  if(event.target.className === 'infoModal'){
    document.querySelector('.infoModal').remove();
  }
}, false);

function clearHtml(){
  const outputDiv = document.getElementById('outputDiv');
  const output = document.getElementById('output');
  outputDiv.innerHTML ='';
  output.innerHTML ='';
}


