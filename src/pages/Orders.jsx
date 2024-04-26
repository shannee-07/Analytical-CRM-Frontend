import React from 'react'

import Table from '../components/table/Table'

import customerList from '../assets/JsonData/customers-list.json'

import {localData} from "../assets/data";

import { formatDateTime, convertToReadableFormat } from "../api/callAPI";




const customerTableHead = [
    'orderId',
    `customer's name`,
    'Total Price',
    'Date',
    'Status'
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.orderId}</td>
        <td>{item.firstName} {item.lastName}</td>
        <td>{item.grandTotal}</td>
        <td>{formatDateTime(item.entryDate)}</td>
        <td>{convertToReadableFormat(item.statusId)}</td>
    </tr>
)

const Orders = () => {
    // console.log("GETTING ORDERS");
    // console.log(localData.orders);
    if(!localData.orders || localData.orders.length===0){
        window.location = "/"
    }
    return (
        <div>
            {/* <h2 className="page-header">
                customers
            </h2> */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={localData.orders}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orders;
