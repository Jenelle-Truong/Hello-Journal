import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../navbar";
import EntryForm from "components/EntryForm";

const HomePage = () => {
    const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

    return (
    <Box>
        <Navbar />
        <Box
            width="50%"
            justifyContent="center"
            display={isNonMobileScreen ? "flex" : "block"}    
        >
           <EntryForm /> 
        </Box>
    </Box>
    );
};

export default HomePage;
