import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

class Header extends Component {
  render() {
    return (
      <div className="container">
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to="/">
              <h2>{this.props.title}</h2>
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}
export default Header;
