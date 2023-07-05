import { useState } from "react";
import {
    Box, 
    IconButton, 
    InputBase,
    InputLabel,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Button
} from "@mui/material";
import { Close, Menu } from "@mui/icons-material/"
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const name = `${user.displayName}`;

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
            <Typography>Analytics</Typography>
            <Typography>Settings</Typography>
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
            {/* <InputLabel><Typography>{name}</Typography></InputLabel>
            <FormControl>
                <Select
                    value={name}
                    label={name}
                    sx={{
                        width: "50px",
                        borderRadius: "0.25rem",
                        "& .MuiSvgIcon-root":{
                            pr: "0.25rem",
                            width: "5rem"
                        }
                    }}
                    input={<InputBase />}
                    >
                    <MenuItem>Settings</MenuItem>
                    <MenuItem onClick={() => dispatch(setLogout())}>Log out</MenuItem>
                    </Select>
            </FormControl> */}
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
                <Button>Settings</Button>
                <Button onClick={() => dispatch(setLogout())}
                >Log out</Button>
            </FlexBetween>
        </Box>
    )}
    </FlexBetween>
    );
};

export default Navbar;