import parser from '@solidity-parser/parser';

function countNodes(node, type) {
    let count = 0;
    parser.visit(node, {
        [type]: function (node) {
            count++
        }
    });
    return count;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export class Slicer {
    constructor(input) {
        this.input = input;
        try {
            let options = { tolerant: false, loc: false, range: true }
            this.ast = parser.parse(input, options)
        } catch (e) {
            if (e instanceof parser.ParserError) {
                console.error(e.errors)
            }
            console.error("\x1b[31m%s\x1b[0m", e.message)
        }
    }

    /**
     * Slice the contract at the character index
     * @param {number} index The character index to slice at. -1 means random.
     * @returns {string}
     */
    slice(index = -1) {
        if (index == -1) {
            index = getRandomInt(1, this.input.length+1);
        }
        let code1 = this.input.substring(0, index);
        let code2 = this.input.substring(index, this.input.length);
        return [code1, code2];
    }

    /**
     * Slices the contract at the specified line (inclusive)
     * @param {number} line The line to slice at. -1 means random.
     * @returns {[string, string]}
     */
    sliceAtLine(line = -1) {
        var re = /\n/g;
        let match = null;
        let lines = [];
        while ((match = re.exec(this.input)) != null) {
            lines.push(match.index);
        }

        if (line == -1) {
            line = getRandomInt(1, lines.length+1);
        }
        return this.slice(lines[line-1])
    }

    /**
     * Slice the contract at the specified occurence of a specific node type
     * @param {import('@solidity-parser/parser/dist/src/ast-types').ASTNode} type The type of node to slice at
     * @param {number} index The index of the node to slice at. -1 means random.
     * @param {string} location
     * @returns 
     */
    sliceAtNode(type, index, location) {
        let numNodes = countNodes(this.ast, type);
        if (index == -1) {
            index = getRandomInt(1, numNodes+1);
        }
        if (index > numNodes) {
            console.log("Index out of range")
        }
        
        let code = this.input;
        let occurrence = 0
        let cut = null
        parser.visit(this.ast, {
            [type]: function (node) {
                if (occurrence + 1 == index) {
                    switch (location) {
                        case 'before':
                            cut = node.range[0]
                            break;
                        case 'firstLine':
                            // split and get string untill the first newline
                            cut = node.range[0]
                            let lineCut = code.indexOf("\n", cut);
                            if (lineCut != -1) {
                                cut = lineCut
                            }
                            break;
                        case 'after':
                            cut = node.range[1]
                        default:
                            cut = node.range[1]
                            break;
                    }
                }
                occurrence++
            }
        });
        return this.slice(cut);
    }

}
