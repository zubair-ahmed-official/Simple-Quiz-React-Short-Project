import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Quiz from './App';
//style={{border:'2px white solid', padding:'50px 100px', width:'800px',margin:' 30px 31%'}} 
// quizData.json
const router = createBrowserRouter([
  {
    path: '/',
    element: <Quiz></Quiz>
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
