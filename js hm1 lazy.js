class Graph {
    receiveGraph(graph) {
        this.graph = graph
        this.keys = Object.keys(graph)
        this.calcedVertexes = {}
        this.keysArguments = []

        let keysNoArguments = true
        this.keys.forEach(key => {
            let singleKeyArguments = (graph[key]).toString().match(/(\()(.*?)(\))/)[2].replace(/\s/g,"").split(',')
            this.keysArguments.push(singleKeyArguments)
            singleKeyArguments.forEach(argument => {
                if (argument === "") {
                    keysNoArguments = false
                }
                else if (!this.keys.includes(argument)) {
                    throw new Error(`найдены аргументы функций, которых нет среди ключей: ${argument}`)
                }
            })
        })
        if (keysNoArguments) {
            throw new Error('невозможно произвести расчет, должна быть хотя бы одна независимая вершина')
        }
        function loopCheck(vertexName, keysArguments, keys, depth=0) {
            depth++
            let examineVars = keysArguments[keys.indexOf(vertexName)]
            examineVars.forEach((vertexArgument) => {
                if (vertexArgument !== "") {
                    if (depth >= keys.length) {
                        throw new Error(`присутсвуют вершины, которые циклически зависят друг от друга: ${vertexName}`)
                    }
                    else {
                        return loopCheck(vertexArgument, keysArguments, keys, depth)
                    }
                }
            })
        }
        this.keys.forEach(key => loopCheck(key, this.keysArguments, this.keys))
        
        return this
    }

    vertexValueSearch(vertexName) {
        if (vertexName in this.calcedVertexes) {
            return this.calcedVertexes[vertexName]
        }
        let argFunc = []
        let examineVars = this.keysArguments[this.keys.indexOf(vertexName)]
        examineVars.forEach(vertexArgument => {
            if (!(vertexName in this.calcedVertexes) && vertexArgument === "") {
                this.calcedVertexes[vertexName] = this.graph[vertexName]()
            }
            else if (!(vertexArgument in this.calcedVertexes)) {
                this.vertexValueSearch(vertexArgument)
                argFunc.push(this.calcedVertexes[vertexArgument])
            }
            else {
                argFunc.push(this.calcedVertexes[vertexArgument])
            }
        })
        this.calcedVertexes[vertexName] = this.graph[vertexName].apply(this, argFunc)
        return this.calcedVertexes[vertexName]
    }
}


class LazyGraph extends Graph {
    calcVertex(vertexName) {
        if (!this.keys.includes(vertexName)) {
            throw new Error(`нет такой вершины: ${vertexName}`)
        }
        this.vertexValueSearch(vertexName)
        return this.calcedVertexes[vertexName]
    }
}




const x = [1, 2, 3, 6]
const Igraph = {
    xs: () => x,

    n: (xs) => xs.length,
    m: (xs, n) => xs.reduce((accumul, currVal) => accumul + currVal) / n,
    m2: (xs, n) => xs.reduce((accumul, currVal) => accumul + currVal * currVal) / n,
    v: function(m, m2) {
        return m2 - m * m;
    },
};

(new LazyGraph()).receiveGraph(Igraph).calcVertex('m2')