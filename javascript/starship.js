document.addEventListener('DOMContentLoaded', ()=>{
  fetch(`https://ll.thespacedevs.com/2.2.0/launch/upcoming/`)
  .then(result => result.json())
  .then(json=>{
    data = json;
    // localStorage.setItem('starshp', JSON.stringify(data));
    // getStarshipData(data)
    console.log(data)
    if (data.results.results >= 1){
      getStarshipData(data)
    }else{
      console.log('something ')
      showCustomError()
    }

  })
  .catch(err => console.log(err))

  // const starshipDataLocal = JSON.parse(localStorage.getItem('starshp'));
  // console.log(starshipDataLocal)
  let starshipData;

  // getStarshipData(starshipDataLocal)
  function getStarshipData(info){
    starshipData = info.results.filter(item => {
      if (item.rocket.configuration.family === "Starship") {
        return item;
      }
    })
    if(starshipData.length >= 1){
      console.log('ok')
      useStarshipData();
    }else{
      console.log('eh')
      showCustomError();
    }

  }

  function useStarshipData(){
    const output = document.querySelector('.main');
    const wrapper = document.createElement('div');
    wrapper.classList.add('starship-launch')
    const {name , status, last_updated,window_end,window_start, mission:{description: missionDescription}, image} = starshipData[0];

    const utcDateWindowEnd = window_end;
    const windowEndDate = timeConverter(new Date(utcDateWindowEnd).getTime() / 1000);

    const utcDateWindowStart = window_start;
    const windowStartDate = timeConverter(new Date(utcDateWindowStart).getTime() / 1000);

    const tagsArray = ['h1', 'p', ['p', 'span'],['p', 'span']];
    const dataArray = [name, missionDescription, ['Window starts: ',windowStartDate], ['Window ends: ', windowEndDate]];
    createAndAppendItemsWithData(wrapper, tagsArray, dataArray);

    output.appendChild(wrapper)
    // console.log(name)
    // console.log(last_updated)
    // console.log(mission)
    const img = document.createElement('img');
    img.src = image;

    wrapper.appendChild(img)
  }
})

const showCustomError = () =>{
  const output = document.querySelector('.main');
  output.classList.add('error-holder')
  const wrapper = document.createElement('div');
  wrapper.classList.add('error-svg-holder')
  output.appendChild(wrapper);

  const h2 = document.createElement('h2');
  h2.innerText = 'Sorry, no information about next starship test launch';
  h2.classList.add('message')
  const img = document.createElement('img');
  img.src = './imgs/sattelite.svg';

  wrapper.appendChild(h2);
  wrapper.appendChild(img);
}
