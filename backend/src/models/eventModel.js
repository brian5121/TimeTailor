const edgedb = require('edgedb');
const db = edgedb.createClient();

exports.createEvent = async (eventData) => {
    return await db.querySingle(`
        INSERT Event {
            title := <str>$title,
            description := <str>$description,
            startTime := <datetime>$startTime,
            endTime := <datetime>$endTime,
            location := <str>$location,
            fixed := <bool>$fixed,
            priority := <int16>$priority
        };
    `, {
        title: eventData.title,
        description: eventData.description,
        startTime: edgedb.toDateTime(eventData.startTime),
        endTime: edgedb.toDateTime(eventData.endTime),
        location: eventData.location,
        fixed: eventData.fixed,
        priority: eventData.priority
    });
};

exports.getAllEvents = async () => {
    return await db.query(`
        SELECT Event {
            title,
            description,
            startTime,
            endTime,
            location,
            fixed,
            priority
        }
    `);
};
