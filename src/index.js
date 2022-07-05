import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  let value = event.target.value.trim();

  if (value != '') {
    fetchCountries(value)
      .then(res => {
        if (res.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          resetSearch();
        }

        if (res.length >= 2 && res.length <= 10) {
          resetSearch();
          refs.countryList.innerHTML = markUpList(res);
        }

        if (res.length > 0 && res.length < 2) {
          resetSearch();
          refs.countryInfo.innerHTML = markUpCountry(res);
        }
      })
      .catch(error => {
        resetSearch();
      });
  } else {
    resetSearch();
    return Notify.warning('Search query is empty!');
  }
}

function resetSearch() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function markUpList(list) {
  return list
    .map(
      country =>
        `<li class="country-item"><img src="${country.flags.svg}" class="img" ></img><p>${country.name.official}</p></li>`
    )
    .join('');
}

function markUpCountry(info) {
  const [country] = info;
  const { name, population, flags, capital, languages } = country;
  const langArray = Object.values(languages);

  return `<div class="box"><img src="${flags.svg}" class="img"></img>
          <h2>${name.official}</h2></div>
    <ul class="country-list">
      <li class="country-item country-item__box"><p><b>Capital: </b>${capital}</p></li>
      <li class="country-item country-item__box"><p><b>Population: </b>${population}</p></li>
      <li class="country-item country-item__box"><p><b>Languages: </b>${langArray.join(
        ', '
      )}</p></li>
    </ul>`;
}
