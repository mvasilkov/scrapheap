import React from 'react';
import axios from 'axios';
import '../styles/style.scss'
import marked from 'marked';
import Link from 'next/link';

export default () => (
  <div className="container">
    <article>
      <h1>Welcome to Project TEXT</h1>
      <div><Link><a href='/post'>Add new longread</a></Link></div>
    </article>
  </div>
)

