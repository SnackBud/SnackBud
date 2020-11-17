module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            version: 'latest', // Version of MongoDB
            skipMD5: true
        },
        autoStart: false,
        instance: {
            // dbName: 'jest'
            port: 420
        }
    }
  };