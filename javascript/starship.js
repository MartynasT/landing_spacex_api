document.addEventListener('DOMContentLoaded', ()=>{
  fetch(`https://ll.thespacedevs.com/2.2.0/launch/upcoming/`)
  .then(result => result.json())
  .then(json=>{
    data = json;
    // localStorage.setItem('starshp', JSON.stringify(data));
    getStarshipData(data)
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
    useStarshipData();
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