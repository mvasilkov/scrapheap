const cmark = require('@mvasilkov/cmark-gfm')
const { createMacro } = require('babel-plugin-macros')

/*
const getValue = path => {
    if (path.type === 'CallExpression') {
        return path.node.arguments[0].value
    }
    if (path.type === 'TaggedTemplateExpression') {
        return path.node.quasi.quasis[0].value.cooked
    }
    return null
}
*/

function render(string, babel) {
    const html = cmark.renderHtmlSync(string)
    const { ast } = babel.transformSync(`<React.Fragment>${html}</React.Fragment>`, {
        filename: 'ayy.js',
        code: false,
        ast: true,
    })
    return ast.program.body.filter(a => a.type != 'ImportDeclaration')
}

function mdMacro({ references, state, babel }) {
    references.default.forEach(({ parentPath }) => {
        switch (parentPath.type) {
            case 'TaggedTemplateExpression':
                replaceTagged(parentPath.get('quasi'), babel)
                break

            case 'CallExpression':
                replaceFunction(parentPath.get('arguments'), babel)
                break

            default:
                throw Error(`Can only be used as tagged template expression or function call. You tried ${parentPath.type}.`)
        }
    })
}

function replaceTagged(quasiPath, babel) {
    const string = quasiPath.parentPath.get('quasi').evaluate().value
    quasiPath.parentPath.replaceWithMultiple(render(string, babel))
}

function replaceFunction(argumentsPaths, babel) {
    const string = argumentsPaths[0].evaluate().value
    argumentsPaths[0].parentPath.replaceWithMultiple(render(string, babel))
}

module.exports = createMacro(mdMacro)
