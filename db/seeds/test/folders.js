exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('folders').insert({
      name: 'Animals',
    }),
    knex('folders').insert({
      name: 'Reptiles',
    })
  ]);
};
