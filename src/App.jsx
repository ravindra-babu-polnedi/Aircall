import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Header from "./Header.jsx";
import Call from "./components/Call";
import Tab from "./components/Tab";
import ArchiveAll from "./components/ArchiveAll";
import { BASE_URL, TOAST_OPTIONS } from "./config.js";
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

  const onClickArchiveAll = async (val) => {
    let isArchive;
    val === "all" ? (isArchive = false) : (isArchive = true);
    const filteredData = callData?.filter(
      (item) => item.is_archived === isArchive && item.direction && item.from
    );

    try {
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
        const res = await fetch(`${BASE_URL}/activities/${item.id}`, options);
        return res;
      });
      await Promise.all(fetchPromises);
      await fetchData();
    } catch (error) {
      console.error("One or more requests failed:", error);
      toast.error(`${error.message}(Too Many Requests)`, TOAST_OPTIONS);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://cerulean-marlin-wig.cyclic.app/activities"
      );
      const data = await res.json();

      setcallData(data);
    } catch (error) {
      console.error("something went wrong fetching data:", error);
      toast.error(error.message, TOAST_OPTIONS);
    }
  };

  const getFilteredData = () => {
    let isArchive = activeTab === "Archive";
    const filteredData = callData?.filter(
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
      <Tab setActiveTab={setActiveTab} isActivity={isActivity} />
      <ArchiveAll
        activeTab={activeTab}
        onClickArchiveAll={onClickArchiveAll}
        dataLength={filteredData.length}
      />
      <div className="container-view hideScroll">
        {filteredData.map((item) => {
          return (
            <Call {...item} key={item.id} updateCallData={updateCallData} />
          );
        })}
      </div>
      <ToastContainer
        style={{
          height: "30px",
          fontSize: "12px",
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
export default App;
