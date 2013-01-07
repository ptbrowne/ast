function foo() {
  console.time('foo');
  return 'foo';
  console.timeEnd('foo');
}
function bar() {
  console.time('bar');
  return 'bar';
  console.timeEnd('bar');
}
