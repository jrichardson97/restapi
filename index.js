const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('public'))

app.all('/appointments', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/http');
    next();
});

app.get('/appointments', (req, res, next) => {
    appointments = getAppointments();
    res.write(JSON.stringify(appointments))
    res.end('<h1>Sending all the appointments</h1>');
});
app.get('/appointments/:id', (req, res, next) => {
    appointments = getAppointments();

    if (appointmentExists(appointments, req.params.id)) {
        let filteredAppointments = appointments.filter(function(appointments){
            return appointments.id == req.params.id;
        });
        res.write(JSON.stringify(filteredAppointments));
        res.end('Appointment Retrieved.');
    } else {
        res.end('Appointment Does Not Exist.')
    }
});

app.delete('/appointments', (req, res, next) => {
    fs.writeFileSync('./public/appointments.json', '[]')
    res.end('Deleting All Appointments.');
});
app.delete('/appointments/:id', (req, res, next) => {
    appointments = getAppointments();

    if (appointmentExists(appointments, req.params.id)) {
        let filteredAppointments = appointments.filter(function(appointments){
            return appointments.id != req.params.id;
        });
        fs.writeFileSync('./public/appointments.json', JSON.stringify(filteredAppointments, null, 2))
        res.end('Appointment Deleted.');
    } else {
        res.end('Appointment Does Not Exist.')
    }
});

app.post('/appointments', (req, res, next) => {
    res.statusCode = 403;
    res.end('Operation Not Supported.');
});
app.post('/appointments/:id', (req, res, next) => {
    let appointment = {
        id: req.params.id,
        title: "Sample",
        date: "Given Date",
        time: "Given Time"
    }

    appointments = getAppointments();

    if (appointmentExists(appointments, appointment.id)){
        res.end('Appointment with specified index already exists.')
    } else {
        appointments.push(appointment)
        fs.writeFileSync('./public/appointments.json', JSON.stringify(appointments, null, 2))
        res.end('Appointment Created.')
    }
});

app.put('/appointments', (req, res, next) => {
    res.statusCode = 403;
    res.end('Operation Not Supported.');
});
app.put('/appointments/:id', (req, res, next) => {
    let appointment = {
        id: req.params.id + 10,
        title: "Sample",
        date: "Given Date",
        time: "Given Time"
    }

    appointments = getAppointments();

    if (appointmentExists(appointments, req.params.id)){
        let filteredAppointments = appointments.filter(function(appointments){
            return appointments.id != req.params.id;
        });
        filteredAppointments.push(appointment)
        fs.writeFileSync('./public/appointments.json', JSON.stringify(filteredAppointments, null, 2))
        res.end('Appointment changed.')
    } else {
        res.end('Appointment Does Not Exist.')
    }
});

function appointmentExists(appointments, id) {
    let check = appointments.findIndex(obj => obj.id==id);
    if (check==-1) {
        return false;
    } else {
        return true;
    }
}

function getAppointments() {
    let data = fs.readFileSync('./public/appointments.json')
    let appointments = [];
    if (data.length > 0) {appointments = JSON.parse(data)};
    return appointments;
}


var server = app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
})
