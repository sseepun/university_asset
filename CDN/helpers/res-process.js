
const resProcess = {
  '200': (res, data=true, msg='Success.') => {
    return res.status(200).send({
      message: msg,
      data: data
    });
  },
  '400': (res, err, msg='There is an error.') => {
    return res.status(400).send({
      message: msg,
      error: err
    });
  },
  '500': (res, err) => {
    return res.status(500).send({
      message: 'Internal server error.',
      error: {
        system: `${err}`
      }
    });
  },
  'checkError': (res, err, msg='There is an error.') => {
    if(Object.keys(err).length){
      return res.status(400).send({
        message: msg,
        error: err
      });
    }
  }
};

module.exports = resProcess;