/** @type {import("prettier").Config} */
module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react$',
    '^react/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$',
    '^../(.*)$',
    '^./(.*)$',
    '^[./]',
    '.(css|scss|less)$'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};
