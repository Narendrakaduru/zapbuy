const Log = require('../models/log.model');

// Create a new log
exports.createLog = async (req, res) => {
  try {
    const { module, severity, message, meta } = req.body;

    const log = await Log.create({ module, severity, message, meta });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all logs with filters (module, severity, date)
exports.getLogs = async (req, res) => {
  try {
    const { module, severity, from, to } = req.query;

    const filter = {};
    if (module) filter.module = module;
    if (severity) filter.severity = severity;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const logs = await Log.find(filter).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a specific log by ID
exports.deleteLog = async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ error: 'Log not found' });

    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
