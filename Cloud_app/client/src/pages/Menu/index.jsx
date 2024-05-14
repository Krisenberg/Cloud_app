import React from "react";
import classes from './Menu.module.css';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Menu = () => {

    const navigate = useNavigate();

    function navigateToProfile() {
        navigate("/profile");
    }

    function navigateToGame() {
        navigate("/game");
    }

    return (
        <div className={`${classes.fullScreenContainer}`}>
            <main className={`${classes.main}`}>
                <div className={`${classes.mainDiv}`}>
                    <h1 className={`${classes.bigTitle}`}>TIC TAC TOE</h1>
                    <div className={`${classes.subtitle}`}>welcome to the game!</div>
                    <div className={`${classes.line}`}/>
                </div>
                <div className={`${classes.buttonsDiv}`}>
                    <button className="customButton" role="button" onClick={navigateToGame}><span className="text">Play</span></button>
                    <button className="customButton" role="button" onClick={navigateToProfile}><span className="text">Profile</span></button>
                </div>
            </main>
        </div>
    );
}

export default Menu;