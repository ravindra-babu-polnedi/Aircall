import React, { useState } from "react";
import "./index.css";
import { MdPhoneMissed } from "react-icons/md";
import { FaVoicemail } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { MdOutlineCallReceived, MdOutlineCallMade } from "react-icons/md";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";

const Call = ({
  direction,
  to,
  from,
  call_type,
  duration,
  is_archived,
  updateCallData,
  id,
}) => {
  const [clicked, setClicked] = useState(false);

  let NumberToRender = direction === "outbound" ? to : from;
  let DirectionToRender;
  let componentToRender;

  if (direction === "outbound") {
    NumberToRender = to;
    DirectionToRender = (
      <MdOutlineCallMade style={{ fontSize: "1.5em", color: "#19bf56" }} />
    );
  } else {
    NumberToRender = from;
    DirectionToRender = (
      <MdOutlineCallReceived style={{ fontSize: "1.5em", color: "#19bf56" }} />
    );
  }

  switch (call_type) {
    case "answered":
      componentToRender = (
        <IoIosCall style={{ fontSize: "1.5em", color: "#19bf56" }} />
      );
      break;
    case "missed":
      componentToRender = (
        <MdPhoneMissed style={{ fontSize: "1.5em", color: "#19bf56" }} />
      );
      break;
    case "voicemail":
      componentToRender = (
        <FaVoicemail style={{ fontSize: "1.5em", color: "#19bf56" }} />
      );
      break;
    default:
      componentToRender = null;
  }

  const onClickArchive = async (Archive) => {
    let value;
    Archive === "in" ? (value = true) : (value = false);
    console.log("id", id);
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_archived: value,
      }),
    };

    const res = await fetch(
      `https://cerulean-marlin-wig.cyclic.app/activities/${id}`,
      options
    );
    console.log("res", res);
    if (res.ok === true && res.status === 200) {
      updateCallData(id, value);
    }
  };

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const onclick = () => {
    setClicked((prevState) => !prevState);
  };

  const upperStyle = clicked === true ? "upper-container" : "";
  const lowerStyle = clicked === true ? "lower-container" : "";
  return (
    <div className="outer-container" onClick={onclick}>
      <div className={`call-container ${upperStyle}`}>
        <div>{DirectionToRender}</div>

        <div className="number">{NumberToRender}</div>

        <div>{componentToRender}</div>

        <div>
          {is_archived ? (
            <div
              onClick={(e) => {
                onClickArchive("out");
                e.stopPropagation();
              }}
            >
              <BiArchiveOut style={{ fontSize: "1.3em", color: "#19bf56" }} />
            </div>
          ) : (
            <div
              onClick={(e) => {
                onClickArchive("in");
                e.stopPropagation();
              }}
            >
              <BiArchiveIn style={{ fontSize: "1.3em", color: "#19bf56" }} />
            </div>
          )}
        </div>
      </div>
      {clicked && (
        <div className={`call-container second ${lowerStyle}`}>
          <div className="number">{formatDuration(duration)}</div>
          <div className="number">{call_type}</div>
        </div>
      )}
    </div>
  );
};

export default Call;
