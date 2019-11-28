#!/usr/bin/env node
'use strict'

const { run } = require('./javascript/app')

if (require.main === module) {
    run()
}
