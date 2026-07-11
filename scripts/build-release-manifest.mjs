import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';

const root = process.cwd();
globalThis.window = globalThis;
globalThis.WHB_RECIPE_CHUNKS = [];

function run(path) {
  const code = fs.readFileSync(`${root}/${path}`, 'utf8');
  vm.runInThisContext(code, { filename: path });
}

function norm(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
globalThis.norm = norm;

for (let i = 1; i <= 6; i += 1) run(`data-recipes-${i}.js`);
const coreCount = globalThis.WHB_RECIPE_CHUNKS.flat().length;
run('data-wine.js');
const coreAndWineCount = globalThis.WHB_RECIPE_CHUNKS.flat().length;

globalThis.DATA = { recipes: globalThis.WHB_RECIPE_CHUNKS.flat() };
run('data-adjunct-recipes-v4.js');
run('adjunct-bridge-v5.js');
const beforeV5Count = globalThis.DATA.recipes.length;

const encoded = [1, 2, 3]
  .map(n => fs.readFileSync(`${root}/expansion-v5-${n}.b64`, 'utf8').trim())
  .join('');
const payload = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));

const existing = new Set(globalThis.DATA.recipes.map(r => norm(r.name)));
let v5Added = 0;
for (const recipe of payload.recipes) {
  const key = norm(recipe.name);
  if (existing.has(key)) continue;
  existing.add(key);
  globalThis.DATA.recipes.push(recipe);
  v5Added += 1;
}

const names = new Set(globalThis.DATA.recipes.map(r => norm(r.name)));
const manifest = {
  app: 'Wright Home Bar',
  version: '5.0.0',
  generated_at: new Date().toISOString(),
  total_recipes: globalThis.DATA.recipes.length,
  unique_recipe_names: names.size,
  breakdown: {
    core: coreCount,
    wine_added: coreAndWineCount - coreCount,
    adjunct_added_after_deduplication: beforeV5Count - coreAndWineCount,
    v5_candidates: payload.recipes.length,
    v5_added_after_deduplication: v5Added
  },
  included_checks: {
    martini: names.has('martini'),
    paper_plane: names.has('paper plane')
  }
};

fs.writeFileSync(`${root}/release-manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
