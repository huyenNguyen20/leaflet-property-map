import { Dialog } from "@headlessui/react";
import { ICSearch } from "../icons";
import React from "react";
import { provinceCodes } from "./constants";
import { SearchQuery } from "./types";

export type ModalProps = {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    searchQuery: SearchQuery;
    setSearchQuery: (value: SearchQuery) => void;
    handleSearch: () => void;
    searchError: string;
};

export const Modal = ({ openModal, setOpenModal, searchQuery, setSearchQuery, handleSearch, searchError }: ModalProps) => {
    return (
        <Dialog open={openModal} onClose={() => setOpenModal(false)} className="absolute top-12 right-2 z-[900] w-[300px] bg-white py-3 px-5 rounded-lg shadow-md">
            <Dialog.Panel>
                <Dialog.Title className="flex items-center gap-2 font-semibold text-lg">
                    <ICSearch /> Property Lookup
                </Dialog.Title>
                <Dialog.Description>
                    <div className="w-full max-w-xs mt-2">
                        <form className="bg-white rounded p-0">
                            <div className="mb-0">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                    City
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={(e) => setSearchQuery({ ...searchQuery, city: e.target.value || "" })}
                                    id="city"
                                    type="text"
                                    placeholder="City"
                                    value={searchQuery.city} />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="province">
                                    Province
                                </label>
                                <select
                                    value={searchQuery.province}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, province: e.target.value || "" })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="province"
                                    placeholder="Province"
                                >
                                    {provinceCodes.map((code, index) => (
                                        <option key={index} className="text-xs" value={code.value}>
                                            {code.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`} type="button" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        </form>
                        {!!searchError && <p className="text-red-500 mt-2">{searchError}</p>}
                    </div>
                </Dialog.Description>
            </Dialog.Panel>
        </Dialog>
    );
};
