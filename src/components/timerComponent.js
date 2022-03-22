import React, { useState, useEffect, useRef } from "react";
import useGlobalState from "../store";
import { updateTimeState } from "../store/actions";
import { ADMIN_SERVICE } from "../services/admin.services";

const TimerComponent = () => {

  const {
    state: {
      timeCount,
      timeStarted,
      user: {
        details
      }
    },
    dispatch
  } = useGlobalState();

  const [time, setTime] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(0);

  let intervalRef = useRef();

  function secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  const decreaseSeconds = () => setSeconds(prevSeconds => prevSeconds - 1);

  const stopTimer = async() => {
    try{
      setLoading(true);
      const responseData = await ADMIN_SERVICE.finishTimer({ "userId": details.userId, "flag": false, "votingTimeLeft": 0 });

      if(responseData.success) {
        dispatch(updateTimeState({
          timeStarted: false,
          timeCount: 0
        }));
      }
    }catch(error) {
      console.log("error while finishing time (stopTimer) ", error);
    }
    clearInterval(intervalRef.current);
    setLoading(false);
  }

  useEffect(() => {
    if(seconds >= 0) {
      intervalRef.current = setInterval(decreaseSeconds, 1000);
      setTime(secondsToTime(seconds));
      return () => clearInterval(intervalRef.current);
    }
    if(seconds + 1 === 0) {
      stopTimer();
    }
  }, [seconds]);

  useEffect(() => {
    if(timeStarted) {
      setSeconds(parseInt(timeCount * 60 * 60));
    }
  }, [timeStarted]);

  return (
    <div className="timeContainerDiv" >
      <div className="timeNumbersDiv" >
        <div className="eachCounterDiv" >
          <p className="timerType" >Hours</p>
          <p className="timerNumber"> {time.h} </p>
        </div>

        <div className="eachCounterDiv" >
          <p className="timerType">Minutes</p>
          <p className="timerNumber"> {time.m} </p>
        </div>

        <div className="eachCounterDiv" >
          <p className="timerType">Seconds</p>
          <p className="timerNumber"> {time.s} </p>
        </div>
      </div>

      <div className="timerButton" onClick={stopTimer}>
        <svg width="277" height="62">
          <defs>
            <linearGradient id="grad1">
              <stop offset="0%" stopColor="#FF8282" />
              <stop offset="100%" stopColor="#E178ED" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad1)" width="266" height="50"></rect>
        </svg>
        <button className="timerButtonTrigger" type="submit" >{loading ? "Stopping" : "Finish"}</button>
      </div>
    </div>
  );
}

export default TimerComponent;