import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form"

const SignInAndUpPage = () => {
    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
    const theme = useTheme();

    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={theme.palette.background.default}
                textAlign="center"
            >
                <Typography variant="title">
                    Hello Journal
                </Typography>
            </Box>
            <Box
                width={isNonMobileScreen ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
            >
            <Form />
            </Box>
        </Box>
    )
};

export default SignInAndUpPage;