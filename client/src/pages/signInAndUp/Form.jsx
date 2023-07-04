import { useState } from "react";
import {
    Box, 
    Button,
    TextField,
    useMediaQuery,
    Typography, 
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

const registerSchema = yup.object().shape({
    displayName: yup.string().required("required"), 
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required")
});

// added displayName to loginSchema due to formType being flipped prior to form submission
const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"), 
    password: yup.string().required("required")
});

const initialValuesRegister = {
    displayName: "",
    email: "",
    password: ""
}

const initialValuesLogin = {
    email: "",
    password: ""
}

const Form = () => {
    const [formType, setFormType] = useState("login");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = formType === "login";
    const isRegister = formType === "register";

    const register = async (values, onSubmitProps) => {
        console.log("in register")
        const savedUserResponse = await fetch(
            "http://localhost:3001/auth/register", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            }
        );

        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            setFormType("login");
        }
    };

    const login = async (values, onSubmitProps) => {
        console.log("in login")
        for (let value in values) {
            console.log(value, values[value])
        }
        const loggedInResponse = await fetch(
            "http://localhost:3001/auth/login", 
            {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            }
        );

        const loggedIn = await loggedInResponse.json()
        onSubmitProps.resetForm();
        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token
                })
            );
            navigate("/home");
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        for (let value in values) {
            console.log(value, values[value])
        }
        if (isLogin) await login(values, onSubmitProps)
        if (isRegister) await register(values, onSubmitProps)
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values, 
                errors,
                touched,
                handleBlur, 
                handleChange,
                handleSubmit,
                resetForm
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
                        }}
                    >
                        {isRegister && (
                            <>
                            <TextField
                            label="Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.displayName}
                            name="displayName"
                            error={
                                Boolean(touched.displayName) && Boolean(errors.displayName)
                            }
                            helperText={touched.displayName && errors.displayName}
                            sx={{ gridColumn: "span 4"}}
                            />
                            </>
                        )}
                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={
                                Boolean(touched.email) && Boolean(errors.email)
                            }
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            type="password"
                            error={
                                Boolean(touched.password) && Boolean(errors.password)
                            }
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        </Box>
                    
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                color: "black"
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        <Typography
                            onClick={() => {
                                setFormType(isLogin ? "register" : "login");
                                console.log(formType)
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                "&:hover": {
                                    cursor: "pointer"
                                }
                            }}
                        >
                            {isLogin
                                ? "Don't have an account? Sign up here." 
                                : "Already have an account? Sign in here."
                            }
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;