require('./lib/jspec')
sass = require('..')

JSpec
  .exec('spec/spec.core.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report()
