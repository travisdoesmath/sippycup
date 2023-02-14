import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { src } from './init';

const root = ReactDOM.createRoot(document.getElementById('root'));
const baseUrl = "http://localhost:5050"

let projectName = 'untitled project'

const start = () => {
  root.render(
    <React.StrictMode>
      <App src={src} projectName={projectName}/>
    </React.StrictMode>
  );
}

if (window.location.pathname !== '/') {
  let name = window.location.pathname.slice(1);
  const validProjectName = (name) => /^[a-z]+-[a-z]+-[a-z]+$/.test(name);
  if (validProjectName(name)) {
    fetch(`${baseUrl}/api/get/${name}`)
    .then(res => res.json())
    .then(data => {
      if (data['index.html'] && data['app.py'] && data['style.css']) {
        src.html = data['index.html']
        src.python = data['app.py']
        src.css = data['style.css']
        projectName = name
      }
      start()
    })
  }
} else {
  start()
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
