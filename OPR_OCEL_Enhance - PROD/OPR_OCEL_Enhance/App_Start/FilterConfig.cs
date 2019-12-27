using System.Web;
using System.Web.Mvc;

namespace OPR_OCEL_Enhance
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
