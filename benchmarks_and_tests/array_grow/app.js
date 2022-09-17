import assert from 'assert/strict'

import Benchmark from 'benchmark'
import { heapsort, PriorityQueue as NPriorityQueue } from 'natlib/collections/PriorityQueue.js'

import { PriorityQueue } from './out/PriorityQueue.js'
import { PriorityQueueNG } from './out/PriorityQueueNG.js'

const list = Array.from({ length: 1000 }, function () {
  return Math.random()
})

const suite = new Benchmark.Suite

let result1
let result2
let result3

suite
  .add('grow', function () {

    const q = new PriorityQueue({
      comparatorFn: (a, b) => a - b,
      initialValues: list.slice(),
    })
    result1 = q.heapsort()

  })
  .add('no grow', function () {

    const q = new PriorityQueueNG({
      comparatorFn: (a, b) => a - b,
      initialValues: list.slice(),
    })
    result2 = q.heapsort()

  })
  .add('natlib', function () {

    // const q = new NPriorityQueue(
    //   (a, b) => a - b,
    //   list.slice(),
    // )
    result3 = heapsort(
      (a, b) => a - b,
      list.slice(),
    )

  })
  .on('cycle', function (event) {
    console.log('' + event.target)
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ 'async': false })

// Check the results

assert(result1.length === 1000)
assert(result2.length === 1000)
assert(result3.length === 1000)

list.sort((a, b) => a - b)

for (let n = 0; n < 1000; ++n) {
  assert(list[n] === result1[n])
  assert(list[n] === result2[n])
  assert(list[n] === result3[n])

  if (n % 100 === 0) console.log(`Checked ${n}`)
}
