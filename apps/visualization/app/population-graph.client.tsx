"use client";

// @ts-ignore
import { InformationCircleIcon } from "@heroicons/react/solid";

import {
  Card,
  Title,
  Text,
  Flex,
  Icon,
  LineChart,
  LineChartProps,
} from "@tremor/react";
import { useState } from "react";
import { ExportedData, useData } from "./lib/get-data";
import Loading from "./components/loading";
import PeopleList from "@/app/people-list.client";
export default function PopulationGraph() {
  const data = useData()

  if (data.isLoading || !data.data || data.error) return


  const ageChartArgs: LineChartProps = {
    className: "mt-5 h-72",
    // 12 lines (the districts)
    // each age has a value for each district - it is in the same dict
    // ie age 50 has dict of { district1: 1, district2: 2, ... }
    // data.data!.people is the array of people with age and district as props
    data: data.data!.,
    index: "age",
    categories: ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12"],
    colors: ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo"],
    showLegend: false,
    valueFormatter: (value) => `${value} people`,
    yAxisWidth: 56,
  };


  return (
            <div className="mt-6">
              <Card>
                <>
                  <div className="md:flex justify-between">
                    <div>
                      <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
                        <Title>Age distribution</Title>
                        <Icon
                          icon={InformationCircleIcon}
                          variant="simple"
                          tooltip="Shows the age distribution grouped by districts"
                        />
                      </Flex>
                      <Text>The age distribution grouped by districts for the end of the game</Text>
                    </div>
                    {/* <div>
                      <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex}>
                        <TabList color="gray" variant="solid">
                          <Tab>Sales</Tab>
                          <Tab>Profit</Tab>
                          <Tab>Customers</Tab>
                        </TabList>
                      </TabGroup>
                    </div> */}
                  </div>
                  {/* web */}
                  <div className="mt-8 hidden sm:block">
                    <LineChart {...ageChartArgs} />
                  </div>
                  {/* mobile */}
                  <div className="mt-8 sm:hidden">
                    <LineChart
                      {...ageChartArgs}
                      startEndOnly={true}
                      showGradient={false}
                      showYAxis={false}
                    />
                  </div>
                </>
              </Card>
            </div>
  );
}
