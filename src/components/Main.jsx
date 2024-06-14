import React from "react";

const Main = (prop) => {
    return (
        <main id="main" role="main">
            {prop.children}
        </main>
    );
};

export default Main;