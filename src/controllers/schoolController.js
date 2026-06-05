const db = require('../config/db');
const { calculateDistance } = require('../utils/distanceCalculator');

/**
 * Add a new school to the database.
 */
async function addSchool(req, res, next) {
  const { name, address, latitude, longitude } = req.body;

  try {
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    await db.query(query, [name, address, latitude, longitude]);

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List all schools sorted by proximity to the provided latitude/longitude.
 */
async function listSchools(req, res, next) {
  const { latitude: userLat, longitude: userLon } = req.query;

  try {
    const [schools] = await db.query('SELECT id, name, address, latitude, longitude FROM schools');

    // Calculate distance for each school and attach it
    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        parseFloat(userLat),
        parseFloat(userLon),
        parseFloat(school.latitude),
        parseFloat(school.longitude)
      );

      return {
        id: school.id,
        name: school.name,
        address: school.address,
        latitude: school.latitude,
        longitude: school.longitude,
        // Format distance to 2 decimal places and parse back to a float
        distance: parseFloat(distance.toFixed(2)),
      };
    });

    // Sort schools by distance ascending
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      success: true,
      count: schoolsWithDistance.length,
      schools: schoolsWithDistance,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addSchool,
  listSchools,
};
