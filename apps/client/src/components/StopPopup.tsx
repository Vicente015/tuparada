import { Menu, Star } from "lucide-react";
import { trpc } from "../utils/trpc";
import { TRPCProvider } from "./TRPCProvider";
import type { inferRouterOutputs } from "@trpc/server";
import { useMemo } from "react";

import type { AppRouter } from "@tuparada/server/src/routers/_app";
import Wrapper from "./Wrapper";

type IncomingBusType = inferRouterOutputs<
    AppRouter
>["paradas"]["get"]["lines"][number];

interface Props {
    stop: number;
}

const StopPopupContent = ({ id }: { id: number }) => {
    const { data, isLoading, isSuccess } = trpc.paradas.get.useQuery(
        { id: id },
        {
            cacheTime: 25 * 1000,
            refetchInterval: 60 * 1000,
        },
    );

    const uniqueLines = useMemo(() => {
        return Array.from(
            new Set(data?.lines.map(({ number }) => number)),
        )
            .map((number) => ({
                number,
                color: data?.lines.find((searchLine) =>
                    searchLine.number === number
                )?.color,
            }))
            .sort((a, b) => parseInt(a.number) - parseInt(b.number));
    }, [data]);

    return (
        <div className="absolute bottom-32 left-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-h-[50vh] overflow-y-auto">
            <div className="flex flex-row justify-between items-center mb-4">
                {isLoading
                    ? (
                        <div className="h-5 bg-neutral-200 rounded w-1/2 animate-pulse">
                            
                        </div>
                    )
                    : <h2 className="text-base font-semibold">{data?.name}</h2>}
                <div className="flex gap-2 justify-end">
                    <button className="p-1 hover:bg-gray-100 rounded-full">
                        <Star fill="yellow" size={15} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-full">
                        <Menu size={15} />
                    </button>
                </div>
            </div>

            {/* // TODO: Separar componente  */}

            <section className="flex flex-row gap-2">
                {/* Lineas ... */}
                {isSuccess
                    ? uniqueLines.map(({ color, number }) => (
                        <span
                            key={number}
                            className={`w-5 h-5 bg-yellow-300 rounded flex items-center justify-center text-white text-xs ${
                                color === "FFDD00"
                                    ? "text-neutral-900"
                                    : "text-neutral-50"
                            }`}
                            style={{ backgroundColor: `#${color}` }}
                        >
                            {number}
                        </span>
                    ))
                    : Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="w-5 h-5 bg-neutral-200 rounded animate-pulse"
                            >
                            </div>
                        ))}
            </section>

            <div className="w-full h-px bg-gray-200 my-4"></div>

            <section className="flex flex-col bg-neutral-50 h-full max-w-[90ch] m-auto font-medium text-neutral-900">
                <div className="flex flex-row p-3 pb-0 gap-2 items-center w-full text-neutral-700">
                    <p>Línea</p>
                    <p>Destino</p>
                    <p className="ml-auto">Llegada</p>
                </div>
                {isSuccess
                    ? (
                        data?.lines.map((line, index) => (
                            <div
                                key={index}
                                className="flex flex-row p-3 gap-2 items-center w-full border-b border-neutral-200"
                            >
                                <div className="w-5 h-5 bg-yellow-300 rounded flex items-center justify-center text-white text-xs">
                                    {line.number}
                                </div>
                                <p className="text-sm text-neutral-700">
                                    {line.destination}
                                </p>
                                <p className="ml-auto font-medium text-green-600">
                                    {line.arrival_time.replace("min", " min")}
                                </p>
                            </div>
                        ))
                    )
                    : isLoading
                    ? (
                        <div className="flex flex-col gap-2 p-3">
                            {[...Array(4)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex flex-row gap-2 items-center w-full animate-pulse"
                                >
                                    <div className="w-5 h-5 bg-neutral-200 rounded">
                                    </div>
                                    <div className="h-4 bg-neutral-200 rounded w-1/3">
                                    </div>
                                    <div className="ml-auto h-4 bg-neutral-200 rounded w-1/4">
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    : (
                        <p className="text-center font-bold text-sm">
                            Ha ocurrido un error y no se han obtenido
                            resultados.
                        </p>
                    )}
            </section>
        </div>
    );
};

const StopPopup = ({ id }: { id: number }) => {
    return (
        <Wrapper>
            <StopPopupContent id={id} />
        </Wrapper>
    );
};

export default StopPopup;
