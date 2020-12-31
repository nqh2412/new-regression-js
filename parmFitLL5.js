parmFitLL5 = function (initialParms, x, y, Opt){
	if (!Opt) { Opt = {} };
	if (!Opt.maxIter) { Opt.maxIter = 1000 };
	if (!Opt.step) {// initial step is 1/100 of initial value (remember not to use zero in Parm0)
		Opt.step = initialParms.map(function (p) { return p / 100 });
		Opt.step = Opt.step.map(function (si) { if (si == 0) { return 1 } else { return si } });
	};
	if (typeof (Opt.display) == 'undefined') { Opt.display = true };
	if (!Opt.loss) { //Sample Standard Deviation
		Opt.loss = (y, yp) => {
			const sqrError = y.map((yi, i) => (yi - yp[i]) ** 2);
			const meanSqrError = sqrError.reduce((a, b) => a + b) / sqrError.length;
			return Math.sqrt(meanSqrError);}
	}
	//5PL-logistic equation y = c + (c-d)/(1 + exp(b*(log(x) - log(e))))**f
	const equation = function (x, P) {
		return x.map(function (xi) {
			return P[1] + (P[2] - P[1]) /
				((1 + Math.exp(P[0] * (Math.log(xi) - Math.log(P[3])))) ** P[4])
		})
	};
	let cloneVector = function (V) { return V.map(function (v) { return v }) };
	let P0 = cloneVector(initialParms), P1 = cloneVector(initialParms);
	let n = P0.length;
	let step = Opt.step;
	let funParm = function (P) { return Opt.loss(y, equation(x, P)) }
	//function (of Parameters) to minimize
	// silly multi-univariate screening
	for (let i = 0; i < Opt.maxIter; i++) {
		for (let j = 0; j < n; j++) { // take a step for each parameter
			P1 = cloneVector(P0);
			P1[j] += step[j];
			if (funParm(P1) < funParm(P0)) { // if parm value going in the righ direction
				step[j] = 1.2 * step[j]; // then go a little faster
				P0 = cloneVector(P1);
			}
			else {
				step[j] = -(0.5 * step[j]); // otherwiese reverse and go slower
			}
		}
		if (Opt.display) { if (i > (Opt.maxIter - 10)) { console.log(i + 1, funParm(P0), P0) } }
	}
	return P0
};

//Example
//Data set
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const y = [100, 73.39, 73.39, 91.79, 122.11, 96.24, 100.62, 82.71, 202.3,221.76, 225.49, 198.01, 221.76, 221.76, 229.17, 232.8, 205.64, 209.38, 209.38, 213.07]

//Set initial values for Parameters
const xMin = Math.min.apply(Math, x);
const xMax = Math.max.apply(Math, x);
const yMin = Math.min.apply(Math, y);
const yMax = Math.max.apply(Math, y);
const xMid = (xMax-xMin) / 2;
const slope = (yMax - yMin) / (xMax - xMin)

//P[1] + (P[2] - P[1]) / ((1 + Math.exp(P[0] * (Math.log(xi) - Math.log(P[3])))) ** P[4])
// P[0] is slope of the curve, it should start at slope = (yMax - yMin) / (xMax - xMin)
// P[1] is top asymetope: yMax
// P[2] is botom asymetope: yMin
// P[3] is inflextion point, best start is at the middle of x: (xMax -xMin)/2
// P[4] is the additional parameter which allows it to be asymmetric: > 0

const initialParms = [slope, yMax, yMin, xMid, 0]

predParms = parmFitLL5(initialParms, x, y, {
	maxIter: 100,
	//display: false,
});

console.log(predParms);
