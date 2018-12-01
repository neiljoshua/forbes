import '../sass/styles.scss'

var flickrApi = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=8b8ebb92e392334b7a21727d1b215b36&extras=url_m%2Csunny%2Curl_l%2Cnature&&per_page=150&page=1&format=json&nojsoncallback=1';

var list = [];
var pageList = [];
var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = 1;
var fragmentGallery = document.createDocumentFragment();
var request = new XMLHttpRequest();

request.open('GET', flickrApi, true);
request.send();

request.onload = function () {

  var data = JSON.parse(this.response);
  console.log('Data', data);
  console.log('request', request);

  if (request.status >= 200 && request.status < 400) {

    var photos = data.photos.photo;

    photos.forEach( function(photo) {

      if ( photo.url_m || photo.url_l) {

        var imageContainer = document.createElement('div'),
            image = document.createElement('img');

        imageContainer.setAttribute('class','thumbnail');
        image.setAttribute('data-image', urlValidator(photo.url_m,photo.url_l));
        image.setAttribute('class','thumbnail__image');
        image.addEventListener('click',toggleModal);
        imageContainer.appendChild(image);
        list.push(imageContainer);
        fragmentGallery.appendChild(imageContainer);

      }

    });

  } else {
    console.log('Error');

    var errorMessage = document.createElement('h2');

    errorMessage.textContent = 'Api is not working';
    galleryPhoto.appendChild(errorMessage);

  }

  if( request.readyState == 4 ) {
    loadImages();
  }

  loadPages();

};

window.onload = function() {
  var buttons = document.querySelector('.button'),
      modal = document.querySelector('.modal');


  buttons.addEventListener('click', toggleButtons);
  modal.addEventListener('click', toggleModal);
};

function urlValidator(url1, url2) {

  if ( url1 != undefined ) {
    return url1;
  } else {
    return url2;
  }

}

function toggleButtons(event) {
  var className = event.target.classList.value;

  switch (className) {
    case 'button__prev':
      previousPage();
      break;
    case 'button__next':
      nextPage();
      break;
    case 'button__first':
      firstPage();
      break;
    case 'button__last':
      lastPage();
      break;
  }
}

function toggleModal(event) {
  var modal = document.querySelector('.modal'),
      modalImage = document.querySelector('.modal__image'),
      imagesrc = event.target.dataset.image,
      className = event.target.className;

  modalImage.setAttribute('src', '');
  if( className == 'thumbnail__image visible') {
    modalImage.setAttribute('src', imagesrc);
  }
  modal.classList.toggle('show__modal');

}

function loadImages() {
  var photosReady = fragmentGallery.querySelectorAll('.thumbnail__image');

  photosReady.forEach( function(photo) {
    var source = photo.dataset.image;

    photo.setAttribute('src',source);
    photo.classList.add('visible');
  });
}

function createPage() {
  numberOfPages = getNumberOfPages();
}

function getNumberOfPages() {
  return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
  currentPage += 1;
  loadPage();
}

function previousPage() {
  currentPage -= 1;
  loadPage();
}

function firstPage() {
  currentPage = 1;
  loadPage();
}

function lastPage() {
  currentPage = numberOfPages;
  loadPage();
}

function loadPage() {
  var firstpage = ((currentPage - 1) * numberPerPage ),
      lastPage = firstpage + numberPerPage;

  pageList = list.slice(firstpage, lastPage);

  drawPage();
  checkButtons();
}

function drawPage() {
  var gallery = document.querySelector('.gallery');

  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
  for (var i = 0; i < pageList.length; i++) {
    document.querySelector('.gallery').appendChild(pageList[i]);
  }
}

function checkButtons() {

  document.querySelector('.button__next').disabled = currentPage == numberOfPages ? true : false;
  document.querySelector('.button__prev').disabled = currentPage == 1 ? true : false;
  document.querySelector('.button__first').disabled = currentPage == 1 ? true : false;
  document.querySelector('.button__last').disabled = currentPage == numberOfPages ? true : false;
}

function loadPages() {
  createPage();
  loadPage();
}
