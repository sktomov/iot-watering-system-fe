import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { Container, Typography, Card, CardContent, Grid, Button, DialogContent, DialogTitle, Dialog, TextField, DialogActions, Switch } from '@mui/material';
import './Dashboard.css';
import { GiStrawberry, GiTomato, GiOilPump, GiWateringCan } from "react-icons/gi";

const Dashboard = () => {
  const [data, setData] = useState({
    Distance: 78,
    Pump: false,
    Strawberries: true,
    Tomatoes: true,
    TomatoesHours: [6, 7, 8],
    StrawberriesHours: [21, 21],
    PumpingHours: [5, 14, 17, 23],
    LastTomatoesWatering: new Date(),
    LastStrawberriesWatering: new Date(),
    LastPumpingDate: new Date(),
    LastTomatoesWateringWaterConsumption: 0,
    LastStrawberriesWateringConsumption: 0,
    LastPumpCycleWaterAdded: 0,
    ExternalTemperature: 0,
    ExternalHumidity: 0,
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('irrigation/status');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const getWaterLevel = () => {
    const maxDistance = 100; // Предполагаема максимална височина на резервоара
    return (data.Distance / maxDistance) * 100;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const dataToSend = {
      TomatoesHours: data.TomatoesHours,
      StrawberriesHours: data.StrawberriesHours
    };

    axios.post('/api/watering-schedule', dataToSend)
      .then(response => {
        console.log('Schedule updated:', response.data);
        setOpen(false);
      })
      .catch(error => {
        console.error('Error updating schedule:', error);
      });
  };

  const handleTomatoesHoursChange = (e) => {
    const newTomatoesHours = e.target.value.split(',').map(Number);
    setData(prevData => ({ ...prevData, TomatoesHours: newTomatoesHours }));
  };

  const handleStrawberriesHoursChange = (e) => {
    const newStrawberriesHours = e.target.value.split(',').map(Number);
    setData(prevData => ({ ...prevData, StrawberriesHours: newStrawberriesHours }));
  };

  const handlePumpingHoursChange = (e) => {
    const newPumpingHours = e.target.value.split(',').map(Number);
    setData(prevData => ({ ...prevData, PumpingHours: newPumpingHours }));
  };

  return (
    <Container>
      <Typography variant="h4" color="primary" gutterBottom align="center">
        Polyantsi watering system
      </Typography>
      <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Статус</Typography>
              
              <Typography variant="h3" color="secondary"><GiWateringCan />: <Switch defaultChecked color="success" /></Typography>
              <Typography variant="h3" color="secondary"><GiOilPump />: {data.Pump ? <Switch disabled defaultChecked color="success" /> : <Switch  disabled/>}</Typography>
              <Typography variant="h3" color="secondary"><GiTomato />: {data.Tomatoes ?  <Switch disabled defaultChecked color="success" /> : <Switch  disabled />}</Typography>
              <Typography variant="h3" color="secondary"><GiStrawberry />:  {data.Strawberries ?  <Switch disabled defaultChecked color="success" /> : <Switch  disabled />}</Typography>
            </CardContent>
          </Card>
        </Grid>
      <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Часове за поливане/пълнене</Typography>
              <Typography variant="h4" color="secondary"><GiTomato />:  {data.TomatoesHours.join(', ')}</Typography>
              <Typography variant="h4" color="secondary"><GiStrawberry />: {data.StrawberriesHours.join(', ')}</Typography>
              <Typography variant="h4" color="secondary"><GiOilPump />: {data.PumpingHours.join(', ')}</Typography>
              <Button variant="outlined" color="primary" onClick={handleClickOpen} sx={{ marginTop: '10px' }}>
                Промени график
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Статистика</Typography>
              <Typography variant="h5" color="secondary">Последно поливане <GiTomato />:{new Date(data.LastTomatoesWatering).toLocaleDateString()}</Typography>
              <Typography variant="h5" color="secondary">Последно поливане <GiStrawberry />:{new Date(data.LastStrawberriesWatering).toLocaleDateString()}</Typography>
              <Typography variant="h5" color="secondary">Последно  пълнене :{data.LastPumpingDate.toLocaleString('bg-BG')}</Typography>
              <Typography variant="h5" color="secondary">Last Tomatoes Watering Consumption: {data.LastTomatoesWateringWaterConsumption} liters</Typography>
              <Typography variant="h5" color="secondary">Last Strawberries Watering Consumption: {data.LastStrawberriesWateringConsumption} liters</Typography>
              <Typography variant="h5" color="secondary">Last Pump Cycle Water Added: {data.LastPumpCycleWaterAdded} liters</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Water Level</Typography>
              <div className="shape">
                <div
                  className={`wave ${data.Pump ? 'pumping' : 'waving'}`}
                  style={{ height: `${getWaterLevel()}%` }}
                />
              </div>
              <Typography variant="h6" align="center" color="secondary">{`${getWaterLevel().toFixed(2)}%`}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Watering Schedule</DialogTitle>
        <DialogContent>
          <TextField
            label="Tomatoes Hours"
            value={data.TomatoesHours.join(', ')}
            onChange={handleTomatoesHoursChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Strawberries Hours"
            value={data.StrawberriesHours.join(', ')}
            onChange={handleStrawberriesHoursChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Pumping Hours"
            value={data.PumpingHours.join(', ')}
            onChange={handlePumpingHoursChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;