import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(name) {
  const request = `https://restcountries.com/v3.1/name/${name}?fields=capital,population,languages,name,flags`;
  return fetch(request)
    .then(r => {
      if (!r.ok) {
        throw Error(r.statusText);
      }
      return r.json();
    })
    .catch(error => {
      console.log(error);
      notification();
    });
}

function notification() {
  Notify.failure('Oops, there is no country with that name');
}
