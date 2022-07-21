import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// eslint-disable-next-line
import App from './App';
// eslint-disable-next-line
import Daily from './Daily/Daily';
import Login from './authentication/login';
import SignUp from './authentication/signup';


import {Todo} from './create-todo';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <SignUp />
    <Login />
    {/* <Daily /> */}
    <Todo/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
