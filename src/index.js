import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inpetEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inpetEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  let value = evt.target.value.trim();

  if (value != '') {
    fetchCountries(value)
      .then(res => {
        if (res.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          countryInfo.innerHTML = '';
          countryList.innerHTML = '';
        }

        if (res.length >= 2 && res.length <= 10) {
          countryList.innerHTML = murkUpList(res);
          countryInfo.innerHTML = '';
        }

        if (res.length > 0 && res.length < 2) {
          countryInfo.innerHTML = murkUpCountry(res);
          countryList.innerHTML = '';
        }
      })
      .catch(error => {
        // console.log(error);
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
      });
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

function murkUpList(array) {
  return array
    .map(
      el =>
        `<li class="list-item"><img src="${el.flags.svg}" class="img" ></img><p>${el.name.official}</p></li>`
    )
    .join('');
}

function murkUpCountry(argCountry) {
  const [country] = argCountry;
  const { name, population, flags, capital, languages } = country;
  const langArray = Object.values(languages);

  return `<div class="wrapper"><img src="${flags.svg}" class="img"></img>
          <h2>${name.official}</h2></div>
    <ul class="country-list">
      <li class="list-item"><p><b>Capital: </b>${capital}</p></li>
      <li class="list-item"><p><b>Population: </b>${population}</p></li>
      <li class="list-item"><p><b>Languages: </b>${langArray.join(
        ', '
      )}</p></li>
    </ul>`;
}
