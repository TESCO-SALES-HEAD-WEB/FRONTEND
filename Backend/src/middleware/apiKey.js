// Verifies the "x-api-key" header for machine-to-machine routes (e.g. n8n intake).
// The key must match process.env.N8N_API_KEY.
const verifyApiKey = (req, res, next) => {
  const provided = req.headers['x-api-key'];

  if (!provided || provided !== process.env.N8N_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid or missing API key.' });
  }

  next();
};

module.exports = verifyApiKey;
