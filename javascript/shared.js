function createCustomElementWithContent(htmlTag, content) {
  const element = document.createElement(htmlTag);
  if (content)
    element.textContent = content;

  return element;
}

function timeConverter(UNIX_timestamp){
  const a = new Date(UNIX_timestamp * 1000);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = ("0" + a.getHours()).substr(-2);
  const min = ("0" + a.getMinutes()).substr(-2);
  const sec = ("0" + a.getSeconds()).substr(-2);
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


function createAndAppendItemsWithData(parent, arrayItems, arrayData){
  arrayItems.forEach((tag, index)=>{
    let item;
    let temp;
    if (Array.isArray(tag)){
      tag.forEach((secondItem, secondIndex)=>{
        if (secondIndex === 0){
          temp = document.createElement(secondItem);
          temp.textContent = arrayData[index][secondIndex];
        } else{
          const secondTag = document.createElement(secondItem);
          secondTag.textContent = arrayData[index][secondIndex];
          temp.appendChild(secondTag);
          parent.appendChild(temp);
        }
      });
    } else {
      item = document.createElement(tag);
      item.textContent = arrayData[index];
      parent.appendChild(item);
    }
  })
}