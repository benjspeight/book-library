module.exports = (connection, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    passsword: DataTypes.STRING,
  };

  const ReaderModel = connection.define("Reader", schema);
  return ReaderModel;
};
