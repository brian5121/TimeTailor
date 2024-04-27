const eventModel = require('../models/eventModel');
const moment = require('moment');

exports.createEvent = async (req, res) => {
    try {
        const inputData = JSON.parse(req.body);
        const startTime = moment(inputData["Start Time"], "YYYY-MM-DD HH:mm:ss").toDate();
        const endTime = moment(inputData["End Time"], "YYYY-MM-DD HH:mm:ss").toDate();
        const event = {
            title: inputData["Title"],
            description: inputData["Description"],
            startTime: startTime,
            endTime: endTime,
            location: inputData["Location"] || "N/A",
            fixed: inputData["Fixed"] || false,
            priority: inputData["Priority"] || 5
        };

        const savedEvent = await eventModel.createEvent(event);
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send('Failed to create event');
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await eventModel.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: error.message });
    }
};
