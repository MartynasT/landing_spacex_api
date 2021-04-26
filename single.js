function renderItemToPage(){
  const singleOutput = document.getElementById('singleOutput');
  const gallery = document.getElementById('gallery');

  let storage = JSON.parse(localStorage.getItem('item'));
  let state = storage[1];
  let data = storage[0];
  console.log(data);
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
  let {cost_per_launch, description, name,flickr_images, first_flight,height: {meters: heightInMeters}, mass:{kg: massKg}, diameter: {meters: diameterM}} = data;

  const h1 = createCustomElementWithContent('h1', name);
  singleOutput.appendChild(h1);

  const price = createCustomElementWithContent('p',`Cost per launch: ${cost_per_launch.toLocaleString()} $` );
  singleOutput.appendChild(price);

  const rocketDescription = createCustomElementWithContent('p', `Description: ${description}`);
  singleOutput.appendChild(rocketDescription);


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
  let {date_unix,  name, details, links:{flickr: {original: images}}, rocket} = data;


  const h1 = createCustomElementWithContent('h1', name);
  singleOutput.appendChild(h1);

  const description = createCustomElementWithContent('p', `Description: ${details}`);
  singleOutput.appendChild(description);

  const time = createCustomElementWithContent('p', 'Launched: ');
  const spanTime = document.createElement('span');
  const launched = timeConverter(date_unix);

  spanTime.textContent =  launched;

  singleOutput.appendChild(time);
  time.appendChild(spanTime);


  let rocketName = [];
  fetch(`https://api.spacexdata.com/v4/rockets/${rocket}`)
  .then(result => result.json())
  .then(json=>{
    rocketName = json.name;
    const usedRocket = createCustomElementWithContent('p', `Rocket: ${rocketName}`);
    singleOutput.appendChild(usedRocket);
  })
  .catch(err => console.log(err));

  if (images.length > 0) {
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
  } else {
    const message = document.createElement('h2');
    message.classList.add('message')
    message.textContent = 'Images are not provided for this launch from API 😢';
    gallery.appendChild(message);
  }
}

renderItemToPage();
