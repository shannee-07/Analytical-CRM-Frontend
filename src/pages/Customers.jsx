import React from 'react'

import TableSelector from '../components/table/Table'

import customerList from '../assets/JsonData/customers-list.json'
import { localData } from '../assets/data'

const customerTableHead = [
    'First Name',
    'Last Name',
    'Total Spending',
    'Total Orders',
    'partyId',
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.firstName}</td>
        <td>{item.lastName}</td>
        <td>{item.totalSpending}</td>
        <td>{item.totalOrders}</td>
        <td>{item.partyId}</td>
    </tr>
)

const Customers = () => {
    console.log("getting customers data");
    if(!localData.customers || localData.customers.length===0){
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
                            <TableSelector  
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={localData.customers}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customers
