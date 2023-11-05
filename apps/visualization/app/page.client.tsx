"use client";

import { InformationCircleIcon } from "@heroicons/react/solid";

import {
  Card,
  Grid,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  BadgeDelta,
  DeltaType,
  Flex,
  Metric,
  ProgressBar,
  AreaChart,
  Color,
  Icon,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  AreaChartProps,
  BarChart,
  LineChart,
  LineChartProps,
} from "@tremor/react";

type Kpi = {
  title: string;
  metric: string;
  progress: number;
  target: string;
  delta: string;
  deltaType: DeltaType;
};

const kpiData: Kpi[] = [
  {
    title: "Sales",
    metric: "$ 12,699",
    progress: 15.9,
    target: "$ 80,000",
    delta: "13.2%",
    deltaType: "moderateIncrease",
  },
  {
    title: "Profit",
    metric: "$ 45,564",
    progress: 36.5,
    target: "$ 125,000",
    delta: "23.9%",
    deltaType: "increase",
  },
  {
    title: "Customers",
    metric: "1,072",
    progress: 53.6,
    target: "2,000",
    delta: "10.1%",
    deltaType: "moderateDecrease",
  },
];

import { useState } from "react";
import { ExportedData, useData } from "./lib/get-data";
import Loading from "./components/loading";

const usNumberformatter = (number: number, decimals = 0) =>
  Intl.NumberFormat("us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

const formatters: { [key: string]: any } = {
  Sales: (number: number) => `$ ${usNumberformatter(number)}`,
  Profit: (number: number) => `$ ${usNumberformatter(number)}`,
  Customers: (number: number) => `${usNumberformatter(number)}`,
  Delta: (number: number) => `${usNumberformatter(number, 2)}%`,
};

const Kpis = {
  Sales: "Sales",
  Profit: "Profit",
  Customers: "Customers",
};

const kpiList = [Kpis.Sales, Kpis.Profit, Kpis.Customers];

export type DailyPerformance = {
  date: string;
  Sales: number;
  Profit: number;
  Customers: number;
};

// export const performance: DailyPerformance[] = [
//   {
//     date: "2023-05-01",
//     Sales: 900.73,
//     Profit: 173,
//     Customers: 73,
//   },
//   {
//     date: "2023-05-02",
//     Sales: 1000.74,
//     Profit: 174.6,
//     Customers: 74,
//   },
//   {
//     date: "2023-05-03",
//     Sales: 1100.93,
//     Profit: 293.1,
//     Customers: 293,
//   },
//   {
//     date: "2023-05-04",
//     Sales: 1200.9,
//     Profit: 290.2,
//     Customers: 29,
//   },
// ];

export const performance: DailyPerformance[] = new Array(100).fill(0).map((_, i) => ({
  // date: `Day: ${i}`,
  date: `${i}`,
  Sales: Math.random() * 1000,
  Profit: Math.random() * 1000,
  Customers: Math.random() * 1000,
  Line2: Math.random() * 300,
}));

export type SalesPerson = {
  name: string;
  leads: number;
  sales: string;
  quota: string;
  variance: string;
  region: string;
  status: string;
};

export const salesPeople: SalesPerson[] = [
  {
    name: "Peter Doe",
    leads: 45,
    sales: "1,000,000",
    quota: "1,200,000",
    variance: "low",
    region: "Region A",
    status: "overperforming",
  },
  {
    name: "Lena Whitehouse",
    leads: 35,
    sales: "900,000",
    quota: "1,000,000",
    variance: "low",
    region: "Region B",
    status: "average",
  },
  {
    name: "Phil Less",
    leads: 52,
    sales: "930,000",
    quota: "1,000,000",
    variance: "medium",
    region: "Region C",
    status: "underperforming",
  },
  {
    name: "John Camper",
    leads: 22,
    sales: "390,000",
    quota: "250,000",
    variance: "low",
    region: "Region A",
    status: "overperforming",
  },
  {
    name: "Max Balmoore",
    leads: 49,
    sales: "860,000",
    quota: "750,000",
    variance: "low",
    region: "Region B",
    status: "overperforming",
  },
];

const deltaTypes: { [key: string]: DeltaType } = {
  average: "unchanged",
  overperforming: "moderateIncrease",
  underperforming: "moderateDecrease",
};


function formatAge(people: ExportedData["people"]) {
  // Assuming the data is an array of objects with district and age properties

  // Initialize an empty object to store the intermediate result
  let intermediate = {} as Record<string, Record<string, number>>;

  // Loop through the data array
  for (let item of people) {
    // Get the district and age values of the current item
    let district = item.district;
    let age = item.age;

    // Check if the intermediate object already has a property with the age value
    if (intermediate.hasOwnProperty(age)) {
      // If yes, increment the count of the district by one
      intermediate[age][`District ${district}`] = (intermediate[age][`District ${district}`] || 0) + 1;
    } else {
      // If not, create a new property with the age value and assign an object with the district and count of one
      intermediate[age] = { [`District ${district}`]: 1 };
    }
  }

  // Initialize an empty array to store the final result
  let result = [];

  // Loop through the intermediate object
  for (let key in intermediate) {
    // Get the value of the current key
    let value = intermediate[key];

    // Add a new object to the result array with the age and district properties
    result.push({ age: Number(key), ...value });
  }

  // // make sure there is each age (even if 0) and include to the 10s colum (min age 39 = 30 age included)
  // for (let i = 0; i < 100; i += 10) {
  //   if (!result.find((item) => item.age === i)) {
  //     result.push({ age: i, ...{ "District 1": 0, "District 2": 0, "District 3": 0, "District 4": 0, "District 5": 0, "District 6": 0, "District 7": 0, "District 8": 0, "District 9": 0, "District 10": 0, "District 11": 0, "District 12": 0 } })
  //   }
  // }

  // sort by age
  return result.sort((a, b) => a.age - b.age);
  // return result;
}


export default function DashboardExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = kpiList[selectedIndex];
  const [selectedDistrict, setSelectedDistrict] = useState<string | number>("all");
  const [personFilter, setPersonFilter] = useState(
    ['dead', 'alive', 'male', 'female', 'child', 'adult', 'elder']
  );

  const isPersonSelected = (person: ExportedData["people"][0]) =>
    (person.district.toString() === selectedDistrict || selectedDistrict === "all") 
    // (personFilter.includes('dead') ? person.diedAt : true) &&
    // (personFilter.includes('alive') ? !person.diedAt : true) &&
    // (personFilter.includes('male') ? person.sex === 'male' : true) &&
    // (personFilter.includes('female') ? person.sex === 'female' : true) &&
    // (personFilter.includes('child') ? person.age > 18 : true) &&
    // (personFilter.includes('adult') ? (person.age >= 18 || person.age < 65) : true) &&
    // (personFilter.includes('elder') ? person.age >= 65 : true);



  // (selectedNames.includes(salesPerson.name) || selectedNames.length === 0);

  // console.log("selectedDistrict", typeof selectedDistrict, selectedDistrict)

  const areaChartArgs: AreaChartProps = {
    className: "mt-5 h-72",
    data: performance,
    index: "date",
    categories: [selectedKpi, 'Line2'],
    colors: ["blue", "red"],
    showLegend: false,
    valueFormatter: formatters[selectedKpi],
    yAxisWidth: 56,
  };

  const data = useData()

  const isLoading = data.isLoading
  if (isLoading || !data.data) {
    return <Loading />
  }

  const isError = data.error
  if (isError) {
    return <div>Error: {data.error.message}</div>
  }


  const ageChartArgs: LineChartProps = {
    className: "mt-5 h-72",
    // 12 lines (the districts)
    // each age has a value for each district - it is in the same dict
    // ie age 50 has dict of { district1: 1, district2: 2, ... }
    // data.data!.people is the array of people with age and district as props
    data: formatAge(data.data!.people),
    index: "age",
    categories: ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12"],
    colors: ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo"],
    showLegend: false,
    valueFormatter: (value) => `${value} people`,
    yAxisWidth: 56,
  };


  return (
    <main className="p-6 sm:p-10">
      <Title>Dashboard</Title>
      <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>People</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsLg={3} className="mt-6 gap-6">
              {kpiData.map((item) => (
                <Card key={item.title}>
                  <Flex alignItems="start">
                    <div className="truncate">
                      <Text>{item.title}</Text>
                      <Metric className="truncate">{item.metric}</Metric>
                    </div>
                    <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
                  </Flex>
                  <Flex className="mt-4 space-x-2">
                    <Text className="truncate">{`${item.progress}% (${item.metric})`}</Text>
                    <Text>{item.target}</Text>
                  </Flex>
                  <ProgressBar value={item.progress} className="mt-2" />
                </Card>
              ))}
            </Grid>
            <div className="mt-6">
              <Card>
                <>
                  <div className="md:flex justify-between">
                    <div>
                      <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
                        <Title> Performance History </Title>
                        <Icon
                          icon={InformationCircleIcon}
                          variant="simple"
                          tooltip="Shows daily increase or decrease of particular domain"
                        />
                      </Flex>
                      <Text> Daily change per domain </Text>
                    </div>
                    <div>
                      <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex}>
                        <TabList color="gray" variant="solid">
                          <Tab>Sales</Tab>
                          <Tab>Profit</Tab>
                          <Tab>Customers</Tab>
                        </TabList>
                      </TabGroup>
                    </div>
                  </div>
                  {/* web */}
                  <div className="mt-8 hidden sm:block">
                    <AreaChart {...areaChartArgs} />
                  </div>
                  {/* mobile */}
                  <div className="mt-8 sm:hidden">
                    <AreaChart
                      {...areaChartArgs}
                      startEndOnly={true}
                      showGradient={false}
                      showYAxis={false}
                    />
                  </div>
                </>
              </Card>
            </div>

            {/* Graph 2 */}
            <div className="mt-6">
              <Card>
                <>
                  <div className="md:flex justify-between">
                    <div>
                      <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
                        <Title> Age distribution </Title>
                        <Icon
                          icon={InformationCircleIcon}
                          variant="simple"
                          tooltip="Shows daily increase or decrease of particular domain"
                        />
                      </Flex>
                      <Text> Daily change per domain </Text>
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
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <>
                  <div>
                    <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
                      <Title>People in the game</Title>
                      <Icon
                        icon={InformationCircleIcon}
                        variant="simple"
                        tooltip="Shows all the people in the game and all their stats"
                      />
                    </Flex>
                  </div>
                  <div className="flex space-x-2">
                    {/* <MultiSelect
                      className="max-w-full sm:max-w-xs"
                      onValueChange={setSelectedNames}
                      placeholder="Select Salespeople..."
                    >
                      {data.data.people.map((item) => (
                        <MultiSelectItem key={item.id} value={item.name}>
                          {item.name}
                        </MultiSelectItem>
                      ))}
                    </MultiSelect> */}
                    <Select
                      className="max-w-full sm:max-w-xs"
                      defaultValue="all"
                      onValueChange={setSelectedDistrict}
                      placeholder={selectedDistrict == 'all' ? "Select District..." : "District " + selectedDistrict}
                    >
                      <>
                        <SelectItem value="all">All Districts</SelectItem>
                        {/* <SelectItem value="overperforming">Overperforming</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="underperforming">Underperforming</SelectItem> */}
                        {Object.keys(data.data.districtCensus).map((item) => (
                          <SelectItem key={item} value={item}>
                            District {item}
                          </SelectItem>
                        ))}
                      </>
                    </Select>

                    {/* other filter - dead/alive/male/female/child/adult/elder
                    <MultiSelect
                      className="max-w-full sm:max-w-xs"
                      // @ts-ignore it is legal...
                      onValueChange={setPersonFilter}
                      placeholder="Select Filter..."
                      defaultValue={['dead', 'alive', 'male', 'female', 'child', 'adult', 'elder']}
                    >
                      <MultiSelectItem value="dead">Dead</MultiSelectItem>
                      <MultiSelectItem value="alive">Alive</MultiSelectItem>

                      <MultiSelectItem value="male">Male</MultiSelectItem>
                      <MultiSelectItem value="female">Female</MultiSelectItem>

                      <MultiSelectItem value="child">Child</MultiSelectItem>
                      <MultiSelectItem value="adult">Adult</MultiSelectItem>
                      <MultiSelectItem value="elder">Elder</MultiSelectItem>

                    </MultiSelect> */}


                  </div>
                  <Table className="mt-6">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell className="text-right">Sex</TableHeaderCell>
                        <TableHeaderCell className="text-right">District</TableHeaderCell>
                        <TableHeaderCell className="text-right">Age at end</TableHeaderCell>
                        <TableHeaderCell className="text-right">Died at?</TableHeaderCell>
                        {/* <TableHeaderCell className="text-right">Status</TableHeaderCell> */}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.data.people
                        .filter((person) => isPersonSelected(person))
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">{item.sex == 'male' ? "Male" : "Female"}</TableCell>
                            <TableCell className="text-right">District {item.district}</TableCell>
                            <TableCell className="text-right">{item.age} years old</TableCell>
                            <TableCell className="text-right">{item.diedAt ? `Year ${item.diedAt}` : null}</TableCell>
                            {/* <TableCell className="text-right">
                              <BadgeDelta deltaType={deltaTypes[item.status]} size="xs">
                                {item.status}
                              </BadgeDelta>
                            </TableCell> */}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
