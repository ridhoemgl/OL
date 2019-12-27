using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(OPR_OCEL_Enhance.Startup))]
namespace OPR_OCEL_Enhance
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
