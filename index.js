const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const params = require("params")

require('dotenv').config();

const app  =express();
const port = process.env.PORT;

//creating array to store rooms and bookings
let rooms = [];
let bookings = [];

app.use(bodyParser.json());

//Endpoint to create a room
app.post('/createRoom', (req,res) =>{
    const {seats, amenities, price} = req.body;
    const room = {
        id: rooms.length + 1,
        seats,
        amenities,
        price,
    };
    rooms.push(room);
    res.json(room);
});

//Endpoint to book a room

app.post('/bookRoom', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
  
    const booking = {
      id: bookings.length + 1,
      customerName,
      date,
      startTime,
      endTime,
      roomId,
      roomName: `Room ${roomId}`,
      status: 'Booked',
    };
    bookings.push(booking);
    res.json(booking);
  });

/// Endpoint to list all rooms with booked data
app.get('/listAllRooms', (req, res) => {
    const result = bookings.map(({ roomName, status, customerName, date, startTime, endTime }) => ({
      roomName,
      status,
      customerName,
      date,
      startTime,
      endTime,
    }));
    res.json(result);
  });

// Endpoint to list all customers with booked data
app.get('/listAllCustomers', (req, res) => {
  const result = bookings.map(({ customerName, roomName, date, startTime, endTime }) => ({
    customerName,
    roomName,
    date,
    startTime,
    endTime,
  }));
  res.json(result);
});

//Endpoint to list how many times a customer has booked a room
app.get('/customerBookingHistory/:customerName', (req,res)=>{

    const {customerName} = req.params;
    const result = bookings
        .filter((booking) => booking.customerName === customerName)
        .map(({ roomName, date, startTime, endTime, id, status}) =>({
            customerName,
            roomName,
            date,
            startTime,
            endTime,
            bookingId: id,
            bookingStatus: status,
        }));
        res.json(result);
});

app.listen(port, () =>{
    console.log(`Server is running at 'http://localhost:${port}`);
});