import React, { FC, useState, useRef } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button } from "reactstrap";
import debounce from "lodash/debounce";

interface IWeatherForecast {
    summary: string;
}

export const MyForm: FC = () => {
    const [name, setName] = useState<string>("");
    const [weatherSummary, setWeatherSummary] = useState<string>("");
    const validatedWeatherSummary = useRef({ value: undefined as string | undefined, valid: false }).current;

    const validate = useRef(
        debounce((value: string, ctx: any, input: any, cb: any) => {
            const validateAsync = async () => {
                const result = await fetch("https://localhost:5001/WeatherForecast/");
                const resultJson = await result.json() as IWeatherForecast[];
                validatedWeatherSummary.valid = resultJson.some(r => r.summary === value);
                validatedWeatherSummary.value = value;
                cb(validatedWeatherSummary.valid);
            };
            if (
                (validatedWeatherSummary.value !== undefined && validatedWeatherSummary.value !== value) // Validate if different value
             || (value !== "" && validatedWeatherSummary.value === undefined) // Initial validation on first value change
            ) {
                validateAsync();
            } else {
                cb(validatedWeatherSummary.valid);
            }
        }, 300)
    ).current;

    // const validate = useRef(
    //     debounce((value: string, ctx: any, input: any, cb: any) => {
    //         const validateAsync = async () => {
    //             const result = await fetch("https://localhost:5001/WeatherForecast/");
    //             const resultJson = await result.json() as IWeatherForecast[];
    //             cb(resultJson.some(r => r.summary === value));
    //         };
    //         validateAsync();
    //     }, 300)
    // ).current;

    // let validateTimeout: number = 0;
    // const validate = debounce((value: string, ctx: any, input: any, cb: any) => {
    //     const validateAsync = async () => {
    //         const result = await fetch("https://localhost:5001/WeatherForecast/");
    //         const resultJson = await result.json() as IWeatherForecast[];
    //         cb(resultJson.some(r => r.summary === value));
    //     };
    //     window.clearTimeout(validateTimeout);
    //     validateTimeout = window.setTimeout(() => {
    //         validateAsync();
    //     }, 500);
    // }, 300);

    return (
        <div>
            <AvForm>
                <AvField name="name" label="Name" required onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value) }} />
                <AvField name="async" label="Async Validation (enter 'Warm')" type="text" validate={{async: validate}} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setWeatherSummary(e.target.value) }} />
                <Button color="primary">Submit</Button>
            </AvForm>
        </div>
    )
}