import React, { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { Box, Button, TextField, useMediaQuery, Typography } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers"

const entrySchema = yup.object().shape({
    dayLabel: yup.string().required("required"),
    content: yup.string().required("required")
})

const initialValuesEntry = {
    dayLabel: "",
    content: ""
}

const EntryForm = () => {
    const [mode, setMode] = useState("create");
    const [date, setDate] = useState(dayjs());
    const [dayLabel, setDayLabel] = useState("");
    const [content, setContent] = useState("");
    const [postId, setPostId] = useState(undefined);
    const month = date.month()
    const day = date.date();
    const year = date.year();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isEditMode = mode === "create";
    const isUpdateMode = mode === "update";
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);

    const getEntry = useCallback(async() => {
            const entryResponse = await fetch(
                `http://localhost:3001/entries/${user._id}/${month}/${day}/${year}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (entryResponse.ok) {
                const entryData = await entryResponse.json();
                console.log("accepted promise, setting mode to update")
                console.log(entryData);
                flushSync(() => {
                    setMode("update");
                    setContent(entryData.content);
                    setDayLabel(entryData.label);
                    setPostId(entryData._id);
                })
                console.log("finished updating state in callback")
            } else {
                console.log("rejected promise, setting mode to create");
                flushSync(() => {
                    setMode("create");
                    setContent("");
                    setDayLabel("");
                })
            }
        }, [month, day, year]);

        useEffect(() => {
            getEntry()
        }, [getEntry])

    const postEntry = async (values, onSubmitProps) => {
        const formData = new FormData();
        console.log(user._id);
        formData.append("userId", user._id);
        formData.append("dayLabel", dayLabel);
        formData.append("content", content);
        formData.append("month", month);
        formData.append("day", day);
        formData.append("year", year);
        console.log("making POST request")

        const savedEntryResponse = await fetch(
            "http://localhost:3001/entries/",
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`,
            },
                body: formData
            }
        )

        const savedEntry = await savedEntryResponse.json();
        if (savedEntry) {
            setMode("update")
            console.log("properly saved")
        }
    };

    const putEntry = async (values, onSubmitProps) => {
        const formData = new FormData();
        formData.append("label", dayLabel);
        formData.append("content", content);

        const updatedEntryResponse = await fetch(
            `http://localhost:3001/entries/${postId}`,
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            }
        )

        const updatedEntry = await updatedEntryResponse.json();
        if (updatedEntry) {
            console.log("properly updated")
            setMode("update")
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        console.log("clicked button")
        if (isEditMode) await postEntry(values, onSubmitProps)
        if (isUpdateMode) await putEntry(values, onSubmitProps)
    }


    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesEntry}
            validationSchema={entrySchema}
        >
            {({
                errors, 
                touched, 
                handleBlur, 
                handleChange, 
                handleSubmit,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        width="100%"
                        padding="2rem 6%"
                        display={isNonMobile ? "flex": "block"}
                        gap="3rem"
                        justifyContent="space-between"
                    >
                        <Box 
                            flexBasis={isNonMobile ? "50%" : undefined}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={date}
                                    onChange={async(newDate) => {
                                        setDate(newDate)
                                    }
                                    }
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box
                            flexBasis={isNonMobile ? "50%" : undefined}
                            display="grid"
                            gap="20px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
                            }}
                        >
                            <Typography>Today was:</Typography>
                            <TextField
                                label="Adjective"
                                onBlur={(e) => handleBlur(e)}
                                onChange={(e) => {
                                    handleChange(e)
                                    setDayLabel(e.target.value)}}
                                value={dayLabel}
                                name="dayLabel"
                                error={
                                    Boolean(touched.dayLabel) && Boolean(errors.dayLabel)
                                }
                                helperText={touched.dayLabel && errors.dayLabel}
                                sx={{ gridColumn: "span 4"}}
                            />
                            <TextField
                                label="Details"
                                multiline
                                minRows="35"
                                maxRows="35"
                                onBlur={(e) => handleBlur(e)}
                                onChange={(e) => {
                                    handleChange(e)
                                    setContent(e.target.value)}}
                                value={content}
                                name="content"
                                error={
                                    Boolean(touched.content) && Boolean(errors.content)
                                }
                                helperText={touched.content && errors.content}
                                sx={{ gridColumn: "span 4"}}
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
                                {isUpdateMode 
                                ? "UPDATE"
                                : "SUBMIT"
                                }
                            </Button>
                        </Box>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default EntryForm;