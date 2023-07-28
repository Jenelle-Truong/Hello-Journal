import {
    Box, 
    Button,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"), 
    password: yup.string().required("required")
});

const initialValuesLogin = {
    email: "",
    password: ""
}

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const login = async (values, onSubmitProps) => {
        console.log("in login")
        for (let value in values) {
            console.log(value, values[value])
        }
        const loggedInResponse = await fetch(
            "http://localhost:3001/api/auth/login", 
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
                    user: loggedIn.registeredUser,
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
        await login(values, onSubmitProps)
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesLogin}
            validationSchema={loginSchema}
        >
            {({
                values, 
                errors,
                touched,
                handleBlur, 
                handleChange,
                handleSubmit,
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
                        <Typography
                            sx={{
                                textAlign: "center",
                                gridColumn: "span 4"
                            }}
                        >
                        * WEBAPP DEMO * 
                        </Typography>
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
                           LOGIN 
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;