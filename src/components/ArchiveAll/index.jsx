import React from "react";
import "./index.css";
import { BsFillArchiveFill } from "react-icons/bs";
import { LuArchive } from "react-icons/lu";

const ArchiveAll = ({ activeTab, onClickArchiveAll, dataLength }) => {
  return (
    <>
      {dataLength === 0 ? (
        <div className="text">
          {activeTab === "Activity"
            ? "No Activity Found "
            : "No Archived Calls"}
        </div>
      ) : (
        <>
          {activeTab === "Activity" ? (
            <div className="archive-all">
              <span>Archive all</span>
              <div onClick={async () => await onClickArchiveAll("all")}>
                <BsFillArchiveFill className="icon font-1" />
              </div>
            </div>
          ) : (
            <div className="archive-all">
              <span>unarchive all</span>
              <div
                onClick={async () => {
                  await onClickArchiveAll("un");
                }}
              >
                <LuArchive className="icon font-2" />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ArchiveAll;
