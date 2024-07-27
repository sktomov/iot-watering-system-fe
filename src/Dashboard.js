import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { Container, Typography, Card, CardContent, Grid, Button, DialogContent, DialogTitle, Dialog, TextField, DialogActions, Switch, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './Dashboard.css';
import { GiStrawberry, GiTomato, GiOilPump, GiWateringCan } from "react-icons/gi";
import { LuPowerOff, LuPower } from "react-icons/lu";

const Dashboard = () => {
  const [data, setData] = useState({
    distance: 88,
    pump: true,
    strawberries: false,
    tomatoes: false,
    tomatoesHours: [6, 7, 8],
    strawberriesHours: [20, 21],
    pumpingHours: [5, 14, 17, 23],
    lastTomatoesWatering: '26.07 18:33',
    lastStrawberriesWatering: '26.07 19:45',
    lastPumpingDate: '25.07 08:49',
    lastTomatoesWateringWaterConsumption: 0,
    lastStrawberriesWateringConsumption: 0,
    lastPumpCycleWaterAdded: 0,
    externalTemperature: 0,
    externalHumidity: 0,
    irrigationOn: true,
    irrigationTomatoes: true,
    irrigationStrawberries: true,
    pumpOn: true
  });

  const [open, setOpen] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [newHour, setNewHour] = useState('');
  const [error, setError] = useState('');

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
    return (data.distance / maxDistance) * 100;
  };

  const handleClickOpen = (field) => {
    setEditingField(field);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewHour('');
    setError('');
  };

  const handleSave = async () => {
    const hour = Number(newHour);
    
    // Проверка дали въведеният час е валиден
    if (isNaN(hour) || hour < 0 || hour > 24) {
      setError('Въведеният час трябва да бъде между 0 и 24.');
      return;
    }
  
    // Проверка дали въведеният час вече съществува в списъка
    if (data[editingField].includes(hour)) {
      setError('Въведеният час вече е наличен.');
      return;
    }
  
    // Актуализираме състоянието с новия час
    const updatedHours = [...data[editingField], hour];
  
    // Актуализирани данни за изпращане на бекенда
    const updatedData = {
      strawberriesHours: data.strawberriesHours,
      tomatoesHours: data.tomatoesHours,
      pumpingHours: data.pumpingHours,
    };
  
    updatedData[editingField] = updatedHours;
  
    try {
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      };
      // Изпращаме актуализираните часове на бекенда
      await axios.post('/watering-schedule', updatedData, axiosConfig);
      
      setData(prevData => ({
        ...prevData,
        [editingField]: updatedHours
      }));
      setNewHour('');
      setError('');
      setOpen(false);
    } catch (error) {
      console.error('Error updating watering schedule', error);
    }
  };
  
  
  const handleDelete = async (field, hour) => {
    // Актуализираме състоянието, като изтриваме часа
    const updatedHours = data[field].filter(h => h !== hour);
  
    // Актуализирани данни за изпращане на бекенда
    const updatedData = {
      strawberriesHours: data.strawberriesHours,
      tomatoesHours: data.tomatoesHours,
      pumpingHours: data.pumpingHours,
    };
  
    updatedData[field] = updatedHours;
  
    try {
      // Изпращаме актуализираните часове на бекенда
      await axios.post('/watering-schedule', updatedData);
      
      setData(prevData => ({
        ...prevData,
        [field]: updatedHours
      }));
    } catch (error) {
      console.error('Error updating watering schedule', error);
    }
  };
  
  

  const handleSwitchChange = (field, value) => {
    setData(prevData => ({ ...prevData, [field]: value }));

    const body = { field: field, value: value};

    axios.post('/irrigation/set', body)
      .then(response => {
        console.log(`Successfully updated ${field}:`, response.data);
      })
      .catch(error => {
        console.error(`Error updating ${field}:`, error);
      });
  };

  const tomatoesSwitch = data.tomatoes ? <LuPower /> : <LuPowerOff />;
  const pumpSwitch = data.pump ? <LuPower /> : <LuPowerOff />;
  const strawberriesSwitch = data.tomatoes ? <LuPower /> : <LuPowerOff />;

  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom align="center">
        Поливна система
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Настройка на системата</Typography>
              <Typography variant="h4" color="secondary">
                Поливане <GiWateringCan />:
                <Switch
                  checked={data.irrigationOn}
                  color="success"
                  onChange={(e) => handleSwitchChange('irrigationOn', e.target.checked)}
                />
              </Typography>
              <Typography variant="h4" color="secondary">
                Изпомпване <GiOilPump />:
                <Switch
                  checked={data.pumpOn}
                  color="success"
                  onChange={(e) => handleSwitchChange('pumpOn', e.target.checked)}
                />
              </Typography>
              <Typography variant="h4" color="secondary">
                Поливка на <GiTomato />:
                <Switch
                  checked={data.irrigationTomatoes}
                  color="success"
                  onChange={(e) => handleSwitchChange('irrigationTomatoes', e.target.checked)}
                />
              </Typography>
              <Typography variant="h4" color="secondary">
                Поливка на <GiStrawberry />:
                <Switch
                  checked={data.irrigationStrawberries}
                  color="success"
                  onChange={(e) => handleSwitchChange('irrigationStrawberries', e.target.checked)}
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Часове за поливане/пълнене</Typography>
              <Typography variant="h6" color="secondary"><GiTomato /> Часове за поливане:</Typography>
              {data.tomatoesHours.map((hour, index) => (
                <Chip
                  key={index}
                  label={hour}
                  onDelete={() => handleDelete('tomatoesHours', hour)}
                  color="primary"
                  style={{ margin: '4px' }}
                />
              ))}
              <IconButton color="primary" onClick={() => handleClickOpen('tomatoesHours')}>
                <AddIcon />
              </IconButton>

              <Typography variant="h6" color="secondary"><GiStrawberry /> Часове за поливане:</Typography>
              {data.strawberriesHours.map((hour, index) => (
                <Chip
                  key={index}
                  label={hour}
                  onDelete={() => handleDelete('strawberriesHours', hour)}
                  color="primary"
                  style={{ margin: '4px' }}
                />
              ))}
              <IconButton color="primary" onClick={() => handleClickOpen('strawberriesHours')}>
                <AddIcon />
              </IconButton>

              <Typography variant="h6" color="secondary"><GiOilPump /> Часове за изпомпване:</Typography>
              {data.pumpingHours.map((hour, index) => (
                <Chip
                  key={index}
                  label={hour}
                  onDelete={() => handleDelete('pumpingHours', hour)}
                  color="primary"
                  style={{ margin: '4px' }}
                />
              ))}
              <IconButton color="primary" onClick={() => handleClickOpen('pumpingHours')}>
                <AddIcon />
              </IconButton>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Състояние</Typography>
              <div className="water-level-container">
                <div className="icons">
                  <Typography variant="h4" color="secondary"><GiOilPump />: {pumpSwitch}</Typography>
                  <Typography variant="h4" color="secondary"><GiTomato />: {tomatoesSwitch}</Typography>
                  <Typography variant="h4" color="secondary"><GiStrawberry />: {strawberriesSwitch}</Typography>
                </div>
                <div className="shape">
                  <div
                    className={`wave ${data.pump ? 'pumping' : 'waving'}`}
                    style={{ height: `${getWaterLevel()}%` }}
                  />
                </div>
              </div>
              <Typography variant="h5" align="center" color="secondary">{`${getWaterLevel().toFixed(2)}%`}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Статистика</Typography>
              <Typography variant="h6" color="secondary">Последно поливане <GiTomato />: {data.lastTomatoesWatering}</Typography>
              <Typography variant="h6" color="secondary">Последно поливане <GiStrawberry />: {data.lastStrawberriesWatering}</Typography>
              <Typography variant="h6" color="secondary">Последно  пълнене <GiOilPump />: {data.lastPumpingDate}</Typography>
              <Typography variant="h6" color="secondary">Консумация вода <GiTomato />: {data.lastTomatoesWateringWaterConsumption} литра</Typography>
              <Typography variant="h6" color="secondary">Консумация вода <GiStrawberry />: {data.lastStrawberriesWateringConsumption} литра</Typography>
              <Typography variant="h6" color="secondary">Допълнена вода от <GiOilPump />: {data.lastPumpCycleWaterAdded} литра</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добави нов час за {editingField}</DialogTitle>
        <DialogContent>
          <TextField
            label="Нов час"
            value={newHour}
            onChange={(e) => setNewHour(e.target.value)}
            fullWidth
            margin="dense"
            error={!!error}
            helperText={error}
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