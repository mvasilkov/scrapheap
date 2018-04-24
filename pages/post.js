import React from 'react';
import '../styles/style.scss'
import marked from 'marked';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }
  
  handleChange = (e) => {
    this.setState({text: e.target.value});
  }

  handleClick = (e) => {
    console.log('handleded');
  }

  render() {
    return (
      <div>
        <div className="controls">
          <button onClick={this.handleClick}>Save</button>
        </div>
        <div className="add-text">
          <textarea className="raw" onChange={this.handleChange}></textarea>
          <article className="preview" dangerouslySetInnerHTML={{__html: marked(this.state.text)}}></article>
        </div>
      </div>
    );
  }
}
