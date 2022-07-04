import { Notify } from 'notiflix/build/notiflix-notify-aio';

function notification() {
  Notify.failure('Oops, there is no country with that name');
}

export function fetchCountries(name) {
  const request = `https://restcountries.com/v3.1/name/${name}?fields=capital,population,languages,name,flags`;
  return fetch(request)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .catch(error => {
      console.log(error);
      notification();
    });
}

function notification() {
  Notify.failure('Oops, there is no country with that name');
}
