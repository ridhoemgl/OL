using System.Web;
using System.Web.Optimization;

namespace OPR_OCEL_Enhance
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            //kendo scripts
            bundles.Add(new ScriptBundle("~/bundles/kendo").Include(
            "~/Kendo/js/kendo.all.min.js",
            "~/Kendo/js/kendo.aspnetmvc.min.js"));

            //kendo Styles
            bundles.Add(new StyleBundle("~/Content/kendo/css").Include(
            "~/Kendo/css/kendo.common.min.css",
            "~/Kendo/css/kendo.silver.min.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}
