class LazyGraph {
	constructor() {
	}

	receiveGraph(graph) {
		this.graph = graph;
		this.arrKeys = Object.keys(graph);
		var funcVars = [];
		var funcVarsStrict = []
		var auxil = [];
		for (var i = 0; i < this.arrKeys.length; i++) {
			auxil = (graph[this.arrKeys[i]]).toString().match(/(\()(.*?)(\))/)[2].replace(/\s/g,"").split(',')
			funcVarsStrict[funcVarsStrict.length] = auxil
			for (var j = 0; j < auxil.length; j++) {
				funcVars[funcVars.length] = auxil[j]
			}
		}
		this.arrKeysFuncStrictVars = funcVarsStrict
		funcVars = funcVars.filter((item, pos, self) => self.indexOf(item) == pos)
		this.arrKeysFuncVars = funcVars
		return this
	}

	calcVertex(vertexName) {
		if (this.arrKeysFuncVars.indexOf("") == -1) {
			return console.log('не введен массив для расчета')
		}
		for (var i = 0; i < this.arrKeysFuncVars.length; i++) {
				if ((this.arrKeys.indexOf(this.arrKeysFuncVars[i]) == -1) & (this.arrKeysFuncVars[i].length != 0)) {
					return console.log('найдены аргументы функций, которых нет среди ключей')
				}
		}
		var loopCheck = this.arrKeysFuncVars
		var loopHelper = []
		for (var i = 0; i < this.arrKeys.length; i++) {
			for (var j = 0; j < loopCheck.length; j++) {
				if (loopCheck[j] == "") {
					continue
				}
				else {
					for (var k = 0; k < this.arrKeysFuncStrictVars[this.arrKeys.indexOf(loopCheck[j])].length; k++) {
						loopHelper[loopHelper.length] = 
						this.arrKeysFuncStrictVars[this.arrKeys.indexOf(loopCheck[j])][k]
					}
				}
			}
			loopHelper = loopHelper.filter((item, pos, self) => self.indexOf(item) == pos)
			loopCheck = loopHelper
			loopHelper = []
		}
		if (loopCheck.length != 0) {
			return console.log('возможно петлевая зависимость')
		}

		var answer = {}
		var argFunc = []
		done: while (Object.keys(answer).length != this.arrKeys.length) {
			for (var i = 0; i < this.arrKeysFuncStrictVars.length; i++) {
				argFunc = []
				for (var j = 0; j < this.arrKeysFuncStrictVars[i].length; j++) {
					if (this.arrKeysFuncStrictVars[i][j].length == 0 & answer[this.arrKeys[i]] == undefined) {
						answer[this.arrKeys[i]] = this.graph[this.arrKeys[i]]()
					}
					if (answer[this.arrKeysFuncStrictVars[i][j]] == undefined) {
						break
					}
					else {
						argFunc[argFunc.length] = answer[this.arrKeysFuncStrictVars[i][j]]
					}
				if (j == this.arrKeysFuncStrictVars[i].length-1) {
					answer[this.arrKeys[i]] = this.graph[this.arrKeys[i]].apply(this, argFunc)
				}
				if (answer[vertexName] != undefined) {
					break done;
				}
				}
			}
		}
		return answer[vertexName]
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