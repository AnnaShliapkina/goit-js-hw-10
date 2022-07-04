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
          refs.countryList.innerHTML = murkUpList(res);
        }

        if (res.length > 0 && res.length < 2) {
          resetSearch();
          refs.countryInfo.innerHTML = murkUpCountry(res);
        }
      })
      .catch(error => {
        resetSearch();
      });
  } else {
    resetSearch();
    // NEW
    return Notiflix.Notify.warning('Search query is empty!');
  }
}

function resetSearch() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function murkUpList(list) {
  return list
    .map(
      country =>
        `<li class="list-item"><img src="${country.flags.svg}" class="img" ></img><p>${country.name.official}</p></li>`
    )
    .join('');
}

function murkUpCountry(info) {
  const [country] = info;
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
