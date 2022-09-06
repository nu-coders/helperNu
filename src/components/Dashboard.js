import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import useFetch from "react-fetch-hook";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems } from './listItems';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Copyright from './Copyright';
import {AppBar,Drawer} from './AppBar_Drawer';
import Slider from '@mui/material/Slider';


const mdTheme = createTheme();



function DashboardContent() {
    const [open, setOpen] = React.useState(true);
    const [value2, setValue2] = React.useState([1, 7]);
    const marks = [
      {
        value: 1,
        label: '1',
      },
      {
        value: 2,
        label: '2',
      },
      {
        value: 3,
        label: '3',
      },
      {
        value: 4,
        label: '4',
      },
      {
        value: 5,
        label: '5',
      },
      {
        value: 6,
        label: '6',
      },
      {
        value: 7,
        label: '7',
      },
    ];
    const minDistance = 1;
    function valuetext(value) {
      return `${value}Days`;
    }
  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue2([clamped, clamped + minDistance]);
        console.log([clamped, clamped + minDistance])
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
        console.log([clamped - minDistance, clamped])
      }
    } else {
      setValue2(newValue);
      console.log(newValue);
    }
  };
    const {data} = useFetch("https://tm.nucoders.dev/api/v1/getcourses");
    const fullCoursesList = data ? data.map(({name, code}, nameCode)=>(nameCode = code+" "+name)): null;
    const coursesList = [...new Set(fullCoursesList)];
    const [selectedCourse, setSelectedCourse] = React.useState();
    const [addedCourses, setAddedCourses]= React.useState([]);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const addCourse = ()=>{
      if(!addedCourses.includes(selectedCourse.split(" ")[0])){
        setAddedCourses( addedCourses => [...addedCourses, selectedCourse.split(" ")[0]]);
      }
    }
    const removeCourse = (course)=>{
      setAddedCourses(addedCourses.filter(code => code !== course));
  }
    const [isClicked, setIsClicked] = React.useState(false);
    useEffect(() => {
      isClicked && setIsClicked(false);
   },[isClicked]);
   //const {tables} = useFetch("http://localhost:8080/api/v1/getcourses", {depends : [isClicked]});

   const [tables, setTables]= React.useState([]);

   const getData = async () => {
    try {
      const response = await axios.get(
        `https://tm.nucoders.dev/api/v1/constraineddayscreatetable?wantedCourses=${addedCourses}&constraints=${value2}`
      );
      setTables(null);
      setTables(response.data);
      console.log(tables);

    } catch (err) {
      setTables(null);
    } 
  };
  const courseType = (type) =>{
    if(type===0){
        return "Lecture"
    }else if (type===1){
        return "Lab"
    }else {
        return "Tutorial"
    }
}
const courseSubSection = (section) =>{
    if(section===0){
        return " "
    }else if (section===1){
        return "a"
    }else {
        return "b"
    }
}

const courseDay = (day) =>{
    const days = ["Saturday","Sunday", "Monday","Tuesday","Wednesday","Thursday", "Friday"];
    return days[day];
}
useEffect(() => {
    getData();
 },[])
  return (    
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} style={{backgroundColor:`#03045e`}}>
          <Toolbar sx={{ pr: '24px'}} >
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }), }} >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} >
              NU Smart Helper
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}style={{background:`#03045e`}} >
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1],backgroundColor:`#03045e` }} >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon style={{color:`#fff`}}/>
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" >
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box component="main" sx={{ backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900], flexGrow: 1, height: '100vh', overflow: 'auto', }} >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Search Courses */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper sx={{p: 2,display: 'flex',flexDirection: 'column',maxheight: 400,overflow: 'auto',backgroundColor: `#caf0f8`}}>
                    <Grid container spacing={3} >
                      <Grid item xs={9} md={8} lg={9} >
                          <Autocomplete disablePortal id="combo-box-demo" options={coursesList} inputValue = {selectedCourse} onChange={(event, newValue) => { setSelectedCourse(newValue); }}  renderInput={(params) => <TextField {...params}   label="Search Courses" />} />
                      </Grid>
                      <Grid item xs={3} md={4} lg={3}>
                          <Button sx={{backgroundColor: `#0077b6`}} variant="contained" onClick={() => {addCourse();}} >Add</Button>
                      </Grid>
                    </Grid>
                </Paper>
            </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Paper sx={{p: 2,display: 'flex',flexDirection: 'column',maxheight: 400,backgroundColor: `#0077b6`}}>
                    <Paper elevation={0} style={{minHeight: 400,maxHeight: 600, overflow: 'auto',backgroundColor: `#0077b6`}}>

                                <List>
                                  
                                  {
                                    tables.slice(0,100).map((table) => (
                                      <Paper  variant="outlined" sx={{ p: 2,margin: 2,display: 'flex',flexDirection: 'column',backgroundColor: `#00b4d8`}}>
                                      <Typography component="h4" variant="p" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                                          Table Number {tables.indexOf(table)+1} 
                                      </Typography>
                                          {                                                                                       
                                              table.map((courseList) => (
                                                  <Paper sx={{ p: 2,margin: 2,display: 'flex',flexDirection: 'column',backgroundColor: `#90e0ef`}}> 
                                                      <Typography component="h4" variant="p" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                                                          {courseList[0].code} Section {courseList[0].section} 
                                                      </Typography>
                                                      {                                                         
                                                        courseList.map((course)=>(
                                                          <Paper sx={{ m: 2,backgroundColor: `#caf0f8`}}>
                                                            <Typography>{ courseType(course.type) +" " +course.section+courseSubSection(course.subSection)}</Typography>
                                                            <Typography>Day: {courseDay(course.day)}</Typography>
                                                            <Typography>Time: { course.startTime }--{ course.endTime }</Typography>
                                                            <Typography>Total Seats: { course.total }</Typography>
                                                            <Typography>Left Seats: { course.total-course.registered }</Typography>
                                                          </Paper>
                                                        ))
                                                      }	
                                                  </Paper>
                                              ))
                                          
                                          }
                                      </Paper>
                                          
                                      ))	
                                  }
                                  
                                        
                                </List>
                    </Paper>
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight:350 ,backgroundColor: `#caf0f8` }}>
                  <List>
                    {addedCourses &&
                    addedCourses.map(( code ) => (
                      <Paper style={{minHeight: 5, display: 'flex', flexDirection: 'row', margin:5,backgroundColor: `#90e0ef` }}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, m:3 }} > {code}  </Typography>
                        <IconButton onClick={() => {removeCourse(code);}}>
                          <ClearIcon/>
                        </IconButton>
                      </Paper>
                    ))}
                  </List>
                </Paper>
                <Paper sx={{ m:1, p: 2, display: 'flex', flexDirection: 'column', backgroundColor: `#caf0f8` }}>                        
                  <Typography component="p" variant="p" color="inherit" noWrap sx={{ flexGrow: 1}} > Days To Go </Typography>
                  <Slider getAriaLabel={() => 'Days'} value={value2} onChange={handleChange2} valueLabelDisplay="auto" getAriaValueText={valuetext} disableSwap step={1}
                      marks = {marks}
                      min={1}
                      max={7}/> 
                         <Button sx={{backgroundColor: `#0077b6`}} variant="contained" onClick={() => {getData();}}  >Generate Tables</Button>
                </Paper>
              </Grid>              
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}