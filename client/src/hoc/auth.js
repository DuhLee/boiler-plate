import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'
import { useNavigate } from 'react-router-dom'

export default (SpecificComponent, option, adminRoute = null) => {

    // option = [null, true, false]
    // null => 아무나 출입가능
    // true => 로그인 한 유저만 출입가능
    // false => 로그인 한 유저는 출입 불가능

    const AuthenticationCheck = () => {

        const navigate = useNavigate();
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth())
            .then(
                response => {                
                    // 로그인 하지 않은 상태 
                    if (!response.payload.isAuth) {
                        if (option) navigate('/'); 
                    } else {
                        // 로그인 한 상태
                        if (adminRoute && !response.payload.isAdmin) {
                            navigate('/');
                        } else {
                            if (option === false) navigate('/');
                        }

                    }
            })
        }, [])

        return (
            <SpecificComponent />
        )

    }

    return AuthenticationCheck;
}