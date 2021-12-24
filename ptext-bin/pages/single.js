import React from 'react';
import axios from 'axios';
import '../styles/style.scss'
import marked from 'marked';

import ReactGA from 'react-ga';

export default class extends React.Component {
  static async getInitialProps({res, req, query: { id }}) {
    const { data } = await axios.get(
      `http://localhost:3000/longpaste/p/${id}`,
      { headers: { "Accept": "application/json"}
      }
    );
    if (data.code === 'ENOENT' ) {
      res.statusCode = 404;
      return {text: "404"};
    }
    return { text: data.contents }
  }

  componentDidMount() {
    ReactGA.initialize('UA-118769936-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const { text } = this.props;
    return (
        <div className="container">
        <article dangerouslySetInnerHTML={{__html: marked(text)}}></article>
        </div>
    )
  }
}
