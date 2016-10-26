module.exports = {
 "root": true,
 "extends": "google",
 "env": {
   "browser": true
 },
 "parserOptions": {
   "ecmaVersion": 5,
   "sourceType": "module"
 },
 "rules": {
   "semi": ["error", "always"],
   "quotes": ["error", "single"],
   "no-empty": ["error",  {"allowEmptyCatch": true}],
   "no-console": 1,
   "no-debugger": 2,
   "no-var": 0,
 },
 "globals": {
   "angular": false,
   "define": false,
   "createjs": false,
   "require": false,
   "requirejs": false,
   "IScroll": false
 }
};
