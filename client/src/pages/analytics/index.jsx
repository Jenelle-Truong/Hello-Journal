import { Box, Typography } from "@mui/material";
import LineGraph from "components/LineGraph";
import FlexBetween from "components/FlexBetween";
import Navbar from "pages/navbar";

const AnalyticsPage = () => {
    return (
        <Box>
            <Navbar />
            <FlexBetween padding="0.5em 2%">
                <Typography
                    fontSize="clamp(.75rem, 1.25rem, 1.75rem)"
                >
                    My last month at a glance
                </Typography>
            </FlexBetween>
            <LineGraph />
        </Box>
    );
}

export default AnalyticsPage;