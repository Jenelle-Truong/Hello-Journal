import React, { useCallback, useEffect, useState, useContext, createContext } from "react";
import { flushSync } from "react-dom";
import { useSelector } from "react-redux";
import { useFormikContext, Formik } from "formik";
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

const context = createContext();

const UpdateFormValues = () => {
    const [mode, setMode, dayLabel, setDayLabel, content, setContent, date, token, user] = useContext(context)
    const month = date.month()
    const day = date.date();
    const year = date.year();
    const { values, resetForm, setFieldValue } = useFormikContext();
    const getEntry = useCallback( async() => {
            const entryResponse = await fetch(
                `http://localhost:3001/entries/${user._id}/${month}/${day}/${year}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (!entryResponse.ok) {
                // const entryData = await entryResponse.json();
                // console.log("accepted promise, setting mode to update")
                // console.log(entryData);
                // setMode("update");
                // setContent(entryData.content);
                // setDayLabel(entryData.label);
                entryResponse
                    .json()
                    .then(entryResponse => {
                        setMode("update")
                        setContent(entryResponse.content)
                        setDayLabel(entryResponse.label)
                    }) 
                console.log("finished updating state in callback")
            } else {
                console.log("rejected promise, setting mode to create");
                setMode("create");
                setContent("");
                setDayLabel("")
            };
            setFieldValue("content", content)
            setFieldValue("label", dayLabel)
            
            resetForm({
                values: {
                    content, 
                    dayLabel
                }
            })
        }, [date]);

        // useEffect(() => {
        //     getEntry()
        //     console.log(`content ${content}`)
        //     console.log(`label ${dayLabel}`)
        //     // setFieldValue("content", content)
        //     // setFieldValue("label", dayLabel)
            
        //     // resetForm({
        //     //     values: {
        //     //         content, 
        //     //         dayLabel
        //     //     }
        //     // })
        // }, [getEntry])
        // useEffect(async() => {
        //     const entryResponse = await fetch(
        //         `http://localhost:3001/entries/${user._id}/${month}/${day}/${year}`,
        //         {
        //             method: "GET",
        //             headers: { Authorization: `Bearer ${token}` }
        //         }
        //     );
        //     if (!entryResponse.ok) {
        //         // const entryData = await entryResponse.json();
        //         // console.log("accepted promise, setting mode to update")
        //         // console.log(entryData);
        //         // setMode("update");
        //         // setContent(entryData.content);
        //         // setDayLabel(entryData.label);
        //         entryResponse
        //             .json()
        //             .then(entryResponse => {
        //                 setMode("update")
        //                 setContent(entryResponse.content)
        //                 setDayLabel(entryResponse.label)
        //             }) 
        //         console.log("finished updating state in callback")
        //     } else {
        //         console.log("rejected promise, setting mode to create");
        //         setMode("create");
        //         setContent("");
        //         setDayLabel("")
        //     };
        //     setFieldValue("content", content)
        //     setFieldValue("label", dayLabel)
            
        //     resetForm({
        //         values: {
        //             content, 
        //             dayLabel
        //         }
        //     })
        // }, [])
        useEffect(() => {
            setFieldValue("content", values["content"])
            setFieldValue("label", values[dayLabel])
        }, [values]);
    return null;
}

const EntryForm = () => {
    const [mode, setMode] = useState("create");
    const [date, setDate] = useState(dayjs());
    const [dayLabel, setDayLabel] = useState("");
    const [content, setContent] = useState("");
    const [isRun, setIsRun] = useState(false);
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
                // const entryData = await entryResponse.json();
                // console.log("accepted promise, setting mode to update")
                // console.log(entryData);
                // setMode("update");
                // setContent(entryData.content);
                // setDayLabel(entryData.label);
                entryResponse
                    .json()
                    .then(entryResponse => {
                        flushSync(() => {
                        setMode("update")
                        setContent(entryResponse.content)
                        setDayLabel(entryResponse.label)

                        })
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

    // useEffect(() => {
    //     const getEntry2 = async() => {
    //         const entryResponse = await fetch(
    //             `http://localhost:3001/entries/${user._id}/${month}/${day}/${year}`,
    //             {
    //                 method: "GET",
    //                 headers: { Authorization: `Bearer ${token}` }
    //             }
    //         );
    //         if (entryResponse.ok) {
    //             // const entryData = await entryResponse.json();
    //             // console.log("accepted promise, setting mode to update")
    //             // console.log(entryData);
    //             // setMode("update");
    //             // setContent(entryData.content);
    //             // setDayLabel(entryData.label);
    //             entryResponse
    //                 .json()
    //                 .then(entryResponse => {
    //                     setMode("update")
    //                     setContent(entryResponse.content)
    //                     setDayLabel(entryResponse.label)
    //                     setFieldValue("content", entryResponse.content)
    //                     setFieldValue("dayLabel", entryResponse.label)
    //                 }) 
    //             console.log("finished updating state in callback")
    //         } else {
    //             console.log("rejected promise, setting mode to create");
    //             setMode("create");
    //             setContent("");
    //             setDayLabel("");
    //             setFieldValue("content", "")
    //             setFieldValue("dayLabel", "")
    //             }
    //     };

    // }, []);

    const postEntry = async (values, onSubmitProps) => {
        const formData = new FormData();
        console.log(user._id);
        formData.append("userId", user._id);
        formData.append("dayLabel", values["dayLabel"]);
        formData.append("content", values["content"]);
        formData.append("month", month);
        formData.append("day", day);
        formData.append("year", year);
        console.log("making POST request")
        console.log(values["content"])
        console.log(values["dayLabel"])
        // for (let value in values) {
        //     formData.append(value, values[value])
        //     console.log(value, values[value])
        // }
        // formData.append("date", date);

        const savedEntryResponse = await fetch(
            "http://localhost:3001/entries",
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`,
            },
                body: formData
            }
        )

        const savedEntry = await savedEntryResponse.json();
        if (savedEntry) {
            console.log("properly saved")
        }
    };

    const putEntry = async (values, onSubmitProps) => {
        const formData = new FormData();
        formData.append("userId", user);
        formData.append("label", values["label"]);
        formData.append("content", values["content"]);
        formData.append("month", month);
        formData.append("day", day);
        formData.append("year", year);

        const updatedEntryResponse = await fetch(
            "http://localhost:3001/entries",
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            }
        )

        const updatedEntry = await updatedEntryResponse.json();
        if (updatedEntry) {
            console.log("properly updated")
            setMode("updated")
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isEditMode) await postEntry(values, onSubmitProps)
        if (isUpdateMode) await putEntry(values, onSubmitProps)
    }

    return (
        <context.Provider value={[mode, setMode, dayLabel, setDayLabel, content, setContent, date, token, user]} >
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesEntry}
            validationSchema={entrySchema}
        >
            {({
                values, 
                errors, 
                touched, 
                handleBlur, 
                handleChange, 
                handleSubmit,
                setFieldValue,
                resetForm
            }) => (
                <form onSubmit={handleSubmit}>
                    {/* <UpdateFormValues /> */}
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
        // if (isRun) {
        //     return;
        // }
        // setIsRun(true);
        // fetch(
        //         `http://localhost:3001/entries/${user._id}/${month}/${day}/${year}`,
        //         {
        //             method: "GET",
        //             headers: { Authorization: `Bearer ${token}` }
        //         }
        // ).then(entryResponse => {
        //     if (entryResponse.ok) {
        //         const entryData = entryResponse.json();
        //         console.log("accepted promise, setting mode to update")
        //         console.log(entryData);
        //         setMode("update");
        //         setContent(entryData.content);
        //         setDayLabel(entryData.label);
        //     } else {
        //         console.log("rejected promise, setting mode to create");
        //         setMode("create");
        //         setContent("");
        //         setDayLabel("");
        //     }
        //     resetForm({
        //         values: {
        //             content, 
        //             dayLabel
        //         }
        //     }) 
        //     setIsRun(false);
        // })
                //                         getEntry()
                // resetForm({
                //     values: {
                //         content, 
                //         dayLabel
                //     }
                // })

            // const entryResponse = await fetch(
            //     `http://localhost:3001/entries/${user._id}/${month}/${day}/${year}`,
            //     {
            //         method: "GET",
            //         headers: { Authorization: `Bearer ${token}` }
            //     }
            // );
            // if (entryResponse.ok) {
            //     const entryData = await entryResponse.clone().json();
            //     console.log("accepted promise, setting mode to update")
            //     console.log(entryData);
            //     setMode("update");
            //     setContent(entryData.content);
            //     setDayLabel(entryData.label);
            //     entryResponse
            //         .json()
            //         .then(entryResponse => {
            //             setMode("update")
            //             setContent(entryResponse.content)
            //             setDayLabel(entryResponse.label)
            //         }) 
            //     setFieldValue("content", entryResponse.content)
            //     setFieldValue("label", entryResponse.dayLabel)
            //     console.log("finished updating state in callback")
            // } else {
            //     console.log("rejected promise, setting mode to create");
            //     setMode("create");
            //     setContent("");
            //     setDayLabel("");
            //     setFieldValue("content", "")
            //     setFieldValue("label", "")
            // }
            //     resetForm({
            //         values: {
            //             content, 
            //             dayLabel
            //         }
            //     })
                                        // console.log("date changed")
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
                                onBlur={handleBlur}
                                onChange={handleChange}
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
                                onBlur={handleBlur}
                                onChange={(e) => setContent(e.target.value)}
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
        </context.Provider>
    )
}

export default EntryForm;