import { useState, useEffect, useRef } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { HiPlayPause } from "react-icons/hi2";
import { LuTimerReset } from "react-icons/lu";
import "./App.css";

function App() {
  const [breaky, setBreaky] = useState(5);
  const [session, setSession] = useState(25);
  const [active, setActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(session * 60);
  const [mode, setMode] = useState<'session' | 'break'>('session');
  let intervalId = useRef<NodeJS.Timeout | null>(null);

  const updateBreak = (btn: string) => {
    if (btn === "down") {
      if (breaky > 1) {
        setBreaky((prev) => prev - 1);
      }
    } else {
      if (breaky < 60) {
        setBreaky((prev) => prev + 1);
      }
    }
  };

  const updateSession = (btn: string) => {
    if (btn === "down") {
      if (session > 1) {
        setSession((prev) => prev - 1);
      }
    } else {
      if (session < 60) {
        setSession((prev) => prev + 1);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };
  
  const resetTimer = () => {
    setActive(false);
    setBreaky(5);
    setSession(25);
    setTimeLeft(session * 60);
    setMode('session');
    const audio = document.getElementById('beep') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  useEffect(() => {
    if (active) {
      intervalId.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft < 1) {
            if (mode === 'session') {
              setMode('break');
              return breaky * 60;
            } else {
              setMode('session');
              return session * 60;
            }
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    } else {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
    }
    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
    };
  }, [active, mode, breaky, session]);

  useEffect(() => {
    setTimeLeft(session * 60);
  }, [session]);

  useEffect(() => {
    if (timeLeft === 0) {
      const audio = document.getElementById('beep') as HTMLAudioElement;
      if (audio) {
        audio.play();
      }
    }
  }, [timeLeft]);

  return (
    <>
      <div className="container">
        <div className="clock">
          <h1>25 + 5 Clock</h1>
          <div className="labels">
            <div id="break-label">
              Break Length
              <div className="parameters">
                <button
                  id="break-decrement"
                  onClick={() => updateBreak("down")}
                  disabled={active}
                >
                  <FaArrowDown />
                </button>
                <div id="break-length">{breaky}</div>
                <button
                  id="break-increment"
                  onClick={() => updateBreak("up")}
                  disabled={active}
                >
                  <FaArrowUp />
                </button>
              </div>
            </div>
            <div id="session-label">
              Session Length
              <div className="parameters">
                <button
                  id="session-decrement"
                  onClick={() => updateSession("down")}
                  disabled={active}
                >
                  <FaArrowDown />
                </button>
                <div id="session-length">{session}</div>
                <button
                  id="session-increment"
                  onClick={() => updateSession("up")}
                  disabled={active}
                >
                  <FaArrowUp />
                </button>
              </div>
            </div>
          </div>
          <div className="session-box">
            <div id="timer-label" style={{ color: timeLeft < 60 ? 'red' : 'inherit' }}>{mode === "session" ? "Session" : "Break"}</div>
            <div id="time-left" style={{ color: timeLeft < 60 ? 'red' : 'inherit' }}>{formatTime(timeLeft)}</div>
          </div>
          <div className="timer-controls">
            <button id="start_stop" onClick={() => setActive(!active)}>
              <HiPlayPause />
            </button>
            <button id="reset" onClick={resetTimer}>
              <LuTimerReset />
            </button>
          </div>
        </div>
      </div>
      <audio id="beep" src="/alarm.mp3"></audio>
    </>
  );
}

export default App;
