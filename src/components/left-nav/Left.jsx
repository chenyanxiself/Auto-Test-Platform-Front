import React, { Component } from 'react';
import Menus from '../menus/Menus'
import logo from './logo.png'
import './left.scss'

class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className='left-nav'>
                <header className='left-nav-header'>
                    <img src={logo} alt="logo"></img>
                    <h1>Auto Test</h1>
                </header>
                <Menus className='left-nav-body'/>
                
            </div>
        );
    }
}

export default LeftNav;