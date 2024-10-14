function findSpecPartition(n, k, com) {
    switch (com) {
        case "max":
            return handleMax(n, k);
        case "min":
            return handleMin(n, k);
        default:
            return [];
    }
    function handleMin(n, k) {
        const arr = Array(k - 1).fill(1);
        arr.unshift(n - arr.length);
        return arr;
        
    }
    function handleMax(n, k) {
        let arr = Array(k).fill(Math.floor(n / k));
        const remainder = n % k;
        for (let index = 0; index < remainder; index++) {
            arr[index]++
        }
        return arr.sort((a, b) => b - a);

      
    }
   
}

console.log(findSpecPartition(10, 4, 'min'))
console.log(findSpecPartition(35, 15, 'max').reduce((total, number) => total + number, total = 0));
