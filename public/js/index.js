/*eslint-disable*/
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    updateSettings({ name, email }, 'data');
  });

if (userPasswordForm)
  document.querySelector('.btn--save-password').textContent = 'Updating...';
userPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const passwordCurrent = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;
  await updateSettings(
    { passwordCurrent, password, passwordConfirm },
    'password'
  );
  document.querySelector('.btn--save-password').textContent = 'Save Password';
  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';
});