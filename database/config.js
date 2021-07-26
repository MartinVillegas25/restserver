const mongoose = require('mongoose');

const dbConnection = async()=> {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('base de datos conectada correctamente')


    } catch (error) {
        console.error(error)
        throw new Error('error cuando se inicia la base de datos');
    }

}


module.exports ={
    dbConnection
}