function sum(a) {
	if (!sum.store) {
		sum.store = 0
	}
	sum.store += a
	sum.valueOf = function () {
		const output = sum.store
		delete sum.store
		return output
	}
	return sum
}