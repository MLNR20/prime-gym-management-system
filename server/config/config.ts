
const databaseConnectionString: string =
  process.env.MONGO_URI ??
  "mongodb+srv://employee:employee@mern-database.wyeiwnx.mongodb.net/prime-gym?retryWrites=true&w=majority&tls=true";

export default databaseConnectionString;