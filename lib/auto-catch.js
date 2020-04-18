function autoCatch(functions) {
  return Object.entries(functions).reduce((acc, [key, value]) => {
    acc[key] = async (req, res, next) => {
      try {
        await value(req, res, next);
      } catch (e) {
        next(e);
        // res.status(500).json({ error: e.message });
      }
    }
    return acc;
  }, {});
}

module.exports = autoCatch;