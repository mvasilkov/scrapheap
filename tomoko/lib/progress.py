def progress_bar(val, end):
    progress = '#' * (24 * val // end)
    return '[%-24s]' % progress
