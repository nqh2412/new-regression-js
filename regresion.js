//linear: y = a + bx
const linear = (x, P) => x.map((xi) => P[0] + P[1] * xi);
//2nd order polynomial: y = a + bx + cx**2
const polynomialSecond = (x, P) => x.map((xi) => P[0] + P[1] * xi + P[2] * (x ** 2));
//3rd order polynomial: y = a + bx + cx**2 + dx**3
const polynomialThird = (x, P) => x.map((xi) => P[0] + P[1] * xi + P[2] * (x ** 2) + P[3] * (x ** 3));
//4th order polynomial: y = a + bx + cx**2 + dx**3 +ex**4
const polynomialFourth = (x, P) => x.map((xi) => P[0] + P[1] * xi + P[2] * (x ** 2) + P[3] * (x ** 3) + P[4] * (x ** 4));
//5th order polynomial: y = a + bx + cx**2 + dx**3 + ex**4 + fx**5
const polynomialFifth = (x, P) => x.map((xi) => P[0] + P[1] * xi + P[2] * (x ** 2) + P[3] * (x ** 3) + P[4] * (x ** 4) + P[5] * (x ** 5));

//Non-linear: 4PL - Symmetrical sigmoidal curve: 
//Non-linear: 5PL - Asymmetrical sigmoidal curve: y = c + (c-d)/(1 + exp(b*(log(x) - log(e))))**f
const log5PL = (x, P) => x.map((xi) => P[1] + (P[2] - P[1]) / ((1 + Math.exp(P[0] * (Math.log(xi) - Math.log(P[3])))) ** P[4]));
//Non-linear: 6PL -  sigmoidal curve: 
//Non-linear: 7PL -  sigmoidal curve: 


fitParms = function (fitMethod, x, y, Opt) {
    const xMin = Math.min.apply(Math, x);
    const xMax = Math.max.apply(Math, x);
    const yMin = Math.min.apply(Math, y);
    const yMax = Math.max.apply(Math, y);
    const xMid = (xMax - xMin) / 2;
    const slope = (yMax - yMin) / (xMax - xMin);
    //Set initial Parms depend on fitMethods
    // let initialParms;
    let initialParms = [];
    if (fitMethod == linear) {
        initialParms = [slope, yMin];
    } else if (fitMethod == polynomialSecond) {

    } else if (fitMethod == polynomialThird) {

    } else if (fitMethod == polynomialFourth) {

    } else if (fitMethod == polynomialFifth) {

    } else if (fitMethod == log5PL) {
        initialParms = [slope, yMax, yMin, xMid, 0]
    } else { "Nothing" };

    //Optional 

    if (!Opt) { Opt = {}; };
    if (!Opt.maxIter) { Opt.maxIter = 1000; };
    if (!Opt.step) { // initial step is 1/100 of initial value (remember not to use zero in Parm0)
        Opt.step = initialParms.map(function (p) { return p / 100; });
        Opt.step = Opt.step.map(function (si) { if (si == 0) { return 1; } else { return si; } });
    };
    if (typeof (Opt.display) == 'undefined') { Opt.display = true; };

    if (!Opt.loss) { //Root Mean Square Error
        Opt.loss = (y, yp) => {
            const sqrError = y.map((yi, i) => (yi - yp[i]) ** 2);
            const meanSqrError = sqrError.reduce((a, b) => a + b) / sqrError.length;
            return Math.sqrt(meanSqrError);
        }
    }
    let cloneVector = function (V) { return V.map(function (v) { return v; }); };
    let P0 = cloneVector(initialParms), P1 = cloneVector(initialParms);
    let n = P0.length;
    let step = Opt.step;
    let funParm = function (P) { return Opt.loss(y, fitMethod(x, P)); };
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
        if (Opt.display) { if (i > (Opt.maxIter - 10)) { console.log(i + 1, funParm(P0), P0); } }
    }
    return P0;
};

//Example
//Data set
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const y = [100, 73.39, 73.39, 91.79, 122.11, 96.24, 100.62, 82.71, 202.3, 221.76, 225.49, 198.01, 221.76, 221.76, 229.17, 232.8, 205.64, 209.38, 209.38, 213.07];

fitParms(linear, x, y, { maxIter: 100 });

console.log(fitParms(linear, x, y, { maxIter: 100 }));
