using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models
{
    public class ClsInputRegistration
    {
        public DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();

        public bool ExcelArrayDB(string[,] source)
        {
            try
            {
                for (int i = 0; i < source.Length; i++)
                {
                    if (source[i, 1].Equals(null) && source[i, 2].Equals(null))
                    {
                        break;
                    }
                    else
                    {
                        db_.cusp_purge_insert_TSUKO_EXCEL(source[i, 1], source[i, 2], source[i, 3], source[i, 4]);
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}