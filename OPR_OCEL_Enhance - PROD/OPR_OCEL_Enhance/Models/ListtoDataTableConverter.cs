using System.Web;
using System.Drawing;
using System.Reflection;
using System.Data;
using System.Linq;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
using System.Collections.Generic;

namespace OPR_OCEL_Enhance.Models
{
    public class ListtoDataTableConverter
    {
        public DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);
            //Get all the properties  
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            // Loop through all the properties  
            foreach (PropertyInfo prop in Props)
            {
                //Setting column names as Property names  
                dataTable.Columns.Add(prop.Name);
            }

            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows  
                    values[i] = Props[i].GetValue(item, null);
                }
                // Finally add value to datatable  
                dataTable.Rows.Add(values);

            }
            //put a breakpoint here and check datatable of return values  
            return dataTable;
        }
    }
}