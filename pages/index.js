import React from 'react';
import axios from 'axios';
import '../styles/style.scss'
import marked from 'marked';

export default class extends React.Component {
  static async getInitialProps({res, query}) {
    const { data } = await axios.get(
      `http://localhost:3000/longpaste/p/5aedc01b8a52e09bfb872d88`,
      { headers: { "Accept": "application/json"}
      }
    );
    if (data.code === 'ENOENT' ) {
      res.statusCode = 404;
      return {text: "404"};
    }

    return { text: data.contents }
  }

  render() {
    const { text } = this.props;
    return (
        <div className="container">
        <nav><a href='/post'>New</a><a>Get random</a></nav>
        <article dangerouslySetInnerHTML={{__html: marked(text)}}></article>
        </div>
    )
  }
}
