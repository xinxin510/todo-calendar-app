import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Nav from './home/Nav';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import { Metrics } from './Metrics/Metrics';
import DailyCalendar from './home/DailyCalendar';
import { getDate } from './home/utils/helper';
import { CreateTodo } from './Create to-do/create-todo';


const App: React.FC = () => {
  const now = getDate(new Date());
  const [date, setDate] = React.useState<string>(now);
  const [toggleUnscheduledTodo, setToggleUnscheduledTodo] = React.useState(false);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Nav date={date} setDate={setDate} setToggleUnscheduledTodo={setToggleUnscheduledTodo} />
          <Routes>
            <Route path="/" element={<DailyCalendar date={date} toggleUnscheduledTodo={toggleUnscheduledTodo} setToggleUnscheduledTodo={setToggleUnscheduledTodo}/>} />
            {/* <Route path="/unscheduled" element={<UnscheduledTodo  />} /> */}
            <Route path="/create_todo" element={<CreateTodo />} />
            <Route path="/metrics" element={<Metrics todos={[
              {
                title: 'Clean Room',
                start_date: '6/25/16 19:10',
                end_date: '7/1/16 19:45',
                complete: true,
                username: 'Paully',
                category: 'School'
              }
            ]} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
