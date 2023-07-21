import { useState } from "react";
import {
    Box, 
    IconButton, 
    Typography,
    useMediaQuery,
    Button
} from "@mui/material";
import { Close, Menu } from "@mui/icons-material/"
import { useDispatch } from "react-redux";
import { setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

    return (
    <FlexBetween padding="0.5em 2%">
        <Typography variant="title"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            onClick={() => navigate("/home")}
            sx={{
                "&:hover": {
                    cursor: "pointer"
                }
            }}
        >
            Hello Journal
        </Typography>
    
    {isNonMobileScreen ? (
        <FlexBetween gap="4rem">
            <Typography
                onClick={()=> navigate("/home")}
                sx={{
                    "&:hover": {
                        cursor: "pointer"
                    }
                }}
            >
                Home
            </Typography>
            <Typography
                onClick={() => navigate("/analytics")}
                sx={{
                    "&:hover": {
                        cursor: "pointer"
                    }
                }}
            >
                Analytics
            </Typography>
            <Typography
                onClick={()=> dispatch(setLogout())}
                sx={{
                    "&:hover": {
                        cursor: "pointer"
                    }
                }}
            >
                Log out
            </Typography>
        </FlexBetween>
    ) : (
        <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
            <Menu />
        </IconButton>
    )}
    
    {!isNonMobileScreen && isMobileMenuToggled && (
        <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"            
        >
            <Box display="flex" justifyContent="flex-end" p="1rem">
                <IconButton 
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Close />
                </IconButton>
            </Box>

            <FlexBetween
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="3rem"
            >
                <Button onClick={() => navigate("/analytics")}
                >Analytics</Button>
                <Button onClick={() => dispatch(setLogout())}
                >Log out</Button>
            </FlexBetween>
        </Box>
    )}
    </FlexBetween>
    );
};

export default Navbar;