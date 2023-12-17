import React from "react";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";

import './Login_Comp.css'
import { login_inner } from "../../api/login/login";


export default function Login_Comp() {
    const [user, setUser] = React.useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();
    async function login_outer(username, password) {
        let res = await login_inner(username,password);
        if (res) {
            navigate("/menu");
        }
        else{
            alert("Wrong Password!");
        }
    }

    return (
        <div className="login">
            <div className="login-title">
                Login
            </div>
            <div className="login-block">
                <div className="login-form">
                    <Form>
                        <Form.Group className="mb-3" controlId="formUserName">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                value={user.username}
                                onChange={event => setUser(prev => {
                                    return {
                                        ...prev,
                                        username: event.target.value
                                    }
                                })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={user.password}
                                onChange={event => setUser(prev => {
                                    return {
                                        ...prev,
                                        password: event.target.value
                                    }
                                })}
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit"
                            onClick={event => {
                                event.preventDefault();
                                login_outer(user.username,user.password);
                            }}
                        >
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}