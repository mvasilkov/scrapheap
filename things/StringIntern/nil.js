#!/usr/bin/env node
'use strict'
const { heapUsed } = process.memoryUsage()
console.log((heapUsed * 1e-6).toFixed(2) + ' MB')
