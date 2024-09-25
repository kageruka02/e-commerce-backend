function vectorAffinity(xs, ys) {
  let x = 0;
  xs.map((number, index) => {
    ys[index] !== 'undefined' && number === ys[index] ? x++ : x 
    console.log("hello")
    return number;
    
  })
  if (x === 0 && xs.length === 0 && ys.length === 0) {
    return x;
  }
  return  xs.length >=  ys.length ? x/xs.length : x/ys.length ;
  
}
// console.log(vectorAffinity([1, 2, 3, 4, 5], [1, 2, 2, 4, 3])); // Expected: 3/5
// console.log(vectorAffinity([1, 2, 3], [1, 2, 3])); // Expected: 1
// console.log(vectorAffinity([1, 2, 3], [1, 2, 3, 4, 5])); // Expected: 3/5
// console.log(vectorAffinity([1, 2, 3, 4], [1, 2, 3, 5])); // Expected: 3/4
// console.log(vectorAffinity([6, 6, 6, 6, 6, 6], [6])); // Expected: 1/6
// console.log(vectorAffinity([null], [])); // Expected: 0
// console.log(vectorAffinity([null], [null])); // Expected: 1
// console.log(vectorAffinity([null], [null, null])); // Expected: 1/2
console.log(vectorAffinity([], [])); // Expected: 1
