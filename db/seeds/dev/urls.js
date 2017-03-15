exports.seed = function(knex, Promise) {
  return knex('urls').del()
  .then(() => {
    return Promise.all([
      knex('urls').insert({
        long_url: 'www.animals.com',
        folder_id: 3,
        visits: 0,
      }),
      knex('urls').insert({
        long_url: 'www.reptiles.com',
        folder_id: 2,
        visits: 0,
      })
    ]);
  });
};
