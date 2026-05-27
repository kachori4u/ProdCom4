const { defineConfig } = require('vite');
const http = require('http');

/**
 * ============================================================
 * MYNTRA AI STYLE MIRROR — fit-ml-engine.js
 * ============================================================
 */

let currentSeed = 1;
function seededRandom() {
  const x = Math.sin(currentSeed++) * 10000;
  return x - Math.floor(x);
}

class TreeNode {
  constructor(feature = null, threshold = null, left = null, right = null, value = null) {
    this.feature = feature;
    this.threshold = threshold;
    this.left = left;
    this.right = right;
    this.value = value;
  }
}

class DecisionTreeRegressor {
  constructor(maxDepth = 6, minSamplesSplit = 2) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
    this.root = null;
  }

  fit(X, y) {
    this.root = this._buildTree(X, y, 0);
  }

  _buildTree(X, y, depth) {
    const n = X.length;
    if (n === 0) return null;
    if (depth >= this.maxDepth || n < this.minSamplesSplit || this._variance(y) < 1e-4) {
      return new TreeNode(null, null, null, null, this._mean(y));
    }

    const numFeatures = X[0].length;
    let bestFeature = null, bestThreshold = null, bestVR = -1;
    let bestLeft = null, bestRight = null;
    const curVar = this._variance(y);

    for (let f = 0; f < numFeatures; f++) {
      const vals = [...new Set(X.map(r => r[f]))].sort((a, b) => a - b);
      for (let i = 0; i < vals.length - 1; i++) {
        const threshold = (vals[i] + vals[i + 1]) / 2;
        const leftIdx = [], rightIdx = [];
        for (let k = 0; k < n; k++) {
          (X[k][f] <= threshold ? leftIdx : rightIdx).push(k);
        }
        if (!leftIdx.length || !rightIdx.length) continue;
        const wl = leftIdx.length / n, wr = rightIdx.length / n;
        const vr = curVar - wl * this._variance(leftIdx.map(i => y[i])) - wr * this._variance(rightIdx.map(i => y[i]));
        if (vr > bestVR) { bestVR = vr; bestFeature = f; bestThreshold = threshold; bestLeft = leftIdx; bestRight = rightIdx; }
      }
    }

    if (bestVR <= 0) return new TreeNode(null, null, null, null, this._mean(y));

    return new TreeNode(
      bestFeature, bestThreshold,
      this._buildTree(bestLeft.map(i => X[i]), bestLeft.map(i => y[i]), depth + 1),
      this._buildTree(bestRight.map(i => X[i]), bestRight.map(i => y[i]), depth + 1),
      null
    );
  }

  predictRow(node, row) {
    if (!node || node.value !== null) return node ? node.value : 0;
    return row[node.feature] <= node.threshold
      ? this.predictRow(node.left, row)
      : this.predictRow(node.right, row);
  }

  _mean(arr) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
  _variance(arr) {
    if (!arr.length) return 0;
    const avg = this._mean(arr);
    return arr.reduce((s, v) => s + (v - avg) ** 2, 0) / arr.length;
  }
}

class RandomForestRegressor {
  constructor(numTrees = 10, maxDepth = 7) {
    this.numTrees = numTrees;
    this.maxDepth = maxDepth;
    this.trees = [];
  }

  fit(X, y) {
    this.trees = [];
    for (let i = 0; i < this.numTrees; i++) {
      const Xs = [], ys = [];
      for (let j = 0; j < X.length; j++) {
        const idx = Math.floor(seededRandom() * X.length);
        Xs.push(X[idx]); ys.push(y[idx]);
      }
      const tree = new DecisionTreeRegressor(this.maxDepth);
      tree.fit(Xs, ys);
      this.trees.push(tree);
    }
  }

  predict(row) {
    const sum = this.trees.reduce((s, t) => s + t.predictRow(t.root, row), 0);
    return sum / this.trees.length;
  }
}

function featureExtractor(body, garment) {
  const bodyHip = body.hip ?? body.hips ?? 0;
  const garmentHip = garment.hip ?? garment.hips ?? 0;
  const fitType = garment.fit_type || 'regular';
  const idealEase = fitType === 'slim' ? 2 : fitType === 'loose' ? 6 : 3.5;

  let hipDiff = (bodyHip > 0 && garmentHip > 0) ? (garmentHip - bodyHip) : idealEase;

  return [
    (garment.chest ?? 0) - (body.chest ?? 0),
    (garment.waist ?? 0) - (body.waist ?? 0),
    hipDiff,
    garment.fabric_stretch ?? 0.1,
    garment.fit_type === 'slim' ? 1 : 0,
    garment.fit_type === 'regular' ? 1 : 0,
    garment.fit_type === 'loose' ? 1 : 0
  ];
}

function calculateHeuristic(body, garment) {
  const fitType = garment.fit_type || 'regular';
  const stretch = garment.fabric_stretch ?? 0.1;
  const idealEase = fitType === 'slim' ? 2 : fitType === 'loose' ? 6 : 3.5;

  const bodyChest = body.chest ?? null;
  const garmentChest = garment.chest ?? null;
  const bodyWaist = body.waist ?? null;
  const garmentWaist = garment.waist ?? null;
  const bodyHip = body.hip ?? body.hips ?? null;
  const garmentHip = garment.hip ?? garment.hips ?? null;

  const chestDev = (bodyChest !== null && garmentChest !== null && !isNaN(bodyChest) && !isNaN(garmentChest)) ? (garmentChest - bodyChest) - idealEase : null;
  const waistDev = (bodyWaist !== null && garmentWaist !== null && !isNaN(bodyWaist) && !isNaN(garmentWaist)) ? (garmentWaist - bodyWaist) - idealEase : null;
  const hipDev = (bodyHip !== null && garmentHip !== null && !isNaN(bodyHip) && !isNaN(garmentHip)) ? (garmentHip - bodyHip) - idealEase : null;

  const devs = [chestDev, waistDev, hipDev].filter(v => v !== null && !isNaN(v));
  if (devs.length === 0) return 0;

  const minDev = Math.min(...devs);
  const avgDev = devs.reduce((s, v) => s + v, 0) / devs.length;
  const rawDev = minDev < 0 ? minDev : avgDev;

  const score = rawDev < 0 ? rawDev * (1 - stretch) : rawDev;
  return Math.round(score * 7.5);
}

const forest = new RandomForestRegressor(10, 7);

function initializeModel() {
  currentSeed = 1;
  const X = [], y = [];
  const fitTypes = ['slim', 'regular', 'loose'];

  for (let i = 0; i < 600; i++) {
    const bodyChest = 30 + seededRandom() * 25;
    const bodyWaist = 24 + seededRandom() * 22;
    const bodyHip = 32 + seededRandom() * 22;
    const fitType = fitTypes[Math.floor(seededRandom() * 3)];
    const stretch = seededRandom() * 0.45;

    const garment = {
      chest: bodyChest + (-6 + seededRandom() * 18),
      waist: bodyWaist + (-6 + seededRandom() * 18),
      hip: bodyHip + (-6 + seededRandom() * 18),
      fit_type: fitType,
      fabric_stretch: stretch
    };

    const body = { chest: bodyChest, waist: bodyWaist, hip: bodyHip };
    X.push(featureExtractor(body, garment));
    y.push(calculateHeuristic(body, garment));
  }

  forest.fit(X, y);
  console.log('✅ Fit ML model trained on 600 synthetic samples');
}

initializeModel();

function predictFit(body, garment) {
  body = { ...body, hips: body.hip ?? body.hips };
  garment = { ...garment, hips: garment.hip ?? garment.hips };

  const features = featureExtractor(body, garment);
  const mlScore = forest.predict(features);
  const heuristicScore = calculateHeuristic(body, garment);

  let tightness_score;
  if (Math.abs(mlScore - heuristicScore) < 8) {
    tightness_score = heuristicScore;
  } else {
    tightness_score = Math.round(mlScore * 0.6 + heuristicScore * 0.4);
  }

  const fit_percentage = Math.max(0, Math.min(100, Math.round(100 - Math.abs(tightness_score))));

  let fit_label;
  if (tightness_score <= -15) fit_label = 'Too Tight';
  else if (tightness_score < -4) fit_label = 'Slightly Tight';
  else if (tightness_score <= 4) fit_label = 'Perfect Fit';
  else if (tightness_score < 15) fit_label = 'Slightly Loose';
  else fit_label = 'Too Loose';

  return { fit_percentage, fit_label, tightness_score };
}

// --- UNIT TESTING MECHANISM ---
function runUnitTests() {
  console.log('=== Running Unit Tests on ML Fit Engine ===');
  const testCases = [
    {
      name: 'Goal Input Case (Slightly Tight)',
      body: { chest: 38, waist: 32, hip: 36, shoulder: 18, height: 175 },
      garment: { chest: 39, waist: 33, length: 70, fit_type: 'slim', fabric_stretch: 0.2 },
      expected: { fit_percentage: 94, fit_label: 'Slightly Tight', tightness_score: -6 }
    },
    {
      name: 'Too Tight Boundary Case',
      body: { chest: 45, waist: 40, hip: 42, shoulder: 18, height: 175 },
      garment: { chest: 39, waist: 34, length: 70, fit_type: 'slim', fabric_stretch: 0.0 },
      expected: { fit_label: 'Too Tight' }
    }
  ];

  let passed = 0;
  testCases.forEach(tc => {
    const result = predictFit(tc.body, tc.garment);
    let match = true;
    for (const key in tc.expected) {
      if (result[key] !== tc.expected[key]) {
        match = false;
      }
    }
    if (match) passed++;
  });

  console.log(`Unit Tests Result: ${passed}/${testCases.length} Passed`);
  return passed === testCases.length;
}

// --- INTEGRATION TESTING MECHANISM ---
function runIntegrationTests() {
  console.log('\n=== Running Integration Tests against Local HTTP Server ===');
  const postData = JSON.stringify({
    body: { chest: 38, waist: 32, hip: 36, shoulder: 18, height: 175 },
    garment: { chest: 39, waist: 33, length: 70, fit_type: 'slim', fabric_stretch: 0.2 }
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/predict-fit',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const responseData = JSON.parse(rawData);
        if (res.statusCode === 200 && responseData.fit_percentage === 94 && responseData.fit_label === 'Slightly Tight') {
          console.log('  PASS: HTTP response matches goal specifications!');
          process.exit(0);
        } else {
          console.error(`  FAIL: HTTP response mismatch. Code: ${res.statusCode}`);
          process.exit(1);
        }
      } catch (e) {
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`  FAIL: Problem with request. Error: ${e.message}`);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}

// --- VITE CONFIGURATION EXPORT ---
module.exports = defineConfig({
  server: {
    port: 3000,
    open: true
  },
  plugins: [
    {
      name: 'fit-predictor-api',
      configureServer(server) {
        // 1. First run the unit tests when the server hooks setup
        const unitPass = runUnitTests();
        if (!unitPass) {
          console.error('❌ Unit tests failed. Server spinning down.');
          process.exit(1);
        }

        // 2. Set up middleware endpoint
        server.middlewares.use((req, res, next) => {
          if (req.url === '/predict-fit' && req.method === 'POST') {
            let rawData = '';
            req.on('data', chunk => { rawData += chunk; });
            req.on('end', () => {
              try {
                const reqBody = JSON.parse(rawData);
                if (!reqBody.body || !reqBody.garment) {
                  throw new Error('Missing body or garment measurements');
                }
                const prediction = predictFit(reqBody.body, reqBody.garment);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(prediction));
              } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            next();
          }
        });

        // 3. Post-listening integration trigger hook
        if (process.argv.includes('--integration')) {
          server.httpServer?.once('listening', () => {
            // Delay marginally to ensure listeners have completed binding routines
            setTimeout(() => {
              runIntegrationTests();
            }, 500);
          });
        }
      }
    }
  ]
});