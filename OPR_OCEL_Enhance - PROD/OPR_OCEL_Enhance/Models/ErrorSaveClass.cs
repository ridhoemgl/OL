using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models
{
    public class ErrorSaveClass
    {
        public bool SaveError(string direktori, string tag, string nrp_session,  string @jsonSave)
        {
            try
            {
                string @path = System.Web.Hosting.HostingEnvironment.MapPath(string.Concat("~/FileUpload/", direktori, "/", tag, "_", nrp_session, "_", DateTime.Now.ToString("yyyyMMdd"), ".json"));
                using (StreamWriter outputfile = new StreamWriter(@path, true))
                {
                    outputfile.WriteLine(@jsonSave);
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}