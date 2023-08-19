import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios  from 'axios'

const LandingPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    Axios.get('/api/hello')
    .then(response => console.log(response.data))
  }, []);

  const onClickHandler = () => {

    Axios.get('/api/user/logout')
            .then(response => {

              const logoutSuccess = response.data.success;

              if (logoutSuccess) {
                navigate('/login');
              } else 
                alert('Failed To Logout');
            })
  }

  return (
    <div style={ 
                { 
                  display: "flex",
                  justifyContent: "center", 
                  alignItems: 'center', 
                  width: "100%", 
                  height: "100vh" 
                } 
              }>
      <h2>시작페이지</h2>
      
      <button onClick={ onClickHandler }>
        로그아웃
      </button>
    </div>
  )
}

export default LandingPage;