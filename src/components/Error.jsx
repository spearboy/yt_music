import React from "react";
import { MdOutlineError } from "react-icons/md";

const Error = ({ message }) => (
    <div className="error">
        <MdOutlineError />
        <span>{message}</span>
    </div>
);

export default Error;