$('code[data-copy-contents]').each(function () {
    var $this = $(this)
    var $copy_from = $('#' + $this.data('copy-contents'))
    var lines = $copy_from.html().split('\n')
    if (!lines.length)
        return

    if (!lines[0] || lines[0].trim() == '')
        lines.shift()
    if (!lines.length)
        return

    if (!lines[lines.length - 1] || lines[lines.length - 1].trim() == '')
        lines.pop()
    if (!lines.length)
        return

    var indent = lines[0].match(/^(\s*)/)[1]
    lines = lines.map(function (x) {
        return x
        .replace(indent, '')
        .replace(/\bchecked=""/, 'checked')
        .replace(/\bdisabled=""/, 'disabled')
    })
    this.appendChild(document.createTextNode(lines.join('\n')))
})
