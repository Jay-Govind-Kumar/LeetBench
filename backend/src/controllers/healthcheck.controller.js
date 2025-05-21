const healthCheck = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Server is running",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export { healthCheck };
