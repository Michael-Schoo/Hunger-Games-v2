"use client"
import useSWR from "swr"
import { ExportedData as IExportedData } from "../../../game/src/export"
import { addBasePath } from "next/dist/client/add-base-path";

export type ExportedData = IExportedData


async function getData() {
    const res = await fetch(addBasePath("/data.json"))
    const data = await res.json()
    return data
}

export function useData() {
    return useSWR<ExportedData>(
        `/data.json`,
        getData,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            shouldRetryOnError: false,
        },
    )

}

