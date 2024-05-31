const handleAsync = (fn) => {
  return (req, res) => {
    fn(req, res).catch((e) => {
      console.log(e);
      if (e.name === 'CastError')
        return res
          .status(400)
          .json({ message: 'Invalid Id Request', data: [] });
      return res
        .status(500)
        .json({ message: 'Something went wrong from middlwarea', data: [] });
    });
  };
};

module.exports = { handleAsync };
