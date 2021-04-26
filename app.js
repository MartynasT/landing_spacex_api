document.addEventListener('DOMContentLoaded', () => {
  const singlePage = document.getElementById('single');
  if (singlePage) {
    renderItemToPage();
  } else {
    localStorage.removeItem('item');
    let data = [];
    let item= [];

    document.querySelector('.buttons').addEventListener('click', event=>{
      if (event.target.nodeName === "BUTTON" ) {
        const request = event.target.dataset.request;
        const state = event.target.name
        makeApiRequest(request, state);
        clearHtml();
      }
    });


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
        // console.log(toStorage)
        // console.log(JSON.stringify(toStorage))
        localStorage.setItem('item', JSON.stringify(toStorage) );
        window.location.href = "single.html";
        // renderList(data);
      })
      .catch(err => console.log(err))
    }

    function useDataFromApi(data, switchState){
      let title = document.getElementById('listTitle');
      switch (switchState){
        case 'rockets':
          title.innerText = 'Rockets';
          renderList(data, switchState);
          break;
        case 'past':
          title.innerText = 'Past Launches';
          renderList(data, switchState);
          break;
        case 'next':
          title.innerText = 'Next Launch:';
          showNextLaunch(data);
          break;
      }
    }

    function renderList(data, swithSate){
      const output = document.getElementById('output');
      output.innerHTML = '';

      data.forEach(item=>{
        const li = document.createElement('li');
        const p = document.createElement('p');
        p.textContent = item.name;
        p.id = item.id;

        output.appendChild(li);
        li.appendChild(p);

        li.addEventListener('click', ()=>{
          getSpecificItemDataFromApi(item.id, swithSate);
        })
      })
    }

    function showNextLaunch(infoAboutNextLaunch){
      const {name, date_utc, details, flight_number, date_unix} = infoAboutNextLaunch;
      const outputDiv = document.getElementById('outputDiv');

      const h2 = createCustomElementWithContent('h2', name);
      outputDiv.appendChild(h2);

      const time = createCustomElementWithContent('p', 'Launch time: ');
      const spanTime = document.createElement('span');

      const date = new Date(date_unix * 1000);
      const hours = date.getHours();
      const minutes = '0' + date.getMinutes();

      // spanTime.textContent =  hours + ':' + minutes.substr(-2);

      // outputDiv.appendChild(time);
      // time.appendChild(spanTime);

      const flightNumber = createCustomElementWithContent('p', `Flight number: ${flight_number}`);
      outputDiv.appendChild(flightNumber);

      const description = document.createElement('p');
      description.textContent = details;

      outputDiv.appendChild(description);


    }
  }
})

function createCustomElementWithContent(htmlTag, content) {
  const element = document.createElement(htmlTag);
  if (content)
    element.textContent = content;

  return element;
}

function renderItemToPage(){
  const singleOutput = document.getElementById('singleOutput');
  const gallery = document.getElementById('gallery');

  let storage = JSON.parse(localStorage.getItem('item'));
  let state = storage[1];
  let data = storage[0];

  console.log(state);

  switch (state){
    case 'rockets':
      showRocketInPage(data);
      break;
    case 'past':
      showPastLaunch(data);
      break;
  }


}

function showRocketInPage(data){
  const singleOutput = document.getElementById('singleOutput');
  const gallery = document.getElementById('gallery');
  let {  cost_per_launch, description, name,flickr_images, first_flight,height: {meters: heightInMeters}, mass:{kg: massKg}, diameter: {meters: diameterM}} = data;

  const h1 = createCustomElementWithContent('h1', name);
  singleOutput.appendChild(h1);

  // const rocketStatus = createCustomElementWithContent('p',`Status: ${active}` );
  // singleOutput.appendChild(rocketStatus);

  // const rocketId = createCustomElementWithContent('p', `Rocket id: ${id}`);
  // singleOutput.appendChild(rocketId);

  const price = createCustomElementWithContent('p',`Cost per launch: ${cost_per_launch.toLocaleString()} $` );
  singleOutput.appendChild(price);

  const rocketDescription = createCustomElementWithContent('p', `Description: ${description}`);
  singleOutput.appendChild(rocketDescription);

  // const companyName = createCustomElementWithContent('p', `Company: ${company}`);
  // singleOutput.appendChild(companyName);

  const firstFlight = createCustomElementWithContent('p', `First Flight: ${first_flight}`);
  singleOutput.appendChild(firstFlight);

  const heightMeters = createCustomElementWithContent('p', `Height: ${heightInMeters} m.`);
  singleOutput.appendChild(heightMeters);

  const diameterInfo = createCustomElementWithContent('p', `Diameter: ${diameterM} m.`);
  singleOutput.appendChild(diameterInfo);

  const massInfo = createCustomElementWithContent('p', `Mass: ${massKg.toLocaleString()} kg.`);
  singleOutput.appendChild(massInfo);

  const mainImg = document.createElement('img');
  mainImg.classList.add('mainImg');
  mainImg.src = flickr_images[0];

  const otherImgsHolder = document.createElement('div');
  otherImgsHolder.classList.add('other-imgs');
  flickr_images.forEach(img=>{
    const image = document.createElement('img');
    image.src = img;
    otherImgsHolder.appendChild(image);

    image.addEventListener('click', (e)=>{
      const clickedImageSrc = e.target.currentSrc
      mainImg.src = clickedImageSrc;
    })
  });

  gallery.appendChild(mainImg);
  gallery.appendChild(otherImgsHolder);
}

function showPastLaunch(data){
  const singleOutput = document.getElementById('singleOutput');
  const gallery = document.getElementById('gallery');
  console.log(data);
  // height: {meters: heightInMeters}
  let {name, details, links:{flickr: {original: images}}, rocket} = data;


  const h1 = createCustomElementWithContent('h1', name);
  singleOutput.appendChild(h1);

  const description = createCustomElementWithContent('p', `Description: ${details}`);
  singleOutput.appendChild(description);

  let rocketName = [];
  fetch(`https://api.spacexdata.com/v4/rockets/${rocket}`)
  .then(result => result.json())
  .then(json=>{
    rocketName = json.name;
    console.log(rocketName);
    const usedRocket = createCustomElementWithContent('p', `Rocket: ${rocketName}`);
    singleOutput.appendChild(usedRocket);
  })
  .catch(err => console.log(err));




  if (image.length > 0) {
    const mainImg = document.createElement('img');
    mainImg.classList.add('mainImg');
    mainImg.src = images[0];

    const otherImgsHolder = document.createElement('div');
    otherImgsHolder.classList.add('other-imgs');
    images.forEach(img => {
      const image = document.createElement('img');
      image.src = img;
      otherImgsHolder.appendChild(image);

      image.addEventListener('click', (e) => {
        const clickedImageSrc = e.target.currentSrc
        mainImg.src = clickedImageSrc;
      })
    });

    gallery.appendChild(mainImg);
    gallery.appendChild(otherImgsHolder);
  }
}

function clearHtml(){
  const outputDiv = document.getElementById('outputDiv');
  const output = document.getElementById('output');
  outputDiv.innerHTML ='';
  output.innerHTML ='';
}