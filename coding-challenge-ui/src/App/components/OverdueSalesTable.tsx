import { Table, Typography } from "antd";
import { memo, useState, useMemo, useCallback } from "react";
import { sortAndDeduplicateDiagnostics } from "typescript";

import { getFlagEmoji, filterByCharacter } from "../utils";

const OverdueSalesTable = ({ orders = [], isLoading = false }: any) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns = useMemo(
    () => [
      {
        title: "MARKETPLACE",
        render: (record: any) => {
          const flag = getFlagEmoji(record.store.country.slice(0, 2));
          return (
            <div
              style={{
                fontWeight: "normal",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {`${flag} ${record.store.marketplace}`}
            </div>
          );
        },
        responsive: ["md"],
        sorter: (a:any, b:any) => filterByCharacter(a.store.marketplace, b.store.marketplace),
      },
      {
        title: "STORE",
        render: (record: any) => record.store.shopName,
        responsive: ["md"],
        sorter: (a:any, b:any) => filterByCharacter(a.store.shopName, b.store.shopName),
      },
      {
        title: "ORDER ID",
        dataIndex: "orderId",
        sorter: (a:any, b:any) => filterByCharacter(a.orderId, b.orderId),
      },
      {
        title: "ITEMS",
        dataIndex: "items",
        align: "right",
        sorter: (a:any, b:any) => a.items - b.items,
      },
      {
        title: "DESTINATION",
        dataIndex: "destination",
        responsive: ["md"],
        align: "right",
        sorter: (a:any, b:any) => filterByCharacter(a.destination, b.destination),
      },
      {
        title:"DAYS OVERDUE",
        render: (record: any) =>{
          
          let shipDateString = record.latest_ship_date;
          let shipDateStringUS = shipDateString.split('/')[1] + '/' + shipDateString.split('/')[0] + '/' + shipDateString.split('/')[2];

          let shipDate = new Date(shipDateStringUS);
          let currentDate = new Date();

          let timeOverdue = shipDate.getTime() - currentDate.getTime();
          let daysOverdue = timeOverdue / (1000 * 60 * 60 * 24);
          record.overdue = daysOverdue;

          return (
            <div style={{
              color: "red",
            }}>
              {`${Math.floor(daysOverdue)}`}
            </div>
            );
        },
        align: "right",
        sorter: (a:any, b:any) => (a.overdue - b.overdue),
      },
      {
        title:"ORDER VALUE",
        render: (record: any) => ('$' + record.orderValue),
        align: "right",
        sorter: (a:any, b:any) => (a.orderValue - b.orderValue), 
      },
      {
        title:"ORDER TAXES",
        render: (record: any) => (record.taxes + '%'),
        align: "right",
        sorter: (a:any, b:any) => (a.taxes - b.taxes), 

      },
      {
        title:"ORDER TOTAL",
        render: (record: any) => {
          let preTaxValue = record.orderValue * record.items;
          let taxedValue = (preTaxValue * (1 + (record.taxes / 100))).toFixed(2);
          record.orderTotal = taxedValue;
          return ('$' + taxedValue)
        },
        align: "right",
        sorter: (a:any, b:any) => (a.orderTotal - b.orderTotal), 
      },
    ],
    []
  );

  const onChange = useCallback((current: number, pageSize: number) => {
    setPagination({ current, pageSize });
  }, []);

  const showTotal = useCallback((total: any, range: any) => {
    return `${range[0]} - ${range[1]} of ${total}`;
  }, []);

  const paginationObj = useMemo(
    () => ({
      onChange,
      showTotal,
      pageSizeOptions: [5, 10],
      ...pagination,
    }),
    [onChange, pagination, showTotal]
  );
	
  const FooterTotal = () => {
    let subtotal = 0;
    let taxtotal = 0;
    if (orders && orders.length > 0){
      for (let i = 0; i < orders.length; i++){
        subtotal += (orders[i].orderValue * orders[i].items);
        taxtotal += ((orders[i].orderValue * orders[i].items) * ((orders[i].taxes) / 100));
      }
    }
    return(
      <div>
        <Typography.Paragraph >All Orders</Typography.Paragraph>
        <Typography.Paragraph>
          Sub Total: <strong>${subtotal.toFixed(2)}</strong><br/>
          Tax Total: <strong>${taxtotal.toFixed(3)}</strong><br/>
          Total: <strong>${(subtotal + taxtotal).toFixed(3)}</strong>
        </Typography.Paragraph>
      </div>
    )
  }

  return (
    <div>
      <Table
      size="small"
      // @ts-ignore
      columns={columns}
      loading={isLoading}
      dataSource={orders}
      pagination={paginationObj}
      />
      <FooterTotal/>
    </div>
  );
};

export default memo(OverdueSalesTable);
