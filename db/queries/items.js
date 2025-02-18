const db = require('../connection');

/// Items

/**
 * Get all items.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getItems = function(options, limit = 10) {
  const queryParams = [];
  let queryCondition = '';

  let queryString = `
  SELECT *
  FROM items
  `;

  if (options.title) {
    queryParams.push(`%${options.title}%`);
    queryCondition += !queryCondition ? `WHERE title LIKE $${queryParams.length} ` : `AND title LIKE $${queryParams.length} `;
  }

  if (options.province) {
    queryParams.push(`${options.province}`);
    queryCondition += !queryCondition ? `WHERE province = $${queryParams.length} ` : `AND province = $${queryParams.length} `;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryCondition += !queryCondition ? `WHERE city LIKE $${queryParams.length} ` : `AND city LIKE $${queryParams.length} `;
  }

  if (options.community) {
    queryParams.push(`%${options.community}%`);
    queryCondition += !queryCondition ? `WHERE community LIKE $${queryParams.length} ` : `AND community LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryCondition += !queryCondition ? `WHERE owner_id = $${queryParams.length} ` : `AND owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price) {
    queryParams.push(options.minimum_price * 100);
    queryCondition += !queryCondition ? `WHERE price >= $${queryParams.length} ` : `AND price >= $${queryParams.length} `;
  }

  if (options.maximum_price) {
    queryParams.push(options.maximum_price * 100);
    queryCondition += !queryCondition ? `WHERE price <= $${queryParams.length} ` : `AND price <= $${queryParams.length} `;
  }

  if (options.status) {
    queryParams.push(options.status);
    queryCondition += !queryCondition ? `WHERE status = $${queryParams.length} ` : `AND status = $${queryParams.length} `;
  }

  queryString += queryCondition;

  queryString += `
  ORDER BY price
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

/**
 * Add an item to the database
 * @param {{}} property An object containing all of the item details.
 * @return {Promise<{}>} A promise to the items.
 */
const addItem = function(item) {
  return pool
    .query(
      `INSERT INTO items
    (owner_id, title, description, price, cover_photo_url, thumbnail_photo1_url, thumbnail_photo2_url, thumbnail_photo3_url,
     province, city, community, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'new' )
    RETURNING *;`,
      [item.owner_id, item.title, item.description, item.price, item.cover_photo_url, item.thumbnail_photo1_url,
        item.thumbnail_photo2_url, item.thumbnail_photo3_url, item.province, item.city, item.community ])
    .then((result) => {
      console.log(result);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });

};


/**
 * Update status of an item
 * @param {{status: string, item_id: integer}} user
 * @return {Promise<{}>} A promise to the items.
 */
const updateItemStatusWithItemId = function(item) {
  return pool
    .query(
      `UPDATE items
      SET status = $1
      WHERE item_id = $2;`,
      [item])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

module.exports = { getItems, addItem, updateItemStatusWithItemId };
