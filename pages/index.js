import '../styles/style.scss'
import marked from 'marked';

export default () => {
  const text = '# Marked in the browser\n\nRendered by **marked**.';
  return (
    <div className="container">
      <nav>some links</nav>
      <header></header>
      <article dangerouslySetInnerHTML={{__html: marked(text)}}></article>
    </div>
  )
}
