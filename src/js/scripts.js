var flickrApi = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=8b8ebb92e392334b7a21727d1b215b36&extras=url_m%2Csunny%2Curl_l%2Cnature&&per_page=100&page=1&format=json&nojsoncallback=1';

var list = [];
var pageList = [];
var currentPage = 1;
var numberPerPage = 10;
var	numberOfPages = 1;
var fragmentGallery = document.createDocumentFragment();

var request = new XMLHttpRequest();

request.open('GET', flickrApi, true);
request.onload = function () {

	var data = JSON.parse(this.response);

	if (request.status >= 200 && request.status < 400) {

		var photos = data.photos.photo;

		photos.forEach( function(photo) {
			var imageContainer = document.createElement('div'),
					image = document.createElement('img');

			imageContainer.setAttribute('class','thumbnail');
			image.setAttribute('data-image', photo.url_m);
			image.setAttribute('class','thumbnail__image');
			imageContainer.appendChild(image);
			list.push(imageContainer);
			fragmentGallery.appendChild(imageContainer);

		});

	} else {

		var errorMessage = document.createElement('marquee');

		errorMessage.textContent = 'Api is not working';
		galleryPhoto.appendChild(errorMessage);

	}

	if(request.readyState) {
		loadImages();
	}

	loadPages();

};

request.send();

document.addEventListener('click', function(event) {

	var clickElem = event.target.classList.value;

	switch (clickElem){
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
		case 'thumbnail__image':
			openModal(event);
			break;
		case 'close__button':
			closeModal(event);
	}

});

function loadImages() {
	var photosReady = fragmentGallery.querySelectorAll('.thumbnail__image');

	photosReady.forEach( function(photo) {
		setTimeout(function(){
			var source = photo.dataset.image;

			photo.setAttribute('src', source);

		}, 7 * photosReady.length );

	});
}

function openModal(event) {
	var modal = document.querySelector('.modal'),
			modalImage = document.querySelector('.modal__image'),
			imagesrc = event.target.dataset.image;

	modalImage.setAttribute('src', imagesrc);
	modal.classList.add('show__modal');

}

function closeModal(event) {
	var modal = document.querySelector('.modal'),
			modalImage = document.querySelector('.modal__image');

	modal.classList.remove('show__modal');
	modalImage.setAttribute('src', '');
}

function makePage() {
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
	var begin = ((currentPage - 1) * numberPerPage ),
			images = document.getElementsByClassName('thumbnail__image'),
			end = begin + numberPerPage;

	pageList = list.slice(begin, end);

	drawPage();
	checkButtons();
}

function drawPage() {
	var gallery = document.getElementById('gallery');
	while (gallery.firstChild) {
		gallery.removeChild(gallery.firstChild);
	}
	for (i = 0; i < pageList.length; i++) {
		document.getElementById('gallery').appendChild(pageList[i]);
	}
}

function checkButtons() {

	document.querySelector('.button__next').disabled = currentPage == numberOfPages ? true : false;
	document.querySelector('.button__prev').disabled = currentPage == 1 ? true : false;
	document.querySelector('.button__first').disabled = currentPage == 1 ? true : false;
	document.querySelector('.button__last').disabled = currentPage == numberOfPages ? true : false;
}

function loadPages() {
	makePage();
	loadPage();
}
