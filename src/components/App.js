import React, { Component } from 'react';
//import { Container } from 'react-bootstrap/lib/tab';
import logo from '../logo.png';
import './App.css';
import { Container } from 'semantic-ui-react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from './Header';
import Tokens from './Tokens.js';
import Loteria from './Loteria.js';
import Premios from './Premios.js';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  render() {
    return(
      <BrowserRouter>
        <Container>
          <Header/>
            <main>
              <Routes>
                <Route exact path="/" element={<Tokens/>}/>
                <Route exact path="/loteria" element={<Loteria/>}/>
                <Route exact path="/premios" element={<Premios/>}/>
              </Routes>
            </main>
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;
