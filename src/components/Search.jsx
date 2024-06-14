import React from "react";
import { LuSearch } from "react-icons/lu";

const Search = () => {
    return (
        <article className="search">
            <label htmlFor="searchInput">
                <LuSearch />
            </label>
            <input type="text" placeholder="Search" id="searchInput" />
        </article>
    );
};

export default Search;