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

  document.title = name;
  const tagsArray = ['h1', 'p', 'p', 'p', 'p', 'p', 'p']
  const dataArray = [
    name,
    `Cost per launch: ${cost_per_launch.toLocaleString()} $`,
    `Description: ${description}`,
    `First Flight: ${first_flight}`,
    `Height: ${heightInMeters} m.`,
    `Diameter: ${diameterM} m.`,
    `Mass: ${massKg.toLocaleString()} kg.`
  ]

  createAndAppendItemsWithData(singleOutput, tagsArray, dataArray)

  createImageGallery(flickr_images, gallery);

}

function showPastLaunch(data){
  const singleOutput = document.getElementById('singleOutput');
  const gallery = document.getElementById('gallery');
  let {date_unix,  name, details, links:{flickr: {original: images}}, rocket} = data;

  document.title = name;

  const launched = timeConverter(date_unix);
  const tagsArray = ['h1',['p', 'span'], 'p' ]
  const dataArray = [name, ['Lauched: ', launched],`Description: ${details}` ]

  createAndAppendItemsWithData(singleOutput, tagsArray, dataArray)


  fetch(`https://api.spacexdata.com/v4/rockets/${rocket}`)
  .then(result => result.json())
  .then(json=>{
    let rocketName = json.name;
    const usedRocket = createCustomElementWithContent('p', `Rocket: ${rocketName}`);
    singleOutput.appendChild(usedRocket);
  })
  .catch(err => console.log(err));

  createImageGallery(images, gallery);
}

function createImageGallery(imagesArray, galleryHolder){
  if (imagesArray.length > 0) {
    const mainImg = document.createElement('img');
    mainImg.classList.add('mainImg');
    mainImg.src = imagesArray[0];

    const otherImgsHolder = document.createElement('div');
    otherImgsHolder.classList.add('other-imgs');

    imagesArray.forEach(img => {
      const image = document.createElement('img');
      image.src = img;
      otherImgsHolder.appendChild(image);

      image.addEventListener('click', (e) => {
        const clickedImageSrc = e.target.currentSrc
        mainImg.src = clickedImageSrc;
      })
    });

    galleryHolder.appendChild(mainImg);
    galleryHolder.appendChild(otherImgsHolder);
  } else {
    const message = createCustomElementWithContent('h2', 'Images are not provided for this launch from API 😢');
    message.classList.add('message')
    galleryHolder.appendChild(message);
  }
}

renderItemToPage();