# smart-contract-slicer

> :scissors: Utility for slicing contracts into pieces.


## Install
```
$ npm install @andstor/smart-contract-slicer
```

## Usage
```js
import { Slicer } from '@andstor/smart-contract-slicer';

const input = `
contract test {
    uint256 a;
    function f1() {
        return 1;
    }
    function f2() {
        return 2;
    }
}
`
let slices = slicer.sliceAtNode("FunctionDefinition", 1, "firstLine")
console.log(slices)[0]
/*
    contract test {
        uint256 a;
    function f1() {
*/
```
## License

Copyright © 2022 [André Storhaug](https://github.com/andstor)

smart-contract-slicer is licensed under the [MIT License](https://github.com/andstor/smart-contract-slicer/blob/master/LICENSE).  
