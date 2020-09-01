import { uniqueId } from "lodash";

const init = () => {

  const form = document.querySelector('form');
  const tbody = document.querySelector('table tbody');
  const top = document.querySelector('#top');
  const low = document.querySelector('#low');
  const state = {
    list: [],
    flag: true
  }
  
  const deleteRow = (e) => {
    e.preventDefault;
    state.list = state.list.filter((delElement) => e.target.id !== delElement.id);
    render(state.list); 
  }
 
  const render = (weatherData) => {
  const rows = weatherData.map((item) => {
  const { temp, pressure, name, id } = item;
  return `<tr>
     <td>${name}</td>
     <td>${temp}°C</td>
     <td>${pressure} hPa</td>
     <td><button id="${id}" class="del" type="click">Удалить</button></td>
  </tr>`
  })
  tbody.innerHTML = rows.join('');
  const delElements = document.querySelectorAll('.del');
  delElements.forEach(del => {del.addEventListener("click", deleteRow )} )
 };
 
   const callback = (e) => {
       e.preventDefault();
       const formData = new FormData(e.target);
       const city = formData.get('city');
       const url = (`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=5fbfe39e449774757ff0d800cbb8453d`);
       fetch(url)
          .then((response) => {
            const result = response.json();
         return result;
         })
         .then((result) => {
             const id = String(uniqueId());
             const { 
               name,
               main: { temp, pressure }
               } = result;
             const data = { temp, pressure, name, id };
             state.list.push(data);
             render(state.list);
            })
          .catch(console.error);
     };
 
   const sortCity = document.getElementById('sort');
     sortCity.addEventListener("click", e => {
       e.preventDefault();
       if (state.flag) {
         state.list.sort((a, b) => a.temp > b.temp ? 1 : -1);
         top.setAttribute('class', 'new-sort-arrow-up');
         low.setAttribute('class', 'new-sort-arrow-down');
       }
     else {
         state.list.sort((a, b) => a.temp < b.temp ? 1 : -1);
         top.setAttribute('class', 'sort-arrow-up');
         low.setAttribute('class', 'sort-arrow-down');
       }
       state.flag = !state.flag
        render(state.list);
   });
 
 form.addEventListener('submit', callback);

};

export default init;