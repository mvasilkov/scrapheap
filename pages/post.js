import axios from 'axios';
import React from 'react';
import '../styles/style.scss'
import marked from 'marked';
import Link from 'next/link';
import 'isomorphic-fetch'

import jwtDecode from 'jwt-decode'

import { solve } from 'longpaste/scripts/pow'

const defaults = {
    credentials: 'same-origin',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
    },
}

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      url: "",
      schema: "palatino"
    };
    this.submit = this.submit.bind(this);
  }
  
  static async getInitialProps({ req }) {
    // Development only
    const host = req ? 'http://' + req.headers['host'] : ''

    // Get the Longpaste challenge
    let ch = await fetch(`${host}/longpaste`, defaults)
    ch = await ch.json() // { token: '...' }
    return { host, ...ch }
  }

  handleChange = (e) => {
    this.setState({text: e.target.value});
  }

  async submit(event) {
    const { host, token } = this.props;
    const { salt, n } = jwtDecode(token)

    const contents = this.state.text; //'# hello, world'
    
    solve(salt, n, contents, async nonce => {
      const body = JSON.stringify({
        token,
        contents,
        nonce,
      })
      let res = await fetch(`${host}/longpaste/p`, {
        method: 'post',
        body,
        maxRedirects: 0,
        ...defaults
      })
      console.log('1', res)
      const link = document.createElement('a');
      link.href = res.url;
      link.pathname = link.pathname.replace("/longpaste/p", "");
      window.location.href = link;
    })
  }
  
  changeFont = (e) => {
    this.setState({schema: e.target.value});
  }

  render() {
    return (
      <div className='wrapper'>
        <div className="controls">
          <div><select onChange={this.changeFont}>
              <option value='palatino'>Palatino</option>
              <option value='garamond'>Garamond</option>
              <option value='bookman'>Bookman</option>
          </select></div>
          <button onClick={this.submit}>Save</button>
        </div>
        <div className="add-text">
          <textarea className="raw" onChange={this.handleChange}></textarea>
        <article className={`preview ${this.state.schema}`} dangerouslySetInnerHTML={{__html: marked(this.state.text)}}></article>
        </div>
      </div>
    );
  }
}
