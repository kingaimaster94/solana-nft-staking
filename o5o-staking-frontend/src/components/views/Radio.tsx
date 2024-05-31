/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";

interface RadioInterface {
    name: string;
    selected: boolean;
    handleChange: (
        name : string,
        e: boolean,
    ) => void;
}

const Radio = (props: RadioInterface) => {
    console.log('radio props', props)
    const {selected} = props
    return (
        <div className="flex items-center  my-4">
            <input
                id={props.name}
                type="checkbox"
                name={props.name}
                className="hidden"
                defaultChecked={selected}
                onChange={(e) => {
                    props.handleChange(props.name, e.target.checked);
                }}
            />
            <label
                htmlFor={props.name}
                className="flex items-center cursor-pointer"
            >
                <span className="w-6 h-6 inline-block mr-1 rounded-full border border-white opacity-50"></span>
                <p className="ml-4">{props.name}</p>
            </label>
        </div>
    );
};

export default Radio;
