import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import StatusCard from "../components/status-card/StatusCard";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import statusCards from "../assets/JsonData/status-card-data.json";
import { useState } from "react";
import axios from "axios";
import { doGet, formatDateTime, convertToReadableFormat } from "../api/callAPI";
import Cookies from "js-cookie";
import {localData} from "../assets/data";
// import Notification from "../components/toast/Toast";

// const topCustomerss = {
//   head: ["user", "total orders", "total spending"],
//   body: [
//     {
//       username: "john doe",
//       order: "490",
//       price: "$15,870",
//     }
//   ],
// };

const renderCusomerHead = (item, index) => <th key={index}>{item}</th>;

const renderCusomerBody = (item, index) => (
  <tr key={index}>
    <td>{item.firstName} {item.lastName}</td>
    <td>{item.totalSpending}</td>
    <td>{item.totalOrders}</td>
    <td>{item.partyId}</td>
  </tr>
);

// const latestOrderss = {
//   header: ["order id", "user", "total price", "date", "status"],
//   body: [
//     {
//       id: "#OD1711",
//       user: "john doe",
//       date: "17 Jun 2021",
//       price: "$900",
//       status: "shipping",
//     }
//   ],
// };

// const orderStatus = {
//   shipping: "primary",
//   pending: "warning",
//   paid: "success",
//   refund: "danger",
// };

const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

// function formatDateTime(dateTimeString) {
//   const date = new Date(dateTimeString);
//   const year = date.getFullYear();
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const month = months[date.getMonth()]; // Get the month name as a three-letter abbreviation
//   const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
//   const hours = ('0' + date.getHours()).slice(-2);
//   const minutes = ('0' + date.getMinutes()).slice(-2);
  
//   return `${day} ${month} ${year} ${hours}:${minutes}`; // Format as specified
// }

// function convertToReadableFormat(inputString) {
//   const words = inputString.split('_');  
//   const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
//   const readableString = capitalizedWords.join(' ');
  
//   return readableString;
// }

const renderOrderBody = (item, index) => (
  <tr key={index}>
    <td>{item.orderId}</td>
    <td>{item.firstName} {item.lastName}</td>
    <td>{item.grandTotal}</td>
    <td>{formatDateTime(item.entryDate)}</td>
    <td>{convertToReadableFormat(item.statusId)}</td>

    {/* <td>
      <Badge type={orderStatus[item.status]} content={item.status} />
    </td> */}
  </tr>
);


const Dashboard = () => {
  const themeReducer = useSelector((state) => state.ThemeReducer.mode);
  //   const [charCategories, setChartCategories] = (null);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState("Loading");
  const [statusInfo, setStatusInfo] = useState([]);
  const [topCustomers, setTopCustomers] = useState({});
  const [latestOrders, setLatestOrders] = useState({});



  

  async function componentDidMount() {
    // setChartData;
    // Make the API call when the component mounts
    const response = await doGet("rest/services/getSummary");

    console.log(response);
    const { data } = response.data;
    console.log(data);
    let monthWiseOrders = data.monthWiseOrders;

    const orderMonths = monthWiseOrders.map((obj) => Object.keys(obj)[0]);
    const totalOrders = monthWiseOrders.map((obj) => Object.values(obj)[0]);

    setTopCustomers({
      head: ["name", "total Spending", "total Orders", "partyId"],
      body: [
        ...data.topCustomers
      ],
    });



    setLatestOrders({
      header: ["order id", "customer's name", "total price", "date", "status"],
      body: [
        ...data.latestOrders
        // {
        //   id: "#OD1711",
        //   user: "john doe",
        //   date: "17 Jun 2021",
        //   price: "$900",
        //   status: "shipping",
        // }
      ],
    })

    localData.orders= data.latestOrders;
    localData.customers= data.topCustomers

    setStatusInfo([
      {
        icon: "bx bx-shopping-bag",
        count: data.completedOrdersCount,
        title: "Completed Orders",
      },
      {
        icon: "bx bx-cart",
        count: data.completedItemsCount,
        title: "Completed Items",
      },
      {
        icon: "bx bx-dollar-circle",
        count: `₹${data.totalRevenue}`,
        title: "Total income",
      },
      {
        icon: "bx bx-receipt",
        count: data.completedOrdersCount,
        title: "Total orders",
      },
    ]);

    setChartOptions({
      series: [
        {
          name: "Total Completed Orders",
          data: [...totalOrders],
        },
      ],
      options: {
        color: ["#6ab04c", "#2980b9"],
        chart: {
          background: "transparent",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: [...orderMonths],
        },
        legend: {
          position: "top",
        },
        grid: {
          show: false,
        },
      },
    });
    setLoading(false);
  }

  useEffect(() => {
    componentDidMount();
  }, []);

  return (
    <>
      {/* <Notification text="Hello, world!" /> */}
      {loading == true ? (
        <div>{loadingContent}</div>
      ) : (
        <div>
          <h2 className="page-header">Dashboard</h2>
          <div className="row">
            <div className="col-6">
              <div className="row">
                {statusInfo.map((item, index) => {
                  console.log(item);
                  return (
                    <div className="col-6" key={index}>
                      <StatusCard
                        icon={item.icon}
                        count={item.count}
                        title={item.title}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-6">
              <div className="card full-height">
                {/* chart */}
                <Chart
                  options={
                    themeReducer === "theme-mode-dark"
                      ? {
                          ...chartOptions.options,
                          theme: { mode: "dark" },
                        }
                      : {
                          ...chartOptions.options,
                          theme: { mode: "light" },
                        }
                  }
                  series={chartOptions.series}
                  type="line"
                  height="100%"
                />
              </div>
            </div>
            <div className="col-4">
              <div className="card">
                <div className="card__header">
                  <h3>top customers</h3>
                </div>
                <div className="card__body">
                  <Table
                    headData={topCustomers.head}
                    renderHead={(item, index) => renderCusomerHead(item, index)}
                    bodyData={topCustomers.body.slice(0,6)}
                    renderBody={(item, index) => renderCusomerBody(item, index)}
                  />
                </div>
                <div className="card__footer">
                  <Link to="/customers">View All</Link>
                </div>
              </div>
            </div>
            <div className="col-8">
              <div className="card">
                <div className="card__header">
                  <h3>latest orders</h3>
                </div>
                <div className="card__body">
                  <Table
                    headData={latestOrders.header}
                    renderHead={(item, index) => renderOrderHead(item, index)}
                    bodyData={latestOrders.body.slice(0,7)}
                    renderBody={(item, index) => renderOrderBody(item, index)}
                  />
                </div>
                <div className="card__footer">
                  <Link to="/orders">View All</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
    // <></>
  );
};

export default Dashboard;
