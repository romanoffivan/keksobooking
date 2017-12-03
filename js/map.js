'use strict';

var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var OFFER_TYPES = ['flat', 'house', 'bungalo'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var MAX_ROOMS = 5;
var MAX_GUESTS = 20;
var MAX_OBJ = 8;

var Price = {
  MIN: 1000,
  MAX: 1000000
};

var Time = {
  MIN: 12,
  MAX: 14
};

var CoordX = {
  MIN: 300,
  MAX: 900
};

var CoordY = {
  MIN: 100,
  MAX: 500
};

var AppartmentTypes = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var getRandomItem = function (array, remove) {
  var randomElementIndex = getRandomNum(0, array.length - 1);
  var randomElement = array[randomElementIndex];

  if (remove) {
    array.splice(randomElementIndex, 1);
  }

  return randomElement;
};

var getRandomArray = function (array) {
  var randomArray = [];
  var randomLength = getRandomNum(1, array.length);
  var copyArray = array.slice();

  for (var i = 0; i < randomLength; i++) {
    var randomArrayElement = getRandomItem(copyArray, true);
    randomArray.push(randomArrayElement);
  }

  return randomArray;
};

var getRandomNum = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var generatePromo = function (i) {
  var locationX = getRandomNum(CoordX.MIN, CoordX.MAX);
  var locationY = getRandomNum(CoordY.MIN, CoordY.MAX);
  var promo = {};

  promo.author = {
    avatar: 'img/avatars/user0' + (i + 1) + '.png'
  };

  promo.location = {
    x: locationX,
    y: locationY
  };

  promo.offer = {
    title: getRandomItem(OFFER_TITLES, true),
    adress: locationX + ', ' + locationY,
    price: getRandomNum(Price.MIN, Price.MAX),
    type: getRandomItem(OFFER_TYPES),
    rooms: getRandomNum(1, MAX_ROOMS),
    guests: getRandomNum(1, MAX_GUESTS),
    checkin: getRandomNum(Time.MIN, Time.MAX) + ':00',
    checkout: getRandomNum(Time.MIN, Time.MAX) + ':00',
    features: getRandomArray(OFFER_FEATURES),
    description: '',
    photos: []
  };
  return promo;
};

var generateAdvertisements = function (amount) {
  var arrayOfAdvertisements = [];

  for (var i = 0; i < amount; i++) {
    arrayOfAdvertisements[i] = generatePromo(i);
  }

  return arrayOfAdvertisements;
};

var advertisments = generateAdvertisements(MAX_OBJ);

var map = document.querySelector('.map');
var template = document.querySelector('template').content.querySelector('article.map__card');
var pinTemplate = document.querySelector('template').content.querySelector('button.map__pin');

var createPin = function (data) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.cssText = 'left: ' + data.location.x + 'px; top:' + data.location.y + 'px;';
  pinElement.querySelector('img').src = data.author.avatar;

  return pinElement;
};

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  var mapPins = document.querySelector('.map__pins');
  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(createPin(pins[i]));
  }

  mapPins.appendChild(fragment);
};

var generateFeaturesList = function (featuresArray) {
  var featuresList = '';
  for (var i = 0; i < featuresArray.length; i++) {
    featuresList = '<li class="feature feature--' + featuresArray[i] + '"></li>' + featuresList;
  }
  return featuresList;
};

var createAdvertisement = function (data) {
  var offersElement = template.cloneNode(true);

  offersElement.querySelector('h3').textContent = data.offer.title;
  offersElement.querySelector('p > small').textContent = data.offer.adress;
  offersElement.querySelector('.popup__price').innerHTML = data.offer.price + '&#x20bd;/ночь';
  offersElement.querySelector('h4').textContent = AppartmentTypes[data.offer.type];
  offersElement.querySelector('h4 + p').textContent = 'комнаты: ' + data.offer.rooms + ' для ' + data.offer.guests + ' гостей';
  offersElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  offersElement.querySelector('.popup__features + p').textContent = data.offer.description;
  offersElement.querySelector('img').src = data.author.avatar;
  offersElement.querySelector('.popup__features').innerHTML = generateFeaturesList(data.offer.features);

  return offersElement;
};

var renderAdvertisements = function (array, index) {
  var mapFilter = document.querySelector('.map__filters-container');

  map.insertBefore(createAdvertisement(array[index]), mapFilter);
};

var fillMap = function () {
  renderAdvertisements(advertisments, 0);
  renderPins(advertisments);

  map.classList.remove('map--faded');
};

fillMap();
