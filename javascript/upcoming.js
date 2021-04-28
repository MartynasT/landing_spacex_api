fetch(`https://api.spacexdata.com/v4/launches/upcoming`)
.then(result => result.json())
.then(json=>{
  data = json;
  console.log(data);
  drawLaunchesToScreen(data);
})
.catch(err => console.log(err))

function drawLaunchesToScreen(data){
  console.log(data[0]);
  const launchesOutput = document.getElementById('launchesOutput');

  data.forEach(item=>{
    const launchWrapper = document.createElement('div');
    launchWrapper.classList.add('launch-wrapper')
    let {date_local, date_unix, details, rocket, name} = item;

    if (details === '' || details === null) {
      details = 'Coming soon ⌛ 🚀';
    }

    const launchDate = timeConverter(date_unix);
    const tagsArray = ['h2', 'h3', 'p'];
    const dataArray = [name, `Launch Date: ${launchDate}`, `Details: ${details}`];

    createAndAppendItemsWithData(launchWrapper, tagsArray, dataArray);
    launchesOutput.appendChild(launchWrapper);
  })
}