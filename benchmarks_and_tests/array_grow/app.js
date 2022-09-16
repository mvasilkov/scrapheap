const Benchmark = require('benchmark')

const { PriorityQueue } = require('./PriorityQueue.js')
const { PriorityQueueNoGrow } = require('./PriorityQueueNoGrow.js')

const list = Array.from({ length: 1000 }, function () {
  return Math.random()
})

const suite = new Benchmark.Suite

suite
  .add('grow', function () {

    const q = new PriorityQueue({
      comparatorFn: (a, b) => a - b,
      initialValues: list.slice(),
    })

  })
  .add('no grow', function () {

    const q = new PriorityQueueNoGrow({
      comparatorFn: (a, b) => a - b,
      initialValues: list.slice(),
    })

  })
  .on('cycle', function (event) {
    console.log('' + event.target)
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ 'async': false })
