module.exports = {
    mongodbMemoryServerOptions: {
      instance: {
        dbName: "jest",
        port: "429"
      },
      binary: {
        version: "latest", // Version of MongoDB
        skipMD5: true
      },
      autoStart: false
    }
  };