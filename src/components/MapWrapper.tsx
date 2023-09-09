import { ICReset, ICSearch } from "../icons";
import React, { useState } from "react";
import Map from "./Map";
import { PropertyItem } from "./types";
import data from "../data/data.json";
import { defaultCenter, defaultZoom, defaultZoomMobile } from "./constants";
import { Tooltip } from "./Tooltip";
import { Modal } from "./Modal";
import { detectMobile } from "./utils";

const MapWrapper = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    city: "",
    province: "",
  });
  const [centerLatLng, setCenterLatLng] = useState<L.LatLngExpression>(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [filteredData, setFilteredData] = useState(data);
  const [searchError, setSearchError] = useState("");
  const isMobile = detectMobile();
  // Format Data
  const formattedData: PropertyItem[] = filteredData.map((d, i) => ({
    ...d,
    image: `images/house${(i + 1) % 10}.jpg`,
    ratingStars: (Math.random() * 5 + 1).toFixed(1),
    numberOfRatings: Math.floor(Math.random() * 100 + 1),
    numberOfBedroom: Math.floor(Math.random() * 4 + 1),
    numberOfBathroom: Math.floor(Math.random() * 3 + 1),
  }));

  // Handler
  const handleSearch = () => {
    const filterdProvinceData = data.filter((item) => item.province.includes(searchQuery.province));
    const filterdCityData = filterdProvinceData.filter((item) => item.city.includes(searchQuery.city));
    setFilteredData(filterdCityData);
    if (filterdCityData.length === 0) setSearchError("No property found!");
    if (filterdCityData.length > 0 && (!!searchQuery.province || !!searchQuery.city)) {
      setCenterLatLng([filterdCityData[0].latitude, filterdCityData[0].longitude]);
      setZoom(8);
      setSearchError("")
    }
  };

  const resetMap = () => {
    setSearchQuery({ province: "", city: "" });
    setFilteredData(data);
    setCenterLatLng(defaultCenter);
    setZoom(isMobile ? defaultZoomMobile : defaultZoom);
  };

  return (
    <div className="w-screen h-screen relative">
      <Map centerLatLng={centerLatLng} zoom={zoom} data={formattedData} />
      <Modal openModal={openModal} setOpenModal={setOpenModal} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} searchError={searchError} />
      <div className="absolute right-5 top-2 z-[900] flex">
        <Tooltip content="Reset Map">
          <button className="shadow-md bg-white hover:bg-slate-100 focus:ring-4 rounded-full p-2 mr-5" onClick={resetMap}>
            <ICReset />
          </button>
        </Tooltip>
        <Tooltip content="Search Property">
          <button className="shadow-md bg-white hover:bg-slate-100 focus:ring-4 rounded-full p-2" onClick={() => setOpenModal(true)}>
            <ICSearch />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default MapWrapper;
