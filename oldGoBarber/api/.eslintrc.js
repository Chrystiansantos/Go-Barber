module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    //todos os problemas que o prettier identicar ira retornar um erro
    "prettier/prettier": "error",
    //nao sera necessario todos os metodos utilizar a palavra this.
    "class-methods-use-this": "off",
    //permite que eu receba um parametro e faça alterações nele
    "no-param-reassign": "off",
    //irei desabilitar o pra nao ser obrigatorio usar o camelcase
    "camelcase": "off",
    //uso esse comando para utilizar variaveis que nao irei utilizar
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  },
};
