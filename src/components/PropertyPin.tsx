import { ICBath, ICBed, ICStar } from "../icons";
import { PropertyItem } from "./types";

export const PropertyPin = ({ item }: { item: PropertyItem; }) => {
    return (
        <div className="rounded-md w-[250px] relative pb-1">
            <img src={item.image} alt={item.name} className="w-full h-[125px] rounded-t-md" />
            <div className="w-100 absolute top-[100px] right-[10px] bg-white px-2 pt-[1px] rounded-lg font-semibold">{item.price}</div>
            <div className="mx-[10px] my-[10px]">
                <h2 className="text-base font-semibold leading-5">{item.name}</h2>
                <p className="flex items-center gap-2 mt-1 text-xs" style={{ margin: "5px 0 0 0" }}>
                    <ICStar />
                    <span>{item.ratingStars}</span>
                    <span>({item.numberOfRatings} ratings )</span>
                </p>
                <p className="flex items-center gap-2 mt-[1px] text-xs" style={{ margin: "2px 0 0 0" }}>
                    <ICBed />
                    {item.numberOfBedroom}
                </p>
                <p className="flex items-center gap-2 mt-0 text-xs" style={{ margin: "1px 0 0 0" }}>
                    <ICBath />
                    {item.numberOfBathroom}
                </p>
                <p className="text-xs text-slate-500 my-0 leading-0" style={{ margin: "5px 0 0 0" }}>
                    {item.description}
                </p>
            </div>
        </div>
    );
};
