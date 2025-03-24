'use strict';

const body = document.querySelector('body');

const firstPromise = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    reject(new Error('First promise was rejected'));
  }, 3000);

  document.addEventListener(
    'click',
    () => {
      clearTimeout(timeout);
      resolve('First promise was resolved');
    },
    { once: true },
  );
});

firstPromise
  .then((message) => {
    showMessage(message, 'success');
  })
  .catch((error) => {
    showMessage(error.message, 'error');
  });

const secondPromise = new Promise((resolve) => {
  const handler = () => {
    resolve('Second promise was resolved');
    removeListeners();
  };

  document.addEventListener('click', handler, { once: true });

  document.addEventListener('contextmenu', handler, {
    once: true,
  });

  function removeListeners() {
    document.removeEventListener('click', handler);
    document.removeEventListener('contextmenu', handler);
  }
});

secondPromise.then((message) => {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.classList.add('success');

  div.textContent = message;

  body.appendChild(div);
});

const thirdPromise = new Promise((resolve) => {
  let leftClick = false;
  let rightClick = false;

  function checkResolve() {
    if (leftClick && rightClick) {
      resolve('Third promise was resolved');
      document.removeEventListener('click', onleftClick);
      document.removeEventListener('contextmenu', onRightClick);
    }
  }

  function onleftClick() {
    leftClick = true;
    checkResolve();
  }

  function onRightClick() {
    event.preventDefault();
    rightClick = true;
    checkResolve();
  }

  document.addEventListener('click', onleftClick);
  document.addEventListener('contextmenu', onRightClick);
});

thirdPromise.then((message) => {
  showMessage(message, 'success');
});

function showMessage(message, className) {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.classList.add(className);

  div.textContent = message;

  body.appendChild(div);
}
