import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = ({ loading }) => (
    <div className="loading">
        <ClipLoader size={50} color={"#7D57FF"} loading={loading} />
    </div>
);

export default Loading;