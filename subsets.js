function subset(arr) {
    length = Math.pow(2, arr.length) - 1;
    let subsets = [];
    for (let x = 1; x <= length; x++){
        let singleSubset = [];
        for (let y = 0; y <= arr.length ; y++){
            if ((1 << y) & x) {
                singleSubset.push(arr[y])
            }
        }
        subsets.push(singleSubset);

    }
    return subsets;
}
console.log(subset([1,2,3,4]))