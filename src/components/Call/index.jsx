import React, { useState } from "react";
import "./index.css";
import { MdPhoneMissed } from "react-icons/md";
import { FaVoicemail } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { MdOutlineCallReceived, MdOutlineCallMade } from "react-icons/md";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { toast } from "react-toastify";
import { BASE_URL, TOAST_OPTIONS } from "../../config";

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

  const condition = clicked === true;
  const upperContainerStyle = condition ? "upper-container" : "";
  const lowerContainerStyle = condition ? "lower-container" : "";

  if (direction === "outbound") {
    NumberToRender = to;
    DirectionToRender = <MdOutlineCallMade className="outline-call" />;
  } else {
    NumberToRender = from;
    DirectionToRender = <MdOutlineCallReceived className="outline-call" />;
  }

  switch (call_type) {
    case "answered":
      componentToRender = <IoIosCall className="outline-call" />;
      break;
    case "missed":
      componentToRender = <MdPhoneMissed className="outline-call" />;
      break;
    case "voicemail":
      componentToRender = <FaVoicemail className="outline-call" />;
      break;
    default:
      componentToRender = null;
  }

  const onClickArchive = async (archive) => {
    let value;
    archive === "in" ? (value = true) : (value = false);

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_archived: value,
      }),
    };

    const res = await fetch(`${BASE_URL}/activities/${id}`, options);

    if (res.ok === true && res.status === 200) {
      updateCallData(id, value);
      toast.success(
        `${
          archive === "in"
            ? "Call archived successfully!"
            : "unarchived successfully!"
        }`,
        TOAST_OPTIONS
      );
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

  return (
    <div className="outer-container" onClick={onclick}>
      <div className={`call-container ${upperContainerStyle}`}>
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
              <BiArchiveOut className="archive-icon" />
            </div>
          ) : (
            <div
              onClick={(e) => {
                onClickArchive("in");
                e.stopPropagation();
              }}
            >
              <BiArchiveIn className="archive-icon" />
            </div>
          )}
        </div>
      </div>
      {clicked && (
        <div className={`call-container second ${lowerContainerStyle}`}>
          <div className="number">{formatDuration(duration)}</div>
          <div className="number">{call_type}</div>
        </div>
      )}
    </div>
  );
};

export default Call;
