const {createLogger , transports, format} = require('winston');


const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'logs/userActivity.log',
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
});

module.exports = (req, res, next) => {
    logger.info({
        method: req.method,
        url: req.url,
        time: new Date()
    });
    next();
}

