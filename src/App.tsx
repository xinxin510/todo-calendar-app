import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import { Metrics } from './Metrics/Metrics';
import Home from './home/Home';
import { CreateTodo } from './Create to-do/create-todo';
import Share from './sharing/share';
import SignUp from './authentication/signup';
import Login from './authentication/login';
import RequireAuth from './authentication/requireAuth';
import axios from 'axios';
import { FakeTodoData } from './Metrics/components/helpers/helpers';

export interface UnscheduledTodoList {
  id?: number,
  title?: string,
  complete?: boolean,
  color?: number
}


const App: React.FC = () => {
  const [metricsPageOpent, toggleMetrics] = useState(false);
  const [metricsData, setMetricsData] = useState<{
    title: string,
    start_d: string,
    end_d: string,
    category_name: string,
    color: number
  }[]>([]);
  const [userId, setUserId] = useState(3) //gave default val until signin uses it
  const [unscheduledTodoList, setUnscheduledTodoList] = useState<UnscheduledTodoList[]>([]);

  useEffect(() => {
    let requestCompletedTodos = axios.get(`http://127.0.0.1:8080/completedTodos/${userId}`);
    let requestUnscheduledTodos = axios.get(`http://127.0.0.1:8080/unscheduledTodos/${userId}`);

    axios.all([requestCompletedTodos, requestUnscheduledTodos])
      .then(axios.spread((...allData) => {
        setMetricsData(allData[0].data);
        setUnscheduledTodoList(allData[1].data);
      }))
      .catch((err) => {
        setMetricsData(FakeTodoData)
      })
  },[userId])

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <RequireAuth user={setUserId} >
                <Home unscheduledTodoList={unscheduledTodoList} setUnscheduledTodoList={setUnscheduledTodoList}/>
              </RequireAuth>
            } />
            <Route path="/create_todo" element={
              <RequireAuth user={setUserId} >
                <CreateTodo />
              </RequireAuth>
              } />
            <Route path='/share' element={
              <RequireAuth user={setUserId} >
                <Share />
              </RequireAuth>
            } />
            <Route path="/metrics/*" element={
              <RequireAuth user={setUserId} >
                <Metrics todos={metricsData} />
              </RequireAuth>
            }/>
            <Route path="/login" element={ <Login user={ setUserId } /> } />
            <Route path="/signup" element={ <SignUp user={ setUserId } /> } />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
