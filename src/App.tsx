import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import style from './App.module.css'
import { Button } from 'antd';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className={style.red}>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button type="primary">Button</Button>
          </a>
        </header>
      </div>
    );
  }
}

export default App;
