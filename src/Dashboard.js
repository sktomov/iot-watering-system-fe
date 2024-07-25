import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { Container, Typography, Card, CardContent, Grid, Box } from '@mui/material';

const Dashboard = () => {
  const [data, setData] = useState({
    Distance: 35,
    Pump: false,
    Strawberries: false,
    Tomatoes: false,
    TomatoesHours: [],
    StrawberriesHours: [],
  });

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

  return (
    <Container>
      <Typography variant="h4" color="primary" gutterBottom align="center">
        Irrigation System Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Water Level</Typography>
              <Box sx={{ position: 'relative', height: '200px', width: '100px', border: '1px solid #9c27b0', margin: '0 auto' }}>
                <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: `${getWaterLevel()}%`, backgroundColor: '#9c27b0' }} />
              </Box>
              <Typography variant="h6" align="center" color="secondary">{`${getWaterLevel().toFixed(2)}%`}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Watering Schedule</Typography>
              <Typography variant="h6" color="secondary">Tomatoes: {data.TomatoesHours.join(', ')}h</Typography>
              <Typography variant="h6" color="secondary">Strawberries: {data.StrawberriesHours.join(', ')}h</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>Watering Status</Typography>
              <Typography variant="h6" color="secondary">Pump: {data.Pump ? 'On' : 'Off'}</Typography>
              <Typography variant="h6" color="secondary">Tomatoes: {data.Tomatoes ? 'Watering' : 'Not Watering'}</Typography>
              <Typography variant="h6" color="secondary">Strawberries: {data.Strawberries ? 'Watering' : 'Not Watering'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
