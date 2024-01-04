import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Header from "./Header.jsx";
import Call from "./components/Call/index.jsx";
import { BsFillArchiveFill } from "react-icons/bs";
import { LuArchive } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [callData, setcallData] = useState([]);
  const [activeTab, setActiveTab] = useState("Activity");

  const updateCallData = (id, value) => {
    const updatedData = callData.map((item) => {
      if (item.id === id) {
        return { ...item, is_archived: value };
      }
      return item;
    });
    setcallData(updatedData);
  };

  const archive = async (val) => {
    let isArchive;
    val === "all" ? (isArchive = false) : (isArchive = true);
    const filteredData = callData.filter(
      (item) => item.is_archived === isArchive && item.direction && item.from
    );

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_archived: !isArchive,
      }),
    };

    const fetchPromises = filteredData.map(async (item) => {
      const res = await fetch(
        `https://cerulean-marlin-wig.cyclic.app/activities/${item.id}`,
        options
      );
      return res;
    });

    try {
      await Promise.all(fetchPromises);
      await fetchData();
    } catch (error) {
      console.error("One or more requests failed:", error);
      toast.error(`${error.message}`);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://cerulean-marlin-wig.cyclic.app/activities"
      );
      const data = await res.json();

      setcallData(data);
      setActiveTab("Activity");
    } catch (error) {
      console.error("something went wrong fetching data:", error);
      toast.error(`${JSON.stringify(error.message)}`);
    }
  };

  const getFilteredData = () => {
    let isArchive = activeTab === "Archive";
    const filteredData = callData.filter(
      (item) => item.is_archived === isArchive && item.direction && item.from
    );
    return filteredData;
  };

  const filteredData = getFilteredData();

  const isActivity = activeTab === "Activity";

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="tab">
        <h1
          className={isActivity ? `tab-btn ${"active-tab-btn"}` : "tab-btn"}
          onClick={() => {
            setActiveTab("Activity");
          }}
        >
          Activity Feed
        </h1>
        <h1
          className={!isActivity ? `tab-btn ${"active-tab-btn"}` : "tab-btn"}
          onClick={() => {
            setActiveTab("Archive");
          }}
        >
          Archived Calls
        </h1>
      </div>
      {activeTab === "Activity" ? (
        <div className="archive-all">
          <span>Archive all</span>
          <div onClick={async () => await archive("all")}>
            <BsFillArchiveFill
              style={{
                fontSize: "0.9em",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="archive-all">
          <span>unarchive all</span>
          <div
            onClick={async () => {
              await archive("un");
            }}
          >
            <LuArchive
              style={{ fontSize: "1em", marginLeft: "10px", cursor: "pointer" }}
            />
          </div>
        </div>
      )}
      <div className="container-view hideScroll">
        {filteredData.map((item) => {
          return (
            <Call {...item} key={item.id} updateCallData={updateCallData} />
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
