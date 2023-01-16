import { Injectable } from '@nestjs/common';
import stockData from '../stock.json';
import transactionsData from '../transactions.json';
import { AllowedTransactions } from "./enum";
import { stockOptions } from './app.interface';
@Injectable()
export class AppService {
  getHello(): string {
    return "<ul><li>This project is made using node js, typescript</li><li>To install dependencies firstly enter, npm i</li><li>Start the project using, npm run start</li><li>Navigate to <a href='http://localhost:3000/getCurrentStock?sku=KPV897515/43/20'>Get Current Stock for SKU</a></li></ul>";
  }

  async getCurrentStock(query): Promise<any> {
    let searchMatch = [];

    try {
      const qtyNavigator = await getValue(query);
      searchMatch.push(qtyNavigator);
      return searchMatch;
    } catch (error) {
      let stockAvl: stockOptions = {
        'sku':'',
        'qty':0,
        'error':'error',
        'message':'This SKU value does not exist'
      }
      searchMatch.push(stockAvl);
      return searchMatch;
    }
  }
}
async function getValue(query) {
  return await new Promise<{ sku: string, qty: number }>((resolve, reject) => {
    let queryArr = [];
    let order_avl = 0;
    let order_refund = 0;
    queryArr.push(query);

    let transactionFilter_orders = transactionsData.filter(f =>
      queryArr.some(s => (f['sku'] == s['sku'])) && (f['type'] == AllowedTransactions["order"]));

    let transactionFilter_refund = transactionsData.filter(f =>
      queryArr.some(s => (f['sku'] == s['sku'])) && (f['type'] == AllowedTransactions["refund"]));

    if (transactionFilter_orders.length > 0) {
      order_avl = transactionFilter_orders.map(bill => bill.qty).reduce((acc, amount) => acc + amount);
    }

    if (transactionFilter_refund.length > 0) {
      order_refund = transactionFilter_refund.map(bill => bill.qty).reduce((acc, amount) => acc + amount);
    }

    let searchFilter = stockData.filter(f =>
      queryArr.some(s => (f['sku'] == s['sku'])));

    if (searchFilter.length > 0) {
      let availableStock: stockOptions = {
        'sku': searchFilter[0].sku,
        'qty': (searchFilter[0].stock + order_refund) - order_avl
      }
      resolve(availableStock);
    } else {
      if (transactionFilter_orders.length > 0 || transactionFilter_refund.length > 0) {
        let availableStock: stockOptions = {
          'sku': transactionFilter_orders[0].sku || transactionFilter_refund[0].sku,
          'qty': (0 + order_refund) - order_avl
        }
        resolve(availableStock);
      } else {
        reject("error");
      }
    }
  });
}